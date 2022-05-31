import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import Head from "next/head";
import styled from "styled-components";
import "antd/dist/antd.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import Account from "../Components/Account";
import Footer from "../Components/Footer";
import ComingSoon from "../Components/ComingSoon";
import { alchemyKey } from "../Utils/constants";
import { subgraphUrl, chainId } from "../Utils/constants";
import "../../public/index.css";

const AppContainer = styled.div`
  text-align: center;
  min-height: calc(100vh - 70px);
  margin-top: -10px;
`;

const apolloClient = new ApolloClient({
  uri: subgraphUrl,
  cache: new InMemoryCache(),
});

const { chains, provider, webSocketProvider } = configureChains(
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

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }) {
  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return (
      <>
        <Head>
          <title>Hash Valley Winery</title>
        </Head>
        <ComingSoon />
      </>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          showRecentTransactions={true}
          appInfo={{
            appName: "Hash Valley Winery",
            learnMoreUrl: "https://www.hashvalley.xyz/about",
          }}
        >
          <AppContainer>
            <Head>
              <title>Hash Valley Winery</title>
            </Head>
            <Account />
            <Component {...pageProps} />
            <ToastContainer position="bottom-right" />
          </AppContainer>
          <Footer />
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
}

export default MyApp;
