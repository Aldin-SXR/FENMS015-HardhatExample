// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import 'hardhat/console.sol';

contract Bank {
    mapping(address => uint) balances;

    event Deposit(address _sender, uint _amount);
    event Withdraw(address _sender, address _to, uint _amount);

    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
        balances[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint) {
        // console.log("Customer: %s | balance: %s", msg.sender, balances[msg.sender]);
        return balances[msg.sender];
    }

    function withdraw(address _to, uint _amount) external {
        require(_amount <= balances[msg.sender], "Not enough balance");

        balances[msg.sender] -= _amount;
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether.");

        emit Withdraw(msg.sender, _to, _amount);
    }
}

