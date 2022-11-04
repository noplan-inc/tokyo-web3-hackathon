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
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  return <button onClick={() => connect()}>Connect Wallet</button>;
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
      <button disabled={!webmaTokenWrite} onClick={() => webmaTokenWrite?.()}>
        approve webmaToken
      </button>
      <button disabled={!erc20Write} onClick={() => erc20Write?.()}>
        approve erc20
      </button>
      <button disabled={!openWrite} onClick={() => openWrite?.()}>
        open
      </button>
      <button disabled={!closeWrite} onClick={() => closeWrite?.()}>
        close
      </button>
      <button disabled={!fulfillWrite} onClick={() => fulfillWrite?.()}>
        fulfill
      </button>
    </>
  );
};

export default Setting;
