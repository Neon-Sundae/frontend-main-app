// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Profile {
    using SafeMath for uint256;

    string public name;
    string public title;
    uint256 public totalXp = 0;
    uint256 public usdc = 0;
    uint256 public level = 0;

    // Contract owner address
    address public owner;

    // For storing the instance of ERC20 token
    IERC20 public _token;

    // Constructor to make the contract deployer the owner of this contract
    // and create the instance of the token
    constructor(
        address _tokenAddress,
        address _owner,
        string memory _name,
        string memory _title
    ) {
        _token = IERC20(_tokenAddress);
        owner = _owner;
        name = _name;
        title = _title;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Update Founder / Builder's profild data
    // IN: Founder or Builder's name
    function updateProfileName(string memory _name) public onlyOwner {
        name = _name;
    }

    // Update Founder / Builder's profild data
    // IN: Founder or Builder's profile title
    function updateProfileTitle(string memory _title) public onlyOwner {
        title = _title;
    }

    // Update Founder / Builder's profild data
    // IN: Founder or Builder's address and increased XP value, will be called by the Task contract ONLY!
    function updateXP(uint256 _xp) external {
        require(_xp > 0, "Invalid XP");
        require(
            msg.sender.code.length > 0,
            "XP can be updated by only task contract"
        );
        // TODO - add require statement whether msg.sender is task contract
        totalXp += _xp;
    }

    function updateUSDCAmount(uint256 _amount) external {
        require(_amount > 0, "Invalid amount");
        require(
            msg.sender.code.length > 0,
            "XP can be updated by only task contract"
        );
        // TODO - add require statement whether msg.sender is task contract
        usdc += _amount;
    }

    function withdraw(uint256 _amount) public onlyOwner {
        uint256 balance = _token.balanceOf(address(this));
        require(balance > 0, "Insufficient USDC balance");
        require(balance >= _amount, "Insufficient USDC balance");
        _token.transfer(owner, _amount);
        // payable(owner).transfer(usdc_amount);
    }

    function getTotalXP() external view returns (uint256) {
        return totalXp;
    }

    function getEarnedUSDC() external view returns (uint256) {
        return usdc;
    }
}
