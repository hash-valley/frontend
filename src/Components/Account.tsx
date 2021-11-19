import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Menu, Button } from "elementz";
import { useWallet } from "use-wallet";
import { useHistory } from "react-router-dom";
import Logo from "../Media/logo.png";
import { providers, utils } from "ethers";
import {
  formatNum,
  getENS,
  shortenAddress,
  correctNetwork,
} from "../Utils/utils";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import styled from "styled-components";

const TitleBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  background-color: whitesmoke;
`;

const AccountButton = styled.span`
  float: right;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-right: 64px;
`;

const AccountEth = styled.div`
  display: inline-block;
  order: 1;
  float: right;
  margin-right: 12px;
  border: 2px solid black;
  border-radius: 16px;
  padding: 12px;
`;

const AccountName = styled.div`
  display: inline-block;
  order: 2;
`;

const Inline = styled.div`
  display: flex;
  flex-direction: row;
  float: right;
`;

const LogoBox = styled.span`
  float: left;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 64px;
`;

const Account = (props: any) => {
  const wallet = useWallet();
  const history = useHistory();
  const season = useCurrSeason();
  const [userBalance, setUserBalance] = useState("0.00");
  const [userAddress, setUserAddress] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      //@ts-ignore
      if (window.ethereum.selectedAddress) wallet.connect();
    }, 300);
  }, []);

  useEffect(() => {
    const checkNetwork = async () => {
      //@ts-ignore
      const provider = new providers.Web3Provider(window.ethereum, "any");
      provider.on("network", async (_, __) => {
        setIsCorrectNetwork(await correctNetwork());
      });
    };
    checkNetwork();
  }, []);

  useEffect(() => {
    const user = async () => {
      if (props.account) {
        const provider = new providers.Web3Provider(wallet.ethereum);
        const balance = await provider.getBalance(props.account);
        const balNum = formatNum(utils.formatEther(balance), 4);
        const ens = await getENS(props.account);
        if (ens) {
          setUserAddress(ens);
        } else {
          setUserAddress(shortenAddress(props.account));
        }
        setUserBalance(balNum);
      }
    };
    setUserAddress(shortenAddress(props.account));
    user();
  }, [wallet]);

  return (
    <TitleBar>
      <LogoBox>
        <Link to="/">
          <img src={Logo} height="51px" />
        </Link>
      </LogoBox>

      <AccountButton>
        {props.account ? (
          <Inline>
            <AccountEth>
              <b>{season === 0 ? "Pre-season" : `Season ${season}`}</b>
            </AccountEth>
            <AccountEth>
              <b>{userBalance} ETH</b>
            </AccountEth>
            <AccountName>
              <Dropdown
                hover
                noMobile
                handle={
                  <Button
                    primary
                    rounded
                    onClick={() => history.push(`/account/${props.account}`)}
                  >
                    <b>{userAddress}</b>
                  </Button>
                }
              >
                <Menu noBorder>
                  <Menu.Item
                    icon="user"
                    onClick={() => history.push(`/account/${props.account}`)}
                  >
                    Account
                  </Menu.Item>
                  <Menu.Item icon="close" danger onClick={() => wallet.reset()}>
                    Disconnect
                  </Menu.Item>
                </Menu>
              </Dropdown>
            </AccountName>
          </Inline>
        ) : isCorrectNetwork ? (
          <Inline>
            <AccountEth>
              <b>{season === 0 ? "Pre-season" : `Season ${season}`}</b>
            </AccountEth>
            <AccountName>
              <Dropdown
                hover
                noMobile
                handle={
                  <Button primary rounded>
                    <b>Connect Wallet</b>
                  </Button>
                }
              >
                <Menu noBorder>
                  <Menu.Item onClick={() => wallet.connect()}>
                    MetaMask
                  </Menu.Item>
                  <Menu.Item onClick={() => wallet.connect("walletconnect")}>
                    WalletConnect
                  </Menu.Item>
                  <Menu.Item onClick={() => wallet.connect("frame")}>
                    Frame
                  </Menu.Item>
                </Menu>
              </Dropdown>
            </AccountName>
          </Inline>
        ) : (
          <Button danger rounded>
            <b>Wrong Network</b>
          </Button>
        )}
      </AccountButton>
    </TitleBar>
  );
};

export default Account;
