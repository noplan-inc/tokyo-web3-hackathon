// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";


contract WebmaSwap {
    address webmaTokenAddress = 0x0000000000000000000000000000000000000000;
    IERC721 webmaTokenContract = IERC721(webmaTokenAddress);

    
    struct Swap {
        address owner;
        uint256 tokenId;
        address erc20;
        uint256 price;
        bool locked;
    }

    mapping(uint256 => Swap) public swaps;

    event Open(uint256 tokenId, address erc20, uint256 price);
    event Close(uint256 tokenId);
    event Fulfill(uint256 tokenId, address erc20, uint256 price, address newOwner);

    constructor(){}


    modifier isOwner(uint256 tokenId){
        require(msg.sender == swaps[tokenId].owner , "sender is not NFT owner.");
        _;
    }

    modifier noReentrant(uint256 tokenId) {
        require(!swaps[tokenId].locked, "No re-entrancy");
        swaps[tokenId].locked = true;
        _;
        swaps[tokenId].locked = false;
    }


    function open(uint256 tokenId, address erc20, uint256 price) public isOwner(tokenId)  {
        Swap memory newSwap = Swap(msg.sender, tokenId, erc20, price, false);
        swaps[tokenId] = newSwap;
        webmaTokenContract.approve(address(this), tokenId);
        emit Open(tokenId, erc20,  price);
    }

    function close(uint256 tokenId) public isOwner(tokenId) noReentrant(tokenId) {
        delete swaps[tokenId];
        emit Close(tokenId);
    }

    function fulfill(uint256 tokenId, address newOwner) public noReentrant(tokenId){
        Swap memory swap = swaps[tokenId];
        webmaTokenContract.transferFrom(swap.owner, newOwner, tokenId);
        delete swaps[tokenId];
        emit Fulfill(tokenId, swap.erc20, swap.price, newOwner);
    }
}

