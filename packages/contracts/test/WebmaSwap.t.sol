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

    // struct Swap {
    //     address owner;
    //     uint256 tokenId;
    //     address erc20;
    //     uint256 price;
    // }

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

    function testRevert_Open( uint256 price) public {
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
        vm.stopPrank();
        vm.startPrank(admin);
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

    // function testRevert_tokenIsNotApproved( address erc20, uint256 price) public {
    //     vm.prank(admin);
    //     vm.expectRevert("token is not approved.");
    //     webmaSwap.open(1, erc20, price);
    // }

    // expect revert
    // function testFailMint() public {
    //     vm.prank(user);
    //     WebmaSwap.mint(creator, 1000);
    // }

    // function testTransfer() public {
    //     vm.prank(creator);
    //     WebmaSwap.mint(user, 1000);
    //     vm.prank(user);
    //     WebmaSwap.transfer(creator, 400);
    //     assertEq(WebmaSwap.balanceOf(creator), 400);
    // }

    // // fuzzing test
    // function testTransferFrom(uint256 mintAmount, uint256 transferAmount) public {
    //     // ここで引数の条件絞ってる
    //     vm.assume(transferAmount < mintAmount);

    //     vm.prank(creator);
    //     WebmaSwap.mint(user, mintAmount);
    //     vm.prank(user);
    //     WebmaSwap.approve(creator, transferAmount);
    //     vm.prank(creator);
    //     WebmaSwap.transferFrom(user, creator, transferAmount);
    //     assertEq(WebmaSwap.balanceOf(creator), transferAmount);
    // }

    // function testPermit(uint256 mintAmount, uint256 spendAmount) public{
    //     vm.assume(spendAmount < mintAmount);
    //     vm.startPrank(creator);
    //     WebmaSwap.mint(creator, mintAmount);
    //     uint256 tomorrowUnix = block.timestamp + 1 days;
    //     bytes32 digest = createHash(creator, user, spendAmount, tomorrowUnix);
    //     (uint8 v,bytes32 r, bytes32 s) = vm.sign(creatorPrivateKey, digest);
    //     WebmaSwap.permit(creator,user,spendAmount,tomorrowUnix,v,r,s);
    //     vm.stopPrank();
    //     vm.prank(user);
    //     WebmaSwap.transferFrom(creator, user, spendAmount);
    //     assertEq(WebmaSwap.balanceOf(user), spendAmount);
    //     assertEq(WebmaSwap.nonces(creator), 1);
    // }

    // function testRevert_ExpiredPermit(uint256 deadline, uint256 expiredUnix) public {
    //     vm.assume(deadline > block.timestamp && deadline < expiredUnix);
    //     vm.startPrank(creator);
    //     WebmaSwap.mint(creator, 1000);
    //     bytes32 digest = createHash(creator, user, 100, deadline);
    //     (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorPrivateKey, digest);
    //     vm.warp(expiredUnix); // fast forward one second past the deadline
    //     vm.expectRevert("ERC20Permit: expired deadline");
    //     WebmaSwap.permit(creator,user,100,deadline,v,r,s);
    // }

    // function createHash(address owner, address spender, uint256 amount, uint256 deadline) private returns (bytes32) {
    //     bytes32 PERMIT_TYPEHASH = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    //     bytes32 structHash = keccak256(
    //         abi.encode(
    //             PERMIT_TYPEHASH,
    //             owner,
    //             spender,
    //             amount,
    //             WebmaSwap.nonces(owner),
    //             deadline
    //         )
    //     );
    //     return keccak256(
    //                 abi.encodePacked(
    //                     "\x19\x01",
    //                     WebmaSwap.DOMAIN_SEPARATOR(),
    //                     structHash
    //                 )
    //             );
    // }

    // function testName() public {
    //     string memory name = WebmaSwap.name();
    //     assertEq(name, "WebmaSwap");
    // }

    // function testDOMAIN_SEPARATOR() public {
    //     bytes32  nameHash = keccak256(bytes(WebmaSwap.name()));
    //     bytes32  versionHash = keccak256(bytes('1'));
    //     bytes32 typeHash = keccak256(
    //         "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    //     );
    //     bytes32 domainSeparator = keccak256(abi.encode(typeHash, nameHash, versionHash, block.chainid, address(WebmaSwap)));
    //     assertEq32(domainSeparator, WebmaSwap.DOMAIN_SEPARATOR());
    // }
}
