// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IProjectInterface {
    // function getProjectBuget() external view returns (uint256);

    function getTaskIds() external view returns (uint256[] memory);
}
