import { configureChains, createConfig } from "wagmi";
import { providerUrl } from "../Utils/constants";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { createPublicClient, http } from "viem";
import { optimism } from "wagmi/chains";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
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

export const wagmiClient = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: optimism,
    transport: http(),
  }),
});
