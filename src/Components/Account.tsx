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
  requestChain,
} from "../Utils/utils";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import styled from "styled-components";
import { useRouter } from "next/router";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import { chainId } from "../Utils/constants";
import { toast } from "react-toastify";

const TitleBar = styled.div`
  width: 100%;
  margin-top: 0.6rem;
  height: 1rem;
  font-family: Nunito;
`;

const AccountButtonList = styled.span`
  float: right;
  margin: 15px 64px 0px 0px;
  @media screen and (max-width: 742px) {
    display: none;
  }
`;

const AccountButtonCondensed = styled.span`
  float: right;
  margin: 15px 64px 0px 0px;
  @media screen and (min-width: 743px) {
    display: none;
  }
  @media screen and (max-width: 425px) {
    margin: 15px 16px 0px 0px;
  }
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
  @media screen and (max-width: 425px) {
    margin: 8px 0px 8px 16px;
  }
`;

const DropdownGap = styled(Dropdown)`
  margin-right: 8px;
`;

const Account = () => {
  const wallet = useWallet();
  const router = useRouter();
  const protocol = useCurrSeason();
  const [userBalance, setUserBalance] = useState("0.00");
  const [userAddress, setUserAddress] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      //@ts-ignore
      if (window.ethereum && window.ethereum.selectedAddress) wallet.connect();
    }, 300);
  }, []);

  useEffect(() => {
    const checkNetwork = async () => {
      //@ts-ignore
      if (window.ethereum) {
        //@ts-ignore
        const provider = new providers.Web3Provider(window.ethereum, "any");
        provider.on("network", async (_, __) => {
          setIsCorrectNetwork(await correctNetwork());
        });
      } else {
        if (wallet.error) {
          console.error(wallet.error);
          if (wallet.error.toString().includes("ChainUnsupportedError")) {
            toast.error(
              `Wrong Chain: Please connect to Optimism (chain id: ${chainId})`
            );
          } else {
            toast.error(`Error ${wallet.error}`);
          }
        }
      }
    };
    checkNetwork();
  }, [wallet]);

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

        {/* desktop */}
        <AccountButtonList>
          <Inline>
            <AccountEth>
              <b>
                {protocol.season === 0
                  ? "Pre-season"
                  : `Season ${protocol.season}`}
              </b>
              <b>{protocol.season > 0 ? ` | ${protocol.daysLeft} days` : ``}</b>
              {protocol.season > 0 && protocol.plant ? (
                <b> | Planting 🌱</b>
              ) : protocol.season > 0 && protocol.harvest ? (
                <b> | Harvesting 🍁</b>
              ) : (
                ""
              )}
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
                    <Menu.Item
                      onClick={() => router.push(`/council/vineyard`)}
                      key="1"
                    >
                      Vineyards
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => router.push(`/council/bottle`)}
                      key="2"
                    >
                      Bottles
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => router.push(`/council/new`)}
                      key="3"
                    >
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
                        key="1"
                      >
                        Account
                      </Menu.Item>
                      <Menu.Item
                        icon={<CloseOutlined />}
                        danger
                        onClick={() => wallet.reset()}
                        key="2"
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
                      <Menu.Item onClick={() => wallet.connect()} key="1">
                        MetaMask
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => wallet.connect("walletconnect")}
                        key="2"
                      >
                        WalletConnect
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => wallet.connect("frame")}
                        key="3"
                      >
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
                <Button
                  danger
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={requestChain}
                >
                  <b>Wrong Network</b>
                </Button>
              )}
            </AccountName>
          </Inline>
        </AccountButtonList>

        {/* mobile */}
        <AccountButtonCondensed>
          {wallet.account ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="season">
                    {protocol.season === 0
                      ? "Pre-season"
                      : `Season ${protocol.season}`}
                  </Menu.Item>
                  <Menu.Item key="daysLeft">
                    {protocol.season > 0
                      ? `${protocol.daysLeft} days left`
                      : ``}
                  </Menu.Item>
                  <Menu.Item key="planting">
                    {protocol.plant
                      ? "Planting 🌱"
                      : protocol.harvest
                      ? "Harvesting 🍁"
                      : ""}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    icon={<UserOutlined />}
                    onClick={() => router.push(`/account/${wallet.account}`)}
                    key="0"
                  >
                    Account
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    onClick={() => router.push(`/council/vineyard`)}
                    key="1"
                  >
                    Vineyard Council
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => router.push(`/council/bottle`)}
                    key="2"
                  >
                    Bottle Council
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => router.push(`/council/new`)}
                    key="3"
                  >
                    New Proposal
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    icon={<CloseOutlined />}
                    danger
                    onClick={() => wallet.reset()}
                    key="4"
                  >
                    Disconnect
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" shape="round" size="large">
                <b>{userAddress}</b>
              </Button>
            </Dropdown>
          ) : isCorrectNetwork ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="season">
                    {protocol.season === 0
                      ? "Pre-season"
                      : `Season ${protocol.season}`}
                  </Menu.Item>
                  <Menu.Item key="daysLeft">
                    {protocol.season > 0
                      ? `${protocol.daysLeft} days left`
                      : ``}
                  </Menu.Item>
                  <Menu.Item key="planting">
                    {protocol.plant
                      ? "Planting 🌱"
                      : protocol.harvest
                      ? "Harvesting 🍁"
                      : ""}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={() => wallet.connect()} key="1">
                    Connect MetaMask
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => wallet.connect("walletconnect")}
                    key="2"
                  >
                    Connect WalletConnect
                  </Menu.Item>
                  <Menu.Item onClick={() => wallet.connect("frame")} key="3">
                    Connect Frame
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    onClick={() => router.push(`/council/vineyard`)}
                    key="3"
                  >
                    Vineyard Council
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => router.push(`/council/bottle`)}
                    key="4"
                  >
                    Bottle Council
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => router.push(`/council/new`)}
                    key="5"
                  >
                    New Proposal
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" shape="round" size="large">
                <b>Connect Wallet</b>
              </Button>
            </Dropdown>
          ) : (
            <Button
              danger
              type="primary"
              shape="round"
              size="large"
              onClick={requestChain}
            >
              <b>Wrong Network</b>
            </Button>
          )}
        </AccountButtonCondensed>
      </TitleBar>
    </>
  );
};

export default Account;
