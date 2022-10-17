// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IProfileManageInterface.sol";
import "./interfaces/IProjectManageInterface.sol";
import "./interfaces/IProjectInterface.sol";
import "./interfaces/IProfileInterface.sol";
import "./interfaces/IFNDRInterface.sol";

contract Task is ERC721Enumerable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using Strings for uint256;
    Counters.Counter private taskCount;

    IERC20 public USDCtoken;

    enum State {
        WAITING_FOR_BUILDER,
        BUILDER_ACCEPTED,
        COMPLETE,
        CANCELLED
    }

    struct TaskInfo {
        string name;
        State currentState;
        address projectAddress; // deployed project address
        address founderAddress; // founder wallet address
        address builderAddress; // builder wallet address
        uint256 usdc_amount;
        uint256 fndr_amount;
        uint256 xp;
        bool isBuilderAgreed;
    }

    address private FL_wallet =
        address(0x5EE8D1B65942116dA65700849d65cc839E38cC5e);
    address private profileManageContractAddress =
        address(0xb5C051088E47D8D69824Bac79499f90042341D02);
    address private projectManageContractAddress =
        address(0x64E92a7B43F4395F8c731B8932c9677a829F642b);
    address private fndrContractAddress =
        address(0xaf269459B32bB2d5C46483C3dEe571C671Ca0Fd5);

    bool private locked = true;
    mapping(uint256 => TaskInfo) public idToTask; // token id -> TaskInfo

    event TaskCreated(address builderAddress, uint256 taskId);
    event TaskCompleted(
        address founderAddress,
        address builderAddress,
        uint256 usdc
    );

    constructor(
        address _usdc_address,
        address _fndr_address,
        address _profileManageAddress,
        address _projectManageAddress
    ) ERC721("Builder Task", "Task") {
        USDCtoken = IERC20(_usdc_address);
        profileManageContractAddress = _profileManageAddress;
        projectManageContractAddress = _projectManageAddress;
        fndrContractAddress = _fndr_address;
    }

    modifier isExist(uint256 _id) {
        require(_exists(_id), "Task not found");
        _;
    }

    modifier isExceedBudget(address projectAddress, uint256 taskBudget) {
        uint256 project_budget = USDCtoken.balanceOf(projectAddress);
        // uint256[] memory taskIds = IProjectInterface(projectAddress)
        //     .getTaskIds();
        // uint256 sum = 0;
        // for (uint256 i = 0; i < taskIds.length; i++) {
        //     sum += idToTask[taskIds[i]].usdc_amount;
        // }
        require(
            project_budget >= (taskBudget * 110) / 100,
            "Total task budget exceeds project budget"
        );
        _;
    }

    modifier isFounder(address projectAddress) {
        address founder = IProjectManageInterface(projectManageContractAddress)
            .getFounderFromProjectAddress(projectAddress);
        require(
            founder == msg.sender,
            "Only project's founder can create a task on chain"
        );
        _;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(!locked, "Task token cannot transfer.");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // Only this task's founder can call this function
    function createTask(
        address _projectAddress,
        address _builderAddress,
        string memory _name,
        uint256 _usdc,
        uint256 _xp,
        uint256 _difficulty
    )
        external
        isExceedBudget(_projectAddress, _usdc)
        isFounder(_projectAddress)
    {
        address builderProfileAddress = IProfileManageInterface(
            profileManageContractAddress
        ).getProfileContractAddress(_builderAddress);
        require(
            builderProfileAddress != address(0),
            "Builder profile does not exist on chain"
        );
        require(_difficulty > 0 && _difficulty < 6, "Invalid task difficulty");
        require(
            _xp == calculateXP(_difficulty, builderProfileAddress),
            "Invalid XP"
        );

        locked = false;
        taskCount.increment();
        // uint256 currentId = totalSupply();
        // mint NFT
        _safeMint(_builderAddress, taskCount.current());
        idToTask[taskCount.current()] = TaskInfo(
            _name,
            State.WAITING_FOR_BUILDER,
            _projectAddress,
            msg.sender,
            _builderAddress,
            _usdc,
            0,
            _xp,
            false
        );
        locked = true;
        emit TaskCreated(_builderAddress, taskCount.current());
    }

    function getTaskById(uint256 _tokenId)
        external
        view
        isExist(_tokenId)
        returns (TaskInfo memory)
    {
        return idToTask[_tokenId];
    }

    // Only accepted builder can commit to task.
    function commitToTask(uint256 _taskId, uint256 _amount)
        external
        isExist(_taskId)
    {
        require(
            idToTask[_taskId].builderAddress == msg.sender,
            "You're not a accepted builder."
        );
        require(
            idToTask[_taskId].currentState == State.WAITING_FOR_BUILDER,
            "Invalid task state"
        );
        require(
            IFNDRInterface(fndrContractAddress).balanceOf(msg.sender) >=
                _amount,
            "Insufficient FNDR amount"
        );
        IFNDRInterface(fndrContractAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        idToTask[_taskId].fndr_amount = _amount;
        idToTask[_taskId].currentState = State.BUILDER_ACCEPTED;
    }

    // Only this task's founder can call this function
    function completeTask(uint256 _taskId) external isExist(_taskId) {
        require(
            idToTask[_taskId].founderAddress == msg.sender,
            "Only founder can complete the task"
        );
        require(
            idToTask[_taskId].currentState == State.BUILDER_ACCEPTED,
            "Task should be in review"
        );

        address builderProfileAddress = IProfileManageInterface(
            profileManageContractAddress
        ).getProfileContractAddress(idToTask[_taskId].builderAddress);

        USDCtoken.transfer(
            builderProfileAddress,
            (idToTask[_taskId].usdc_amount * 95) / 100
        );
        USDCtoken.transfer(
            FL_wallet,
            (idToTask[_taskId].usdc_amount * 5) / 100
        );

        USDCtoken.transfer(FL_wallet, idToTask[_taskId].usdc_amount / 10);

        idToTask[_taskId].currentState = State.COMPLETE;

        IProfileInterface(builderProfileAddress).updateXP(idToTask[_taskId].xp);
        IProfileInterface(builderProfileAddress).updateUSDCAmount(
            (idToTask[_taskId].usdc_amount * 95) / 100
        );
        IFNDRInterface(fndrContractAddress).burn(
            address(this),
            idToTask[_taskId].fndr_amount
        );

        emit TaskCompleted(
            idToTask[_taskId].founderAddress,
            idToTask[_taskId].builderAddress,
            (idToTask[_taskId].usdc_amount * 95) / 100
        );
    }

    function checkTaskId(uint256 _taskId) external view returns (bool) {
        return _exists(_taskId);
    }

    // Only this task's founder can call this function
    function cancelTask(uint256 _taskId) public isExist(_taskId) {
        require(
            idToTask[_taskId].founderAddress == msg.sender,
            "Only founder can cancel the task"
        );
        require(
            idToTask[_taskId].currentState != State.COMPLETE &&
                idToTask[_taskId].currentState != State.CANCELLED,
            "Task already completed or cancelled"
        );
        if (idToTask[_taskId].currentState == State.BUILDER_ACCEPTED) {
            IFNDRInterface(fndrContractAddress).transfer(
                idToTask[_taskId].builderAddress, // msg.sender
                idToTask[_taskId].fndr_amount
            );
        }
        USDCtoken.transfer(
            idToTask[_taskId].projectAddress,
            idToTask[_taskId].usdc_amount
        );
        USDCtoken.transfer(
            idToTask[_taskId].projectAddress,
            idToTask[_taskId].usdc_amount / 10
        );
        idToTask[_taskId].currentState = State.CANCELLED;
    }

    function calculateXP(uint256 _difficulty, address _builderProfileAddress)
        public
        view
        returns (uint256)
    {
        uint256 LEVEL_INCREMENTOR = 1000;

        uint256 _totalXp = IProfileInterface(_builderProfileAddress)
            .getTotalXP();
        uint256 xp = 0;
        if (_difficulty < 2) {
            xp = (_difficulty + 10)**2 - (2 - _difficulty) * 50;
        } else {
            xp = (_difficulty + 10)**2 + (_difficulty - 2) * 50;
        }
        if (_totalXp < 50 * LEVEL_INCREMENTOR) xp += 45;
        if (_totalXp < 20 * LEVEL_INCREMENTOR) xp += 45;

        return xp;
    }
}
