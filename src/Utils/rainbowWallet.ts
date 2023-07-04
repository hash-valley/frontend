import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { optimism } from 'wagmi/chains'
import { providerUrl } from "../Utils/constants";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export const { chains, provider, webSocketProvider } = configureChains(
  [optimism],
  [
    jsonRpcProvider({
      rpc: (_) => ({
        http: providerUrl,
        webSocket: `wss${providerUrl.slice(5)}`,
      }),
    }),
  ]
);

const { wallets } = getDefaultWallets({
  appName: "Hash Valley Winery",
  projectId: "86c9a6207d7326c5040f3eea95a0bcd3",
  chains,
});

const connectors = connectorsForWallets([...wallets]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});
