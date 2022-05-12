import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import Image from "next/image";
import Link from "next/link";
import { Menu, Dropdown, Button, Input } from "antd";
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
import { UserOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";

const TitleBar = styled.div`
  width: 100%;
  margin-top: 0.6rem;
  height: 1rem;
  font-family: Nunito;
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
  padding: 0.49rem;
`;

const Search = styled(AccountEth)`
  padding: 0.48rem 0.7rem 0.48rem 0.7rem;
  border-radius: 100%;
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

const DropdownGap = styled(Dropdown)`
  margin-right: 8px;
`;

const SearchBar = styled(Input)`
  height: 1.3rem;
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
    <>
      <TitleBar>
        <LogoBox>
          <Link href="/">
            <a>
              <Image src="/logo.png" alt="logo" height={50} width={50} />
            </a>
          </Link>
        </LogoBox>

        <AccountButton>
          <Inline>
            {/* <AccountEth>
              <SearchBar id="search-bar" placeholder="Enter a token number"></SearchBar>
            </AccountEth>
            <Search>
              <SearchOutlined />
            </Search> */}
            <AccountEth>
              <b>{season === 0 ? "Pre-season" : `Season ${season}`}</b>
            </AccountEth>
            {wallet.account && (
              <AccountEth>
                <b>{userBalance} Ξ</b>
              </AccountEth>
            )}
            <AccountName>
              <DropdownGap
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => router.push(`/council/vineyard`)}>
                      Vineyards
                    </Menu.Item>
                    <Menu.Item onClick={() => router.push(`/council/bottle`)}>
                      Bottles
                    </Menu.Item>
                    <Menu.Item onClick={() => router.push(`/council/new`)}>
                      New Proposal
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={() => router.push(`/council/vineyard`)}
                >
                  <b>Council</b>
                </Button>
              </DropdownGap>
              {wallet.account ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        icon={<UserOutlined />}
                        onClick={() =>
                          router.push(`/account/${wallet.account}`)
                        }
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
              ) : isCorrectNetwork ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => wallet.connect()}>
                        MetaMask
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => wallet.connect("walletconnect")}
                      >
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
              ) : (
                <Button danger type="primary" shape="round" size="large">
                  <b>Wrong Network</b>
                </Button>
              )}
            </AccountName>
          </Inline>
        </AccountButton>
      </TitleBar>
    </>
  );
};

export default Account;
