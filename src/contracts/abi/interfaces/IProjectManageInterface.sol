// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IProjectManageInterface {
    function getFounderFromProjectAddress(address _projectAddress)
        external
        view
        returns (address);
}
