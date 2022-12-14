import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { chainId, providerUrl } from "../Utils/constants";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export const { chains, provider, webSocketProvider } = configureChains(
  [chainId === 10 ? chain.optimism : chainId === 420 ? chain.optimismGoerli : chain.hardhat],
  [
    jsonRpcProvider({
      rpc: (_) => ({
        http: providerUrl,
        webSocket: `wss${providerUrl.slice(5)}`,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Hash Valley Winery",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});
