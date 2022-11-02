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
        webmaToken.mint(admin, tokenId);
        assertEq(webmaToken.ownerOf(tokenId), admin);
        assertEq(webmaToken.balanceOf(admin), 1);
    }

    function testTransfer(uint256 tokenId) public {
        vm.startPrank(admin);
        webmaToken.mint(admin, tokenId);
        webmaToken.approve(user, tokenId);
        webmaToken.transferFrom(admin, user, tokenId);
        vm.stopPrank();
        assertEq(webmaToken.ownerOf(tokenId), user);
        assertEq(webmaToken.balanceOf(user), 1);
    }    

    // function testRevert_callerIsNotTokenOwnerOrApproved(uint256 deadline, uint256 expiredUnix) public {
    //     vm.assume(deadline > block.timestamp && deadline < expiredUnix);
    //     vm.startPrank(creator);
    //     WebmaToken.mint(creator, 1000);
    //     bytes32 digest = createHash(creator, user, 100, deadline);
    //     (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorPrivateKey, digest);
    //     vm.warp(expiredUnix); // fast forward one second past the deadline
    //     vm.expectRevert("ERC20Permit: expired deadline");
    //     WebmaToken.permit(creator,user,100,deadline,v,r,s);
    // }

    // // fuzzing test
    // function testTransferFrom(uint256 mintAmount, uint256 transferAmount) public {
    //     // ここで引数の条件絞ってる
    //     vm.assume(transferAmount < mintAmount);

    //     vm.prank(creator);
    //     WebmaToken.mint(user, mintAmount);
    //     vm.prank(user);
    //     WebmaToken.approve(creator, transferAmount);
    //     vm.prank(creator);
    //     WebmaToken.transferFrom(user, creator, transferAmount);
    //     assertEq(WebmaToken.balanceOf(creator), transferAmount);
    // }

    // function testPermit(uint256 mintAmount, uint256 spendAmount) public{
    //     vm.assume(spendAmount < mintAmount);
    //     vm.startPrank(creator);
    //     WebmaToken.mint(creator, mintAmount);
    //     uint256 tomorrowUnix = block.timestamp + 1 days;
    //     bytes32 digest = createHash(creator, user, spendAmount, tomorrowUnix);
    //     (uint8 v,bytes32 r, bytes32 s) = vm.sign(creatorPrivateKey, digest);
    //     WebmaToken.permit(creator,user,spendAmount,tomorrowUnix,v,r,s);
    //     vm.stopPrank();
    //     vm.prank(user);
    //     WebmaToken.transferFrom(creator, user, spendAmount);
    //     assertEq(WebmaToken.balanceOf(user), spendAmount);
    //     assertEq(WebmaToken.nonces(creator), 1);
    // }

    // function testRevert_ExpiredPermit(uint256 deadline, uint256 expiredUnix) public {
    //     vm.assume(deadline > block.timestamp && deadline < expiredUnix);
    //     vm.startPrank(creator);
    //     WebmaToken.mint(creator, 1000);
    //     bytes32 digest = createHash(creator, user, 100, deadline);
    //     (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorPrivateKey, digest);
    //     vm.warp(expiredUnix); // fast forward one second past the deadline
    //     vm.expectRevert("ERC20Permit: expired deadline");
    //     WebmaToken.permit(creator,user,100,deadline,v,r,s);
    // }

    // function createHash(address owner, address spender, uint256 amount, uint256 deadline) private returns (bytes32) {
    //     bytes32 PERMIT_TYPEHASH = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    //     bytes32 structHash = keccak256(
    //         abi.encode(
    //             PERMIT_TYPEHASH,
    //             owner,
    //             spender,
    //             amount,
    //             WebmaToken.nonces(owner),
    //             deadline
    //         )
    //     );
    //     return keccak256(
    //                 abi.encodePacked(
    //                     "\x19\x01",
    //                     WebmaToken.DOMAIN_SEPARATOR(),
    //                     structHash
    //                 )
    //             );
    // }

    // function testName() public {
    //     string memory name = WebmaToken.name();
    //     assertEq(name, "WebmaToken");
    // }

    // function testDOMAIN_SEPARATOR() public {
    //     bytes32  nameHash = keccak256(bytes(WebmaToken.name()));
    //     bytes32  versionHash = keccak256(bytes('1'));
    //     bytes32 typeHash = keccak256(
    //         "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    //     );
    //     bytes32 domainSeparator = keccak256(abi.encode(typeHash, nameHash, versionHash, block.chainid, address(WebmaToken)));
    //     assertEq32(domainSeparator, WebmaToken.DOMAIN_SEPARATOR());
    // }
}
