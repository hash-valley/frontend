import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { chainId, alchemyKey } from "../Utils/constants";

export const { chains, provider, webSocketProvider } = configureChains(
  [
    chainId === 10
      ? chain.optimism
      : chainId === 69
      ? chain.optimismKovan
      : chain.hardhat,
  ],
  [alchemyProvider({ alchemyId: alchemyKey }), publicProvider()]
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
