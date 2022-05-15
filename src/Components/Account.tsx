import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import Image from "next/image";
import Link from "next/link";
import { Dropdown, Button, Menu } from "antd";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
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
        const provider = new Web3Provider(window.ethereum, "any");
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
        const provider = new Web3Provider(wallet.ethereum);
        const balance = await provider.getBalance(wallet.account);
        const balNum = formatNum(formatEther(balance), 4);
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
                  //@ts-ignore
                  <Menu
                    items={[
                      {
                        label: (
                          <div onClick={() => router.push(`/council/vineyard`)}>
                            Vineyards
                          </div>
                        ),
                        key: "1",
                      },
                      {
                        label: (
                          <div onClick={() => router.push(`/council/bottle`)}>
                            Bottles
                          </div>
                        ),
                        key: "2",
                      },
                      {
                        label: (
                          <div onClick={() => router.push(`/council/new`)}>
                            New Proposal
                          </div>
                        ),
                        key: "3",
                      },
                    ]}
                  />
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
                    //@ts-ignore
                    <Menu
                      items={[
                        {
                          label: (
                            <div
                              onClick={() =>
                                router.push(`/account/${wallet.account}`)
                              }
                            >
                              Account
                            </div>
                          ),
                          icon: <UserOutlined />,
                          key: "1",
                        },
                        {
                          label: (
                            <div onClick={() => wallet.reset()}>Disconnect</div>
                          ),
                          icon: <CloseOutlined />,
                          danger: true,
                          key: "2",
                        },
                      ]}
                    />
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
                    //@ts-ignore
                    <Menu
                      items={[
                        {
                          label: (
                            <div onClick={() => wallet.connect()}>Metamask</div>
                          ),
                          key: "1",
                        },
                        {
                          label: (
                            <div
                              onClick={() => wallet.connect("walletconnect")}
                            >
                              WalletConnect
                            </div>
                          ),
                          key: "2",
                        },
                        {
                          label: (
                            <div onClick={() => wallet.connect("frame")}>
                              Frame
                            </div>
                          ),
                          key: "3",
                        },
                      ]}
                    />
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
              trigger={["click"]}
              overlay={
                //@ts-ignore
                <Menu
                  items={[
                    {
                      label: (
                        <div
                          onClick={() =>
                            router.push(`/account/${wallet.account}`)
                          }
                        >
                          Account
                        </div>
                      ),
                      icon: <UserOutlined />,
                      key: "4",
                    },
                    {
                      type: "divider",
                    },
                    {
                      label:
                        protocol.season === 0
                          ? "Pre-season"
                          : `Season ${protocol.season}`,
                      key: "1",
                    },
                    {
                      label:
                        protocol.season > 0
                          ? `${protocol.daysLeft} days left`
                          : `Game not started`,
                      key: "2",
                    },
                    {
                      label: protocol.plant
                        ? "Planting 🌱"
                        : protocol.harvest
                        ? "Harvesting 🍁"
                        : "",
                      key: "3",
                    },
                    {
                      type: "divider",
                    },
                    {
                      label: (
                        <div onClick={() => router.push(`/council/vineyard`)}>
                          Vineyards
                        </div>
                      ),
                      key: "5",
                    },
                    {
                      label: (
                        <div onClick={() => router.push(`/council/bottle`)}>
                          Bottles
                        </div>
                      ),
                      key: "6",
                    },
                    {
                      label: (
                        <div onClick={() => router.push(`/council/new`)}>
                          New Proposal
                        </div>
                      ),
                      key: "7",
                    },
                    {
                      type: "divider",
                    },
                    {
                      label: (
                        <div onClick={() => wallet.reset()}>Disconnect</div>
                      ),
                      icon: <CloseOutlined />,
                      danger: true,
                      key: "8",
                    },
                  ]}
                />
              }
            >
              <Button type="primary" shape="round" size="large">
                <b>{userAddress}</b>
              </Button>
            </Dropdown>
          ) : isCorrectNetwork ? (
            <Dropdown
              overlay={
                //@ts-ignore
                <Menu
                  items={[
                    {
                      label:
                        protocol.season === 0
                          ? "Pre-season"
                          : `Season ${protocol.season}`,
                      key: "1",
                    },
                    {
                      label:
                        protocol.season > 0
                          ? `${protocol.daysLeft} days left`
                          : `Game not started`,
                      key: "2",
                    },
                    {
                      label: protocol.plant
                        ? "Planting 🌱"
                        : protocol.harvest
                        ? "Harvesting 🍁"
                        : "",
                      key: "3",
                    },
                    {
                      type: "divider",
                    },
                    {
                      label: (
                        <div onClick={() => wallet.connect()}>Metamask</div>
                      ),
                      key: "mm",
                    },
                    {
                      label: (
                        <div onClick={() => wallet.connect("walletconnect")}>
                          WalletConnect
                        </div>
                      ),
                      key: "wc",
                    },
                    {
                      label: (
                        <div onClick={() => wallet.connect("frame")}>Frame</div>
                      ),
                      key: "frame",
                    },
                    {
                      type: "divider",
                    },
                    {
                      label: (
                        <div onClick={() => router.push(`/council/vineyard`)}>
                          Vineyards
                        </div>
                      ),
                      key: "5",
                    },
                    {
                      label: (
                        <div onClick={() => router.push(`/council/bottle`)}>
                          Bottles
                        </div>
                      ),
                      key: "6",
                    },
                    {
                      label: (
                        <div onClick={() => router.push(`/council/new`)}>
                          New Proposal
                        </div>
                      ),
                      key: "7",
                    },
                  ]}
                />
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
