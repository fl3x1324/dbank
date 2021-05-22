// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address public minter;

  event MinterChanged(address indexed from, address to);

  constructor() public payable ERC20("Decentralized Bank Currency", "DBC") {
    minter = msg.sender;
  }

  function passMinterRole(address dBank) public returns (bool) {
    require(minter == msg.sender, 'Error: Only owner can change minter role!');
    minter = dBank;

    emit MinterChanged(msg.sender, dBank);
  }

  function mint(address account, uint256 amount) public {
    require(msg.sender == minter, 'Error: msg.sender is not the minter!');
		_mint(account, amount);
	}
}
