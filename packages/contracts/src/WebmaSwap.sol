// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";


contract WebmaSwap is ReentrancyGuard {
    address public webmaTokenAddress;
    IERC721 private webmaTokenContract;

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

    constructor(address wmtAddress) {
        webmaTokenAddress = wmtAddress;
        webmaTokenContract = IERC721(webmaTokenAddress);
    }

    modifier isOwner(uint256 tokenId){
        require(msg.sender == swaps[tokenId].owner , "sender is not NFT owner.");
        _;
    }

    function open(uint256 tokenId, address erc20, uint256 price) public isOwner(tokenId)  {
        Swap memory newSwap = Swap(msg.sender, tokenId, erc20, price, false);
        swaps[tokenId] = newSwap;
        emit Open(tokenId, erc20,  price);
    }

    function close(uint256 tokenId) public isOwner(tokenId) {
        delete swaps[tokenId];
        emit Close(tokenId);
    }

    function fulfill(uint256 tokenId, address newOwner) public nonReentrant(){
        Swap memory swap = swaps[tokenId];
        webmaTokenContract.transferFrom(swap.owner, newOwner, tokenId);
        IERC20(swap.erc20).transfer(swap.owner, swap.price);
        delete swaps[tokenId];
        emit Fulfill(tokenId, swap.erc20, swap.price, newOwner);
    }
}

