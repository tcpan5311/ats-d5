// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange is ERC20
{
    address public tokenAddress;

    constructor(address _token) ERC20("Digitizeswap","DGZs")
    {
         require(_token != address(0), "Invalid token address provided");
         tokenAddress = _token;
    }

    //Adding liquidity into pool
    function addLiquidity(uint256 _tokenAmount) public payable returns (uint256)
    {
        if(getReserve() == 0)
        {
            IERC20 token = IERC20(tokenAddress);
            token.transferFrom(msg.sender, address(this), _tokenAmount);

            uint256 liquidity = address(this).balance;
            _mint(msg.sender, liquidity);

            return liquidity;

        }

        else
        {
            uint256 ethReserve = address(this).balance - msg.value;
            uint256 tokenReserve = getReserve();

            uint256 tokenAmount = (msg.value * tokenReserve) / ethReserve;

            require(_tokenAmount >= tokenAmount, "Insufficient token amount provided.");

            IERC20 token = IERC20(tokenAddress);
            token.transferFrom(msg.sender, address(this), tokenAmount);

            uint256 liquidity = (msg.value * totalSupply()) / ethReserve;
            _mint(msg.sender, liquidity);

            return liquidity;
        }
    }

    //Removing liquidity from pool
    function removeLiquidity(uint256 _amount) public returns (uint256, uint256)
    {
         require(_amount > 0, "Invalid amount provided.");

        uint256 ethAmount = (address(this).balance * _amount) / totalSupply();
        uint256 tokenAmount = (getReserve() * _amount) / totalSupply();

        _burn(msg.sender, _amount);

        payable(msg.sender).transfer(ethAmount);
        IERC20(tokenAddress).transfer(msg.sender, tokenAmount);

        return (ethAmount, tokenAmount);
    }

    //Getting reserve balance of smart contract ERC20 tokens
    function getReserve() public view returns (uint256)
    {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    //ERC20 token amount obtained after swapping
    function getTokenAmount(uint256 _ethSold) public view returns(uint256)
    {
        require(_ethSold > 0, "Ethereum sold amount is too small");

        uint256 tokenReserve = getReserve();
        return getAmount(_ethSold, address(this).balance, tokenReserve);
    }

    //Eth token amount obtained after swapping
    function getEthAmount(uint256 _tokenSold) public view returns(uint256)
    {
        require(_tokenSold > 0, "Token sold amount is too small");

        uint256 tokenReserve = getReserve();
        return getAmount(_tokenSold, tokenReserve, address(this).balance);
    }

    //Swapping ETH to ERC20 token
    function ethToTokenSwap(uint256 _minTokens) public payable
    {
        uint256 tokenReserve = getReserve();
        uint256 tokenBought = getAmount(msg.value, (address(this).balance-msg.value), tokenReserve);
        require(tokenBought >= _minTokens, "Insufficient output amount");

        IERC20(tokenAddress).transfer(msg.sender,tokenBought);
    }

    //Swapping ERC20 token to ETH
    function tokenToEthSwap(uint256 _tokensSold, uint256 _minEth) public 
    {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmount(_tokensSold, tokenReserve, address(this).balance);
        require(ethBought >= _minEth, "Insufficient output amount");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this),_tokensSold);
        payable(msg.sender).transfer(ethBought);

    }

    //Calculation of fees
    function getAmount(uint256 _inputAmount, uint256 _inputReserve, uint256 _outputReserve)  private pure returns (uint256)
    {
        require(_inputReserve > 0 && _outputReserve > 0, "Invalid reserves");
        
        uint256 inputAmountWithFee = _inputAmount * 99;
        uint256 numerator = inputAmountWithFee * _outputReserve;
        uint256 denominator = inputAmountWithFee + (_inputReserve * 100);

        return numerator / denominator;
    }


    //  function getPrice(uint256 inputReserve, uint256 outputReserve) public pure returns (uint256)
    // {
    //     require(inputReserve > 0 && outputReserve > 0,"Invalid reserves");

    //     uint256 pricing  = (inputReserve * 10 ** 18) / outputReserve;

    //     return pricing;
    // }

}