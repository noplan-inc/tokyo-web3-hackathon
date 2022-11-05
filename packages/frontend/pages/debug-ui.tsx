import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  useApproveWebmaToken,
  useApproveERC20,
  useOpen,
  useClose,
  useFulfill,
} from "../hooks/useContract";
import { utils } from "ethers";
import { Button } from "@chakra-ui/react";

function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        Connected to {address}
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}

const Setting: NextPage = () => {
  const { write: webmaTokenWrite } = useApproveWebmaToken(
    "0x6064D1CF4a5dB4718bebeB8ad2132bd79BDD94F4",
    0
  );
  const { address } = useAccount();
  const { write: erc20Write } = useApproveERC20(
    address,
    utils.parseUnits("100")
  );
  const { write: openWrite } = useOpen(
    0,
    "0x6064D1CF4a5dB4718bebeB8ad2132bd79BDD94F4",
    utils.parseUnits("100")
  );
  const { write: closeWrite } = useClose(0);
  const { write: fulfillWrite } = useFulfill(0);

  return (
    <>
      {Profile()}
      <Button disabled={!webmaTokenWrite} onClick={() => webmaTokenWrite?.()}>
        approve webmaToken
      </Button>
      <Button disabled={!erc20Write} onClick={() => erc20Write?.()}>
        approve erc20
      </Button>
      <Button disabled={!openWrite} onClick={() => openWrite?.()}>
        open
      </Button>
      <Button disabled={!closeWrite} onClick={() => closeWrite?.()}>
        close
      </Button>
      <Button disabled={!fulfillWrite} onClick={() => fulfillWrite?.()}>
        fulfill
      </Button>
    </>
  );
};

export default Setting;
