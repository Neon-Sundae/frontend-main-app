// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IProfileManageInterface {
    function getProfileContractAddress(address _owner)
        external
        view
        returns (address);
}
