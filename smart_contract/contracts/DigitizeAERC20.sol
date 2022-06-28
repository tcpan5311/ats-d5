// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './libraries/SafeMath.sol';
import './interfaces/IDigitizeAERC20.sol';

contract DigitizeAERC20 is IDigitizeAERC20  
{
    using SafeMath for uint;

    string public override constant name = 'Digitize A';
    string public override constant symbol = 'DGZ-A';
    uint8 public override constant decimals = 18;
    uint  public override totalSupply;
    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;

    constructor() public{}

    function _mint(address to, uint value) internal 
    {
        totalSupply = totalSupply.add(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }
    

    function _burn(address from, uint value) internal 
    {
        balanceOf[from] = balanceOf[from].sub(value);
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }

    function _approve(address owner, address spender, uint value) private 
    {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _transfer(address from, address to, uint value) private 
    {
        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint value) external override returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function mint(address to, uint value) external returns (bool)
    {
        _mint(to, value);
        return true;
    }

    function transfer(address to, uint value) external override returns (bool) {

        require(balanceOf[msg.sender] >= value, "DGZ-A: Insufficient funds");

        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) external override returns (bool) {

        require(allowance[from][msg.sender] >= value, "DGZ-A: Insufficient allowances");

        _transfer(from, to, value);
        return true;
    }

}

