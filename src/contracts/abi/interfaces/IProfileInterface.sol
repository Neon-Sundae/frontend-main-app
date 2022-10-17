// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IProfileInterface {
    function getTotalXP() external view returns (uint256);

    function getEarnedUSDC() external view returns (uint256);

    function updateXP(uint256 _xp) external;

    function updateUSDCAmount(uint256 _amount) external;
}
