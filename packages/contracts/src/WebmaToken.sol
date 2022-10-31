// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract WebmaToken is ERC721, Ownable {
    constructor() ERC721("WebmaToken", "WMT") {}
}