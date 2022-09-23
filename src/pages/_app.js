import "../../public/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

import "../css/variables.less";

import { ApolloProvider } from "@apollo/client";
import Head from "next/head";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import Account from "../Components/Account";
import Footer from "../Components/Footer";

import { chains, wagmiClient } from "../Utils/rainbowWallet";
import { apolloClient } from "../Utils/apollo";

const AppContainer = styled.div`
  text-align: center;
  min-height: calc(100vh - 70px);
  margin-top: -10px;
`;

function MyApp({ Component, pageProps }) {
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
