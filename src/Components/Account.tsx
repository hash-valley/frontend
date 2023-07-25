import Image from "next/image";
import Link from "next/link";
import { Dropdown, Button, Menu } from "antd";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import styled from "styled-components";
import { useRouter } from "next/router";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const TitleBar = styled.div`
  width: 100%;
  margin-top: 0.6rem;
  height: 1rem;
  font-family: Nunito;
  z-index: 10;
`;

const AccountButtonList = styled.span`
  float: right;
  margin: 15px 64px 0px 0px;
  @media screen and (max-width: 954px) {
    display: none;
  }
`;

const AccountButtonCondensed = styled.span`
  float: right;
  margin: 15px 64px 0px 0px;
  @media screen and (min-width: 955px) {
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
  border: 1px solid lightgray;
  border-radius: 24px;
  padding: 0.54rem 0.74rem;
  background-color: white;
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

const AlchemyButton = styled(Button)`
  margin-right: 12px;
`;

const Account = () => {
  const { address, status } = useAccount();
  const router = useRouter();
  const protocol = useCurrSeason();

  return (
    <>
      <TitleBar>
        <LogoBox>
          <Link href="/">
            <Image
              src="/logo192.png"
              alt="logo"
              height={50}
              width={50}
              loading="eager"
              style={{ borderRadius: "15%" }}
            />
          </Link>
        </LogoBox>

        {/* desktop */}
        <AccountButtonList>
          <Inline>
            {status === "connected" && (
              <AccountEth>
                <b>{protocol.season === 0 ? "⌛ Pre-season" : `Season ${protocol.season}`}</b>
                <b>{protocol.season > 0 ? ` | ${protocol.daysLeft} days` : ``}</b>
                {protocol.season > 0 && protocol.plant ? (
                  <b> | Planting 🌱</b>
                ) : protocol.season > 0 && protocol.harvest ? (
                  <b> | Harvesting 🍁</b>
                ) : (
                  ""
                )}
              </AccountEth>
            )}
            <AccountName>
              {status === "connected" && (
                <>
                  <DropdownGap
                    overlay={
                      //@ts-ignore
                      <Menu
                        items={[
                          {
                            label: (
                              <div onClick={() => router.push(`/council/vineyards`)}>Vineyards</div>
                            ),
                            key: "1",
                          },
                          {
                            label: (
                              <div onClick={() => router.push(`/council/bottles`)}>Bottles</div>
                            ),
                            key: "2",
                          },
                          {
                            label: (
                              <div onClick={() => router.push(`/council/new`)}>New Proposal</div>
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
                      <b>📜 Council</b>
                    </Button>
                  </DropdownGap>
                  {status === "connected" && (
                    <>
                      <AlchemyButton
                        shape="round"
                        size="large"
                        onClick={() => router.push(`/alchemy`)}
                      >
                        <b>🔮 Alchemy</b>
                      </AlchemyButton>
                      <Button
                        shape="round"
                        size="large"
                        onClick={() => router.push(`/account/${address}`)}
                      >
                        <b>🖋️ Portfolio</b>
                      </Button>
                    </>
                  )}
                </>
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
          {status === "connected" && (
            <Dropdown
              trigger={["click"]}
              overlay={
                //@ts-ignore
                <Menu
                  items={[
                    {
                      label:
                        status === "connected" ? (
                          <div onClick={() => router.push(`/account/${address}`)}>Portfolio</div>
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
                      label: <div onClick={() => router.push(`/alchemy`)}>Alchemy🔮</div>,
                      key: "6",
                    },
                    {
                      type: "divider",
                    },
                    {
                      label: protocol.season === 0 ? "Pre-season" : `Season ${protocol.season}`,
                      key: "8",
                    },
                    {
                      label:
                        protocol.season > 0
                          ? `${protocol.daysLeft} days left`
                          : `Game not started ⌛`,
                      key: "9",
                    },
                    {
                      label: protocol.plant
                        ? "Planting 🌱"
                        : protocol.harvest
                        ? "Harvesting 🍁"
                        : "",
                      key: "10",
                    },
                    {
                      type: "divider",
                    },
                    {
                      label: (
                        <div onClick={() => router.push(`/council/vineyards`)}>Vineyards 📜</div>
                      ),
                      key: "12",
                    },
                    {
                      label: <div onClick={() => router.push(`/council/bottles`)}>Bottles 📜</div>,
                      key: "13",
                    },
                    {
                      label: <div onClick={() => router.push(`/council/new`)}>New Proposal</div>,
                      key: "14",
                    },
                  ]}
                />
              }
            >
              <Button shape="round" size="large">
                <MenuOutlined />
              </Button>
            </Dropdown>
          )}
        </AccountButtonCondensed>
      </TitleBar>
    </>
  );
};

export default Account;
