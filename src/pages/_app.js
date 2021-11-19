import Account from "../Components/Account";
import { UseWalletProvider } from "use-wallet";
import { providerUrl } from "../Utils/constants";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { subgraphUrl, chainId } from "../Utils/constants";
import styled from "styled-components";
import "../../public/index.css";
import 'antd/dist/antd.css';

const AppContainer = styled.div`
  text-align: center;
`;

const client = new ApolloClient({
  uri: subgraphUrl,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
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
          <Account />
          <Component {...pageProps} />
        </AppContainer>
      </ApolloProvider>
    </UseWalletProvider>
  );
}

export default MyApp;
