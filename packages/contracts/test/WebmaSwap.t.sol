// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "../lib/forge-std/src/Test.sol";
import "../src/WebmaSwap.sol";
import "../src/WebmaToken.sol";
import "../lib/forge-std/src/console.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";


contract WebmaSwapTest is Test {
    // using stdStorage for StdStorage;
    WebmaToken private webmaToken;
    WebmaSwap private webmaSwap;
    uint256 private creatorPrivateKey;
    uint256 private userPrivateKey;
    address private admin;
    address private creator;
    address private user;
    address[] private addresses;
    ERC20 private erc20Contract;
    address private erc20Address;

    function setUp() public {
        admin = address(1);
        userPrivateKey = 0xB0B;
        user = vm.addr(userPrivateKey);
        vm.startPrank(admin);
        webmaToken = new WebmaToken();
        webmaSwap = new WebmaSwap(address(webmaToken));
        uint size = 1;
        addresses = new address[](size);
        webmaToken.mint(admin, 1);
        vm.stopPrank();
        erc20Contract = new ERC20("test", "TST");
        erc20Address = address(erc20Contract);
    }

    function testOpen( uint256 price) public {
        vm.startPrank(admin);
        webmaToken.approve(address(webmaSwap), 1);
        webmaSwap.open(1, erc20Address, price);
        vm.stopPrank();
        assertEq(webmaSwap.getSwap(1).owner, address(admin));
        assertEq(webmaSwap.getSwap(1).erc20, erc20Address);
        assertEq(webmaSwap.getSwap(1).price, price);
    }

    function testRevert_senderIsNotNFTOwner( uint256 price) public {
        uint256 tokenId = 1;
        vm.startPrank(admin);
        webmaToken.approve(address(webmaSwap), tokenId);
        vm.stopPrank();
        vm.prank(user);
        vm.expectRevert("sender is not NFT owner");
        webmaSwap.open(tokenId, erc20Address, price);
    }

    function testRevert_tokenIsNotApproved(uint256 price) public {
        vm.prank(admin);
        vm.expectRevert("token is not approved");
        webmaSwap.open(1, erc20Address, price);
    }

    function testClose(uint256 price) public {
        vm.startPrank(admin);
        uint256 tokenId = 1;
        webmaToken.approve(address(webmaSwap), tokenId);
        webmaSwap.open(tokenId, erc20Address, price);
        webmaSwap.close(tokenId);
        assertEq(webmaSwap.getSwap(tokenId).owner, address(0));
        assertEq(webmaSwap.getSwap(tokenId).tokenId, 0);
        assertEq(webmaSwap.getSwap(tokenId).erc20, address(0));
        assertEq(webmaSwap.getSwap(tokenId).price, 0);
    }

    function testFulfill(uint256 price) public {
        vm.assume(price > 0);
        deal(address(erc20Contract), user, price);
        vm.startPrank(admin);
        uint256 tokenId = 1;
        webmaToken.approve(address(webmaSwap), tokenId);
        webmaSwap.open(tokenId, address(erc20Contract), price);
        vm.stopPrank();
        vm.startPrank(user);
        erc20Contract.approve(address(webmaSwap), webmaSwap.getSwap(tokenId).price);
        webmaSwap.fulfill(tokenId);
        assertEq(webmaToken.ownerOf(tokenId), user);
        assertEq(erc20Contract.balanceOf(admin), price);
        vm.stopPrank();
    }

    function testRevert_insufficientAllowance(uint256 price) public {
        vm.assume(price > 0);
        deal(address(erc20Contract), user, price);
        vm.startPrank(admin);
        uint256 tokenId = 1;
        webmaToken.approve(address(webmaSwap), tokenId);
        webmaSwap.open(tokenId, address(erc20Contract), price);
        vm.stopPrank();
        vm.prank(user);
        vm.expectRevert("ERC20: insufficient allowance");
        webmaSwap.fulfill(tokenId);
    }

}
