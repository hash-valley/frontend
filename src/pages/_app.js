import Account from "../Components/Account";
import Footer from "../Components/Footer";
import { UseWalletProvider } from "use-wallet";
import { providerUrl } from "../Utils/constants";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { subgraphUrl, chainId } from "../Utils/constants";
import styled from "styled-components";
import "../../public/index.css";
import "antd/dist/antd.css";
import Head from "next/head";
import ComingSoon from "../Components/ComingSoon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContainer = styled.div`
  text-align: center;
  min-height: calc(100vh - 70px);
  margin-top: -10px;
`;

const client = new ApolloClient({
  uri: subgraphUrl,
  cache: new InMemoryCache(),
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
    <UseWalletProvider
      chainId={chainId}
      connectors={{
        portis: { dAppId: "hash-walley-winery" },
        walletconnect: { rpcUrl: providerUrl },
      }}
    >
      <ApolloProvider client={client}>
        <AppContainer>
          <Head>
            <title>Hash Valley Winery</title>
          </Head>
          <Account />
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" />
        </AppContainer>
        <Footer />
      </ApolloProvider>
    </UseWalletProvider>
  );
}

export default MyApp;
