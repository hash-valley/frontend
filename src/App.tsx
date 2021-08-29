import Splash from "./Components/Splash";
import Account from "./Components/Account";
import VineyardPage from "./Components/VineyardPage";
import MintContainer from "./Components/MintContainer";
import AccountPage from "./Components/AccountPage";
import BottlePage from './Components/BottlePage'
import { useWallet, UseWalletProvider } from "use-wallet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { providerUrl } from "./Utils/constants";
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { subgraphUrl, chainId } from "./Utils/constants";
import styled from "styled-components"

const AppContainer = styled.div`
  text-align: center;
`

const client = new ApolloClient({
  uri: subgraphUrl,
  cache: new InMemoryCache()
});

const App = () => {
  const wallet = useWallet();

  return (
    <ApolloProvider client={client}>
      <AppContainer>
        <Router>
          {wallet.status === "connected" ? (
            <Account account={wallet.account} />
          ) : (
            <Account account={null} />
          )}
          <Switch>
            <Route exact path={"/"} render={() => <Splash />} />
            <Route exact path={"/mint"} render={() => <MintContainer />} />
            <Route path={"/account/:userAddress/:view"} render={() => <AccountPage />} />
            <Route path={"/account/:userAddress"} render={() => <AccountPage />} />
            <Route exact path={"/vineyard/:id"} render={() => <VineyardPage />} />
            <Route exact path={"/bottle/:id"} render={() => <BottlePage />} />
          </Switch>
        </Router>
      </AppContainer>
    </ApolloProvider>
  );
};

export default () => (
  <UseWalletProvider
    chainId={chainId}
    connectors={{
      portis: { dAppId: "hash-walley-winery" },
      walletconnect: { rpcUrl: providerUrl }
    }}
  >
    <App />
  </UseWalletProvider>
);
