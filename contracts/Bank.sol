// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

contract Bank {
    mapping(address => uint) balances;

    event Deposit(address _sender, uint _amount);
    event Withdraw(address _sender, uint _amount);

    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
        balances[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint) {
        return balances[msg.sender];
    }

    function withdraw(address _to, uint _amount) external {
        require(_amount <= balances[msg.sender], "Not enough balance");

        balances[msg.sender] -= _amount;
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether.");

        emit Withdraw(msg.sender, _amount);
    }
}

