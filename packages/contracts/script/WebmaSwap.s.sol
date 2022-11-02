// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "../lib/forge-std/src/Script.sol";
import "../src/WebmaSwap.sol";
import "../src/WebmaToken.sol";

contract MyScript is Script {
    function run() external {
        vm.startBroadcast();

        WebmaToken webmaToken = new WebmaToken();
        new WebmaSwap(address(webmaToken));

        vm.stopBroadcast();
    }
}