// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";


contract WebmaToken is ERC721 {
    constructor() ERC721("WebmaToken", "WMT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}