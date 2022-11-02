import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
  defaultChains,
} from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
// import { getDefaultProvider } from 'ethers'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.mainnet],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
