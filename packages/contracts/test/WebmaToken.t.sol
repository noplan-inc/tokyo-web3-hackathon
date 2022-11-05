// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "../lib/forge-std/src/Test.sol";
import "../src/WebmaToken.sol";
import "../lib/forge-std/src/console.sol";


contract WebmaTokenTest is Test {
    using stdStorage for StdStorage;
    WebmaToken private webmaToken;
    uint256 private creatorPrivateKey;
    uint256 private userPrivateKey;
    address private admin;
    address private creator;
    address private user;
    address[] private addresses;
    function setUp() public {
        admin = address(1);
        userPrivateKey = 0xB0B;
        user = vm.addr(userPrivateKey);
        vm.startPrank(admin);
        webmaToken = new WebmaToken();
        uint size = 1;
        addresses = new address[](size);
        vm.stopPrank();
    }

    function testMint(uint256 tokenId) public {
        vm.prank(admin);
        webmaToken.mint(admin);
        assertEq(webmaToken.ownerOf(tokenId), admin);
        assertEq(webmaToken.balanceOf(admin), 1);
    }

    function testTransfer(uint256 tokenId) public {
        vm.startPrank(admin);
        webmaToken.mint(admin);
        webmaToken.approve(user, tokenId);
        webmaToken.transferFrom(admin, user, tokenId);
        vm.stopPrank();
        assertEq(webmaToken.ownerOf(tokenId), user);
        assertEq(webmaToken.balanceOf(user), 1);
    }    

}
