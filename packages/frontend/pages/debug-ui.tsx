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

const approveNft = (address: string, tokenId: number) => {
    useApproveNFT(address, tokenId)
}

const Setting: NextPage = () => {
    return (
        <>
        <div>{Profile()}</div>
             <button
                 onClick={() =>
                     approveNft(
                         '0xB13484B5bE91362Cec0B76e1C35A48bb65C606a6', 0
                     )
                 }>
                approve nft
            </button>
        </>
    )
  };

export default Setting;