// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Project.sol";

contract ProjectManage {
    using Counters for Counters.Counter;

    Counters.Counter private totalProjectCount;

    struct ProjectInfo {
        address contractAddress;
        string projectId;
    }

    address[] private founders;
    mapping(address => ProjectInfo[]) public ownerToProjects; // account -> project contract addresses

    event DeployedNewProject(address founderAddress, address contractAddress);

    constructor() {}

    modifier isProjectExist(address founder, string memory id) {
        bool _exist = checkProjectExist(founder, id);
        require(!_exist, "Project already lived");
        _;
    }

    function checkProjectExist(address founder, string memory id)
        public
        view
        returns (bool)
    {
        bool isExist = false;
        for (uint256 i = 0; i < ownerToProjects[founder].length; i++) {
            if (
                keccak256(
                    abi.encodePacked((ownerToProjects[founder][i].projectId))
                ) == keccak256(abi.encodePacked((id)))
            ) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }

    function createProject(
        string memory _pid,
        address _usdc_address
        // string memory name,
        // string memory description,
        // uint256 budget
    ) public isProjectExist(msg.sender, _pid) returns (address) {
        require(_usdc_address != address(0), "Invalid address");

        if (ownerToProjects[msg.sender].length == 0) {
            founders.push(msg.sender);
        }
        totalProjectCount.increment();
        Project newProject = new Project(
            _usdc_address,
            msg.sender,
            _pid
            // name,
            // description,
            // budget
        );
        ownerToProjects[msg.sender].push(
            ProjectInfo(address(newProject), _pid)
        );
        emit DeployedNewProject(msg.sender, address(newProject));
        return address(newProject);
    }

    function getProjectContractAddresses(address _owner)
        public
        view
        returns (ProjectInfo[] memory)
    {
        ProjectInfo[] storage projects = ownerToProjects[_owner];
        return projects;
    }

    function deleteProject(address _projectAddress) external {
        require(_projectAddress != address(0), "Invalid address");

        ProjectInfo[] memory projects = ownerToProjects[msg.sender];
        bool exist = false;
        for (uint256 i = 0; i < projects.length; i++) {
            if (projects[i].contractAddress == _projectAddress) {
                exist = true;
            }
        }
        require(exist, "Project not found");

        delete ownerToProjects[msg.sender];

        uint256 loop = 0;
        for (uint256 i = 0; i < projects.length; i++) {
            if (projects[i].contractAddress != _projectAddress) {
                ownerToProjects[msg.sender].push(projects[i]);
                loop++;
            }
        }

        if (loop == 0) {
            address[] memory updatedFounders = new address[](
                founders.length - 1
            );
            loop = 0;
            for (uint256 j = 0; j < founders.length; j++) {
                if (founders[j] != msg.sender) {
                    updatedFounders[loop] = founders[j];
                    loop++;
                }
            }
            founders = updatedFounders;
        }
    }

    function getFounderFromProjectAddress(address _projectAddress)
        external
        view
        returns (address)
    {
        require(_projectAddress != address(0), "Invalid project address");

        address founder = address(0);
        for (uint256 i = 0; i < founders.length; i++) {
            for (uint256 j = 0; j < ownerToProjects[founders[i]].length; j++) {
                if (
                    ownerToProjects[founders[i]][j].contractAddress ==
                    _projectAddress
                ) {
                    founder = founders[i];
                    break;
                }
            }
        }
        return founder;
    }
}
