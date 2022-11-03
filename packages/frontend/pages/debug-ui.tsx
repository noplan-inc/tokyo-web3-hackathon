import type { NextPage } from "next"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useApproveERC721 } from '../hooks/useApproveERC721'
import { useApproveERC20 } from '../hooks/useApproveERC20'
import { utils } from 'ethers'
 
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
    const { write: erc721Write } = useApproveERC721('0x6064D1CF4a5dB4718bebeB8ad2132bd79BDD94F4', 0)
    const { address } = useAccount()
    const { write: erc20Write } = useApproveERC20(address, utils.parseUnits('100'))

    return (
        <>
            {Profile()}
            <button
                disabled={!erc721Write}
                onClick={() => erc721Write?.()
                }>
                approve erc721
            </button>
            <button
                disabled={!erc20Write}
                onClick={() => erc20Write?.()
                }>
                approve erc20
            </button>
        </>
    )
  };

export default Setting;