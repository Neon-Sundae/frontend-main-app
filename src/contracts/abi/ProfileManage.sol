// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./Profile.sol";

contract ProfileManage {
    using Counters for Counters.Counter;

    Counters.Counter private totalProfileCount;

    mapping(address => address) public ownerToProfileAddress; // account -> profile contract address

    constructor() {}

    function createProfile(
        address _usdcaddress,
        string memory name,
        string memory title
    ) public returns (address) {
        require(_usdcaddress != address(0), "Invalid address");
        require(
            ownerToProfileAddress[msg.sender] == address(0),
            "Your profile already created"
        );

        totalProfileCount.increment();
        Profile newProfile = new Profile(_usdcaddress, msg.sender, name, title);
        ownerToProfileAddress[msg.sender] = address(newProfile);
        return address(newProfile);
    }

    function getProfileContractAddress(address _owner)
        external
        view
        returns (address)
    {
        return ownerToProfileAddress[_owner];
    }

    function deleteProfile() external {
        delete ownerToProfileAddress[msg.sender];
    }
}
