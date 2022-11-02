import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useApproveNFT } from '../hooks/useApproveNFT'
 
function Profile() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
 
  if (isConnected)
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}

const Setting: NextPage = () => {
    const { write } = useApproveNFT('0xB13484B5bE91362Cec0B76e1C35A48bb65C606a6', 0)

    return (
        <>
        {Profile()}
        <button
            disabled={!write}
            onClick={() => write?.()
            }>
            approve nft
        </button>
        </>
    )
  };

export default Setting;