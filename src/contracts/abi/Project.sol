// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/ITaskInterface.sol";
import "./interfaces/IProjectManageInterface.sol";
import "./Task.sol";

contract Project {
    using SafeMath for uint256;
    using Strings for uint256;

    IERC20 public USDCtoken;

    address public founderAddress;
    string public projectId;
    uint256[] public taskIds;
    // bool public isDeposit;

    // Why do we need State?
    // enum State {
    //     OPEN,
    //     IN_PROGRESS,
    //     COMPLETE
    // }

    // We should use project uuid instead of name, description
    // string public name;
    // string public description;
    // uint256 public budget;
    // State public currentState;

    // We are not using this variable
    // // uint256 private fee = 10;

    address private FL_wallet =
        address(0x5EE8D1B65942116dA65700849d65cc839E38cC5e);

    constructor(
        address _tokenAddress,
        address _owner,
        string memory _projectId
    ) 
    {
        USDCtoken = IERC20(_tokenAddress);
        founderAddress = _owner;
        projectId = _projectId;
        // isDeposit = false;
        // name = _name;
        // description = _description;
        // budget = _budget;
        // currentState = State.OPEN;
    }

    modifier onlyOwner() {
        require(msg.sender == founderAddress, "You're not a project founder");
        _;
    }

    // fn -> onlyOwner
    // we will have a list of addresses which can be called as owners
    // then we add the new address?

    // will require change in modifier onlyOwner also to check whether the address is inside the array or not

    function withdraw(uint256 _amount) public onlyOwner {
        uint256 balance = USDCtoken.balanceOf(address(this));
        require(balance > 0, "Insufficient USDC balance");
        require(balance >= _amount, "Insufficient USDC balance");
        // require(currentState == State.OPEN, "Project already started"); // ??? -> With this we can prevent the withdraw but if the amount is transferred
        // to task contract from this then do we need any prevention like this?

        USDCtoken.transfer(founderAddress, _amount);
    }

    function depositFunds(uint256 _amount) public {
        require(_amount > 0, "Zero amount of token");

        USDCtoken.transferFrom(msg.sender, address(this), _amount);
    }

    function addTask(uint256 _taskId, address _taskAddress) external onlyOwner {
        bool exist = ITaskInterface(_taskAddress).checkTaskId(_taskId);
        require(exist, "Task not found");

        bool added = false;
        for (uint256 i = 0; i < taskIds.length; i++) {
            if (taskIds[i] == _taskId) {
                added = true;
                break;
            }
        }
        require(!added, "Already added in project");

        ITaskInterface.TaskInfo memory taskInfo = ITaskInterface(_taskAddress)
            .getTaskById(_taskId);
        USDCtoken.transfer(_taskAddress, (taskInfo.usdc_amount * 110) / 100);
        // USDCtoken.transfer(FL_wallet, taskInfo.usdc_amount / 10);

        taskIds.push(_taskId);
    }

    // Not called on frontend because task cancellation is there
    function removeTask(uint256 _taskId) external onlyOwner {
        require(_taskId != 0, "Task not found");
        // require(Task(_taskAddress).isExist(_taskId));

        bool exist = false;
        for (uint256 i = 0; i < taskIds.length; i++) {
            if (taskIds[i] == _taskId) {
                exist = true;
            }
        }
        require(exist, "Task not found");

        uint256[] memory tempIds = new uint256[](taskIds.length - 1);
        uint256 loop = 0;
        for (uint256 i = 0; i < taskIds.length; i++) {
            if (taskIds[i] != _taskId) {
                tempIds[loop] = taskIds[i];
                loop++;
            }
        }
        taskIds = tempIds;
    }

    function getTaskIds() external view returns (uint256[] memory) {
        return taskIds;
    }

    // Not called in frontend
    // // function startProject() external onlyOwner {
    // //     require(currentState == State.OPEN, "Already started");
    // //     currentState = State.IN_PROGRESS;
    // // }

    // Not called in frontend
    // // function completeProject() external onlyOwner {
    // //     require(
    // //         currentState == State.IN_PROGRESS,
    // //         "This project is only open."
    // //     );

    // //     currentState = State.COMPLETE;
    // // }

    // We are not updating budget anymore
    // // function updateProjectBudget(uint256 _newBudget) external onlyOwner {
    // //     require (isDeposit, "Not allowed to deposit");

    // //     require(USDCtoken.balanceOf(address(this)) >= ((budget * 110) / 100), "You can't update the budget for project because not enough the current balance.");
    // //     USDCtoken.transfer(msg.sender, ((budget * 110) / 100));
    // //     isDeposit = false;
    // //     _updateBudgetDepositFunds(_newBudget);

    // //     budget = _newBudget;
    // // }

    // Not needed, should be handled by project uuid
    // // function updateProjectName(string memory _name) external onlyOwner {
    // //     name = _name;
    // // }

    // Not needed, should be handled by project uuid
    // // function updateProjectDescription(string memory _description)
    // //     external
    // //     onlyOwner
    // // {
    // //     description = _description;
    // // }

    // Maybe not needed
    // function getProjectBalance() external view returns (uint256) {
    //     return USDCtoken.balanceOf(address(this));
    // }

    // We are not using budget variable instead directly returning the USDCtoken balance (maybe that's also not needed)
    // as USDCtoken balance can be checked from frontend also
    // // function getProjectBuget() external view returns (uint256) {
    // //     return budget;
    // // }
}
