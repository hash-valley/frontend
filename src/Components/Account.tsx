import Image from "next/image";
import Link from "next/link";
import { Dropdown, Button, Menu } from "antd";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import styled from "styled-components";
import { useRouter } from "next/router";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

const TitleBar = styled.div`
  width: 100%;
  margin-top: 0.6rem;
  height: 1rem;
  font-family: Nunito;
`;

const AccountButtonList = styled.span`
  float: right;
  margin: 15px 64px 0px 0px;
  @media screen and (max-width: 875px) {
    display: none;
  }
`;

const AccountButtonCondensed = styled.span`
  float: right;
  margin: 15px 64px 0px 0px;
  @media screen and (min-width: 876px) {
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
  border: 1px dashed lightgray;
  border-radius: 24px;
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

const InlineRainbowMobile = styled.div`
  display: flex;
  flex-direction: row;
  float: left;
  margin-right: 12px;
`;

const InlineRainbow = styled.div`
  display: flex;
  flex-direction: row;
  float: right;
  margin-left: 12px;
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
  const { data } = useAccount();
  const router = useRouter();
  const protocol = useCurrSeason();
  const [connected, setConnected] = useState(false);

  useEffect(() => setConnected(!!data), [data]);

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
            <AccountName>
              <DropdownGap
                overlay={
                  //@ts-ignore
                  <Menu
                    items={[
                      {
                        label: (
                          <div onClick={() => router.push(`/council/vineyards`)}>
                            Vineyards
                          </div>
                        ),
                        key: "1",
                      },
                      {
                        label: (
                          <div onClick={() => router.push(`/council/bottles`)}>
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
                  shape="round"
                  size="large"
                  onClick={() => router.push(`/council/vineyards`)}
                >
                  <b>Council</b>
                </Button>
              </DropdownGap>
              {connected && (
                <Button
                  shape="round"
                  size="large"
                  onClick={() => router.push(`/account/${data?.address}`)}
                >
                  <b>Portfolio</b>
                </Button>
              )}
              <InlineRainbow>
                <ConnectButton />
              </InlineRainbow>
            </AccountName>
          </Inline>
        </AccountButtonList>

        {/* mobile */}
        <AccountButtonCondensed>
          <InlineRainbowMobile>
            <ConnectButton />
          </InlineRainbowMobile>
          <Dropdown
            trigger={["click"]}
            overlay={
              //@ts-ignore
              <Menu
                items={[
                  {
                    label: connected ? (
                      <div
                        onClick={() => router.push(`/account/${data?.address}`)}
                      >
                        Portfolio
                      </div>
                    ) : (
                      <>Not Connected</>
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
                      <div onClick={() => router.push(`/council/vineyards`)}>
                        Vineyards
                      </div>
                    ),
                    key: "5",
                  },
                  {
                    label: (
                      <div onClick={() => router.push(`/council/bottles`)}>
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
            <Button shape="round" size="large">
              <MenuOutlined />
            </Button>
          </Dropdown>
        </AccountButtonCondensed>
      </TitleBar>
    </>
  );
};

export default Account;
