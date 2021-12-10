import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import Image from "next/image";
import Link from "next/link";
import { Menu, Dropdown, Button } from "antd";
import { providers, utils } from "ethers";
import {
  formatNum,
  getENS,
  shortenAddress,
  correctNetwork,
} from "../Utils/utils";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import styled from "styled-components";
import { useRouter } from "next/router";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";

const TitleBar = styled.div`
  width: 100%;
  margin-top: 0.6rem;
  height: 1rem;
`;

const AccountButton = styled.span`
  float: right;
  margin: 15px 64px 0px 0px;
`;

const AccountEth = styled.div`
  display: inline-block;
  order: 1;
  float: right;
  margin-right: 12px;
  border: 2px solid black;
  border-radius: 16px;
  padding: 0.48rem;
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
  margin: 8px 0px 8px 64px;
`;

const Account = () => {
  const wallet = useWallet();
  const router = useRouter();
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
      if (wallet.account) {
        const provider = new providers.Web3Provider(wallet.ethereum);
        const balance = await provider.getBalance(wallet.account);
        const balNum = formatNum(utils.formatEther(balance), 4);
        const ens = await getENS(wallet.account);
        if (ens) {
          setUserAddress(ens);
        } else {
          setUserAddress(shortenAddress(wallet.account));
        }
        setUserBalance(balNum);
      }
    };
    setUserAddress(shortenAddress(wallet.account));
    user();
  }, [wallet]);

  return (
    <TitleBar>
      <LogoBox>
        <Link href="/">
          <a>
            <Image src="/logo.png" height={50} width={50} />
          </a>
        </Link>
      </LogoBox>

      <AccountButton>
        {wallet.account ? (
          <Inline>
            <AccountEth>
              <b>{season === 0 ? "Pre-season" : `Season ${season}`}</b>
            </AccountEth>
            <AccountEth>
              <b>{userBalance} ETH</b>
            </AccountEth>
            <AccountName>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      icon={<UserOutlined />}
                      onClick={() => router.push(`/account/${wallet.account}`)}
                    >
                      Account
                    </Menu.Item>
                    <Menu.Item
                      icon={<CloseOutlined />}
                      danger
                      onClick={() => wallet.reset()}
                    >
                      Disconnect
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={() => router.push(`/account/${wallet.account}`)}
                >
                  <b>{userAddress}</b>
                </Button>
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
                overlay={
                  <Menu>
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
                }
              >
                <Button type="primary" shape="round" size="large">
                  <b>Connect Wallet</b>
                </Button>
              </Dropdown>
            </AccountName>
          </Inline>
        ) : (
          <Button danger type="primary" shape="round" size="large">
            <b>Wrong Network</b>
          </Button>
        )}
      </AccountButton>
    </TitleBar>
  );
};

export default Account;
