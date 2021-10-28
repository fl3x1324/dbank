// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {
    Token private token;
    mapping(address => uint256) etherBalanceOf;
    mapping(address => uint256) depositStart;
    mapping(address => bool) isDeposited;
    mapping(address => bool) hasLoan;

    event Deposit(address indexed user, uint256 etherAmount, uint256 timeStart);
    event Withdraw(address indexed user, uint256 etherAmount, uint256 depositTime, uint256 interest);
    event Loan(address indexed user, uint256 etherAmount, uint256 loanTime, uint256 collatheral);

    constructor(Token _token) {
        token = _token;
    }

    function deposit() public payable {
        require(!isDeposited[msg.sender], "Error, deposit already active");
        require(msg.value >= 1e16, "Error, deposit must be >= 0.01 ETH");
        etherBalanceOf[msg.sender] += msg.value;
        depositStart[msg.sender] += block.timestamp;
        isDeposited[msg.sender] = true;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        require(isDeposited[msg.sender], "Error, no deposit for user");
        uint256 senderDeposit = etherBalanceOf[msg.sender];
        uint256 depositTime = block.timestamp - depositStart[msg.sender];
        uint256 interestPerSec = 31668017 * (etherBalanceOf[msg.sender] / 1e16);
        uint256 interest = depositTime * interestPerSec;
        msg.sender.transfer(senderDeposit);
        token.mint(msg.sender, interest);
        etherBalanceOf[msg.sender] = 0;
        depositStart[msg.sender] = 0;
        isDeposited[msg.sender] = false;
        emit Withdraw(msg.sender, senderDeposit, depositTime, interest);
    }

    function borrow() public payable {
        //check if collateral is >= than 0.01 ETH
        require(msg.value >= 0.01 ether, "Collateral is lower than 0.01 ETH.");
        //check if user doesn't have active loan
        //add msg.value to ether collateral
        //calc tokens amount to mint, 50% of msg.value
        //mint&send tokens to user
        //activate borrower's loan status
        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract
        //calc fee
        //send user's collateral minus fee
        //reset borrower's data
        //emit event
    }

    function balance() public view returns (uint256) {
        return etherBalanceOf[msg.sender];
    }

    function deposited() public view returns (bool) {
        return isDeposited[msg.sender];
    }

    function borrowed() public view returns (bool) {
        return hasLoan[msg.sender];
    }
}
