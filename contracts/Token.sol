//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Token is ERC20, ERC20Permit {

    uint private INITIAL_TOTAL_SUPPLY;

    /// @param _daoAddress Address that will receive the ownership of the tokens initially
    /// @param _name Name of the token
    /// @param _symbol Symbol for the token
    /// @param _supply Total token supply
    constructor (address _daoAddress, string memory _name, string memory _symbol, uint _supply)
        ERC20(_name, _symbol)
        ERC20Permit(_name)
        {
            INITIAL_TOTAL_SUPPLY = _supply;
            // We are using a decimal value of 18
            _mint(_daoAddress, INITIAL_TOTAL_SUPPLY * 1e18);
            console.log("Minting %s tokens with initial supply of: %d", _symbol, INITIAL_TOTAL_SUPPLY);
        }
}