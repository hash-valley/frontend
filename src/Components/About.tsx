import {
  Flourish,
  GridContainer,
  Page,
  Header,
  HeaderBack,
} from "../Styles/Components";
import styled from "styled-components";
import { VineyardAddress } from "../Utils/constants";
import Image from "next/image";
import Link from "next/link";
import Roadmap from "./Roadmap";

const VintHeader = styled(Header)`
  padding: 25px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  background: linear-gradient(to right, #4bace9, #7e57c2);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;

  text-shadow: 64px 36px #957fef50, -72px -16px #b79ced50, 48px -48px #dec0f150;

  animation: blueprint 3s infinite;
`;

const Info1 = styled(Page)`
  padding-top: 3rem;
  margin-bottom: 36px;
`;

const Info2 = styled(Page)`
  background: #f0f0ee;
  margin-top: 16px;
  padding-top: 3rem;
`;

const Info3 = styled(Page)`
  background: #000;
  margin-top: 0;
  padding-top: 3.1rem;
`;

const Info4 = styled(Page)`
  background-image: url("pgf_back.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  margin-top: 0;
  padding-top: 5rem;
`;

const InfoPanel = styled.div`
  padding: 12px;
  margin: 16px;
  border-radius: 19px;
  background: linear-gradient(145deg, #ffd5ff, #e6b3e1);
  box-shadow: 21px 21px 61px #d6a7d2, -21px -21px 61px #ffe7ff;

  transition: all 200ms ease-out;

  &:hover {
    transform: translate(-4px, -4px);
    transition: all 200ms ease-out;
    box-shadow: 21px 21px 31px #d6a7d2, -21px -21px 31px #ffe7ff;
  }
`;

const Subtitle = styled.h2<{
  side: string;
  color?: string;
  textShadow?: string;
}>`
  margin: 0 3rem 1rem 3rem;
  text-align: ${(props) => (props.side == "left" ? "left" : "right")};
  font-size: 2rem;
  font-style: italic;
  ${(props) => (props.color ? `color: ${props.color};` : "")}

  ${(props) => (props.textShadow ? `text-shadow: ${props.textShadow};` : "")}
`;

const SubSubtitle = styled.h2<{ color?: string }>`
  margin: 2.2rem 2.2rem 2.4rem 3rem;
  text-align: left;
  ${(props) => (props.color ? `color: ${props.color};` : "")}
`;

const Explain = styled.p`
  font-size: 1rem;
`;

const CustomGridContainer = styled(GridContainer)`
  grid-template-columns: fit-content(70%) fit-content(30%);

  @media screen and (max-width: 1280px) {
    grid-template-columns: auto auto;
  }

  @media screen and (max-width: 960px) {
    grid-template-columns: auto;
  }
`;

const CustomGridContainer2 = styled(GridContainer)`
  grid-template-columns: fit-content(30%) fit-content(70%);

  @media screen and (max-width: 1280px) {
    grid-template-columns: auto auto;
  }

  @media screen and (max-width: 960px) {
    grid-template-columns: auto;
  }
`;

const FunImage = styled(Image)`
  border-radius: 16px;
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  border: 0.5rem solid white;
  box-shadow: 10px 10px;
  margin: auto 24px;
  background-color: white;
  border-radius: 16px;
  padding: 6px;
  transition: all 200ms ease-out;

  &:hover {
    transform: translate(-4px, -4px);
    transition: all 200ms ease-out;
  }

  animation: shadow1 12s infinite;

  @keyframes shadow1 {
    0% {
      box-shadow: 10px 10px;
    }
    4% {
      box-shadow: 14px 14px #d6a7d2, 28px 28px #ffe7ff;
    }
    50% {
      box-shadow: 14px 14px #d6a7d2, 28px 28px #ffe7ff;
    }
    54% {
      box-shadow: 10px 10px;
    }
  }
`;

const ImageBox2 = styled.div`
  display: flex;
  justify-content: center;
  border: 0.5rem solid white;
  box-shadow: -10px 10px grey;
  margin: auto 24px;
  background-color: white;
  border-radius: 16px;
  padding: 6px;
  transition: all 200ms ease-out;

  animation: shadow 8s infinite;

  &:hover {
    transform: translate(4px, -4px);
    transition: all 200ms ease-out;
  }

  @keyframes shadow {
    0% {
      box-shadow: -10px 10px grey;
    }
    6% {
      box-shadow: -14px 14px red, -28px 28px purple;
    }
    50% {
      box-shadow: -14px 14px red, -28px 28px purple;
    }
    56% {
      box-shadow: -10px 10px grey;
    }
  }
`;

const ImageBox3 = styled.div`
  display: flex;
  justify-content: center;
  border: 0.5rem solid white;
  box-shadow: 10px 10px;
  margin: auto 24px;
  background-color: white;
  border-radius: 16px;
  padding: 6px;
  transition: all 200ms ease-out;

  &:hover {
    transform: translate(-4px, -4px);
    transition: all 200ms ease-out;
  }

  animation: shadow3 12s infinite;

  @keyframes shadow3 {
    0% {
      box-shadow: 10px 10px;
    }
    4% {
      box-shadow: 14px 14px #60d0bf, 28px 28px #367bc8;
    }
    80% {
      box-shadow: 14px 14px #60d0bf, 28px 28px #367bc8;
    }
    84% {
      box-shadow: 10px 10px;
    }
  }
`;

const CenteredDiv = styled.div`
  justify-content: center;
  display: flex;
`;

const About = () => {
  return (
    <>
      <HeaderBack>
        <VintHeader>The Blueprint</VintHeader>
      </HeaderBack>
      <Info1>
        <Subtitle side="left">
          Hash Valley&apos;s destiny is shaped by its owners
        </Subtitle>
        <SubSubtitle>
          <ol>
            <li>Cultivate a vineyard of your choosing</li>
            <li>Discover rare vintages</li>
            <li>Remix the artwork - earn ETH</li>
          </ol>
        </SubSubtitle>
        <GridContainer>
          <InfoPanel>
            <h2>
              <i>Vineyards</i>
            </h2>
            <Explain>
              Mintable tokens that yield Wine Bottles if they are planted,
              watered and harvested every season
            </Explain>
          </InfoPanel>
          <InfoPanel>
            <h2>
              <i>Wine Bottles</i>
            </h2>
            <Explain>
              Grown from a carefully tended Vineyard, age it in the Cellar to
              increase rarity and vote for the remix you want featured next
            </Explain>
          </InfoPanel>
          <InfoPanel>
            <h2>
              <i>Council</i>
            </h2>
            <Explain>
              Remix the art to flex your skills and claim all secondary sale
              royalties + a bonus or vote for your favorite creator
            </Explain>
          </InfoPanel>
        </GridContainer>
      </Info1>

      <Info2>
        <Subtitle side="right">How Do I Join?</Subtitle>
        <CustomGridContainer>
          <div>
            <SubSubtitle>
              You&apos;ll need some ETH on{" "}
              <a
                href="https://www.optimism.io"
                target="_blank"
                rel="noreferrer"
              >
                Optimism
              </a>{" "}
              to get started. You can use{" "}
              <a
                href="https://www.optimism.io/apps/bridges"
                target="_blank"
                rel="noreferrer"
              >
                a bridge
              </a>{" "}
              to move your assets over.
            </SubSubtitle>
            <SubSubtitle>
              Get a Vineyard from the <Link href="/mint">Mint</Link> or{" "}
              <a
                href={
                  process.env.NEXT_PUBLIC_CHAIN_ID === "420"
                    ? `https://testnet.qx.app/collection/${VineyardAddress}`
                    : `https://qx.app/collection/${VineyardAddress}`
                }
                target="_blank"
                rel="noreferrer"
              >
                Secondary Market
              </a>
              . Plant during the first week of the season, water everyday (or
              buy a sprinkler) then harvest in the final week.
            </SubSubtitle>
            <SubSubtitle>
              Each season is 12 weeks except the first which is only three!
            </SubSubtitle>
            <SubSubtitle>
              With a Wine Bottle in hand take your chances aging in the cellar
              or submit a remix to the Council. Winners will be featured for 7+
              days and receive all secondary royalties.
            </SubSubtitle>
            <SubSubtitle>
              Wine bottle age = Council clout. Maximize this with the Wine
              Cellar&apos;s Hyperbolic Time Acceleration Technology&trade; but
              stay sharp - leave a bottle too long and it may spoil.
            </SubSubtitle>
            <SubSubtitle>
              <a
                href="https://mirror.xyz/0x00000023F6B4ED7185E7B8928072a8bfEC660ff3/9jt6sNUOZ9vjkQRcxgMSClDJCdaJHZwWzX6639hHg6Y"
                target="_blank"
                rel="noreferrer"
              >
                Check out the announcement post on Mirror for a full protocol
                description
              </a>
            </SubSubtitle>
          </div>
          <CenteredDiv>
            <ImageBox>
              <FunImage
                src="/bottles.png"
                alt="logo"
                height={600}
                width={600}
                unoptimized={true}
                loading="eager"
              />
            </ImageBox>
          </CenteredDiv>
        </CustomGridContainer>
      </Info2>

      <Info3>
        <Subtitle side="left" color="white">
          Use Spells to Get Ahead
        </Subtitle>
        <CustomGridContainer2>
          <CenteredDiv>
            <ImageBox2>
              <FunImage
                src="/alchemy.png"
                alt="logo"
                height={600}
                width={600}
                unoptimized={true}
                loading="eager"
              />
            </ImageBox2>
          </CenteredDiv>
          <div>
            <SubSubtitle color="white">
              Earn $GRAPE and $VINEGAR from early harvests and spoiled bottles
            </SubSubtitle>
            <SubSubtitle color="white">
              Use $VINEGAR to recover lost bottles or put a curse on your
              nemesis&apos; vineyard
            </SubSubtitle>
            <SubSubtitle color="white">
              Defend your vineyards from attacks with $GRAPE or power up their
              stats during planting season for increased yield to stay ahead of
              the competition
            </SubSubtitle>
          </div>
        </CustomGridContainer2>
      </Info3>

      <Info4>
        <Subtitle side="right">Retroactive Public Goods Funding</Subtitle>
        <CustomGridContainer2>
          <div>
            <SubSubtitle>
              <a
                href="https://medium.com/ethereum-optimism/retroactive-public-goods-funding-33c9b7d00f0c"
                target="_blank"
                rel="noreferrer"
              >
                Retroactive public goods funding
              </a>{" "}
              is a way to fund{" "}
              <a
                href="https://community.optimism.io/docs/governance/#impact-profit"
                target="_blank"
                rel="noreferrer"
              >
                public goods
              </a>{" "}
              without needing to bake in a profit model and is a critical part
              of{" "}
              <a
                href="https://community.optimism.io/docs/governance/economics/#revenue-is-distributed-to-public-goods"
                target="_blank"
                rel="noreferrer"
              >
                Optimism&apos;s economic model
              </a>
            </SubSubtitle>
            <SubSubtitle>
              Every Hash Valley vineyard mint increases the portion of total
              sales donated directly to{" "}
              <a
                href="https://optimistic.etherscan.io/address/0x15DdA60616Ffca20371ED1659dBB78E888f65556"
                target="_blank"
                rel="noreferrer"
              >
                retropgf.eth
              </a>
            </SubSubtitle>
          </div>
          <CenteredDiv>
            <ImageBox3>
              <FunImage
                src="/pgf.jpeg"
                alt="PGF"
                height={351}
                width={500}
                unoptimized={true}
                loading="eager"
              />
            </ImageBox3>
          </CenteredDiv>
        </CustomGridContainer2>
      </Info4>

      <Info1>
        <Subtitle side="left">Roadmap</Subtitle>

        <Roadmap
          items={[
            { text: "Vineyard mint opens", complete: true },
            {
              text: "500 mints -> first bonus location unlocks",
              complete: false,
            },
            {
              text: "2500 mints -> second bonus location unlocks",
              complete: false,
            },
            {
              text: "5000 mints -> third bonus location unlocks, all remaining mints receive $GRAPE and $VINEGAR airdrop",
              complete: false,
            },
            { text: "Mint out -> start first season", complete: false },
            {
              text: "Alchemy becomes available for all users",
              complete: false,
            },
            {
              text: "Council opens up for creator remixes",
              complete: false,
            },
            {
              text: "Snapshot page for community input on future expansions",
              complete: false,
            },
            {
              text: "Launch DAO for protocol management",
              complete: false,
            },
          ]}
        />
        <h2>
          <i>FUTURE CONCEPTION</i>
        </h2>
        <Roadmap
          items={[
            {
              text: "Expansion packs to upgrade your Vineyard - customizable cosmetics, deeper control over wine making and more",
              complete: false,
            },
            {
              text: "Themed derivative projects - expand your operations into other industries",
              complete: false,
            },
            {
              text: "Turn your bottles into real wines with the Hash Valley label",
              complete: false,
            },
          ]}
        />
      </Info1>

      <Info1>
        <Subtitle side="left">Wanna go Deeper?</Subtitle>
        <SubSubtitle>
          <a
            href="https://inathan-m.gitbook.io/hash-valley-winery/"
            target="_blank"
            rel="noreferrer"
          >
            Read the docs
          </a>{" "}
          or take a look at the{" "}
          <a
            href="https://github.com/hash-valley"
            target="_blank"
            rel="noreferrer"
          >
            codebase
          </a>{" "}
          to see more. Happy vinting!
        </SubSubtitle>
      </Info1>

      <Flourish>
        <br />
        <Image
          src="/vine_svgs/flourish.svg"
          alt="flourish"
          height={80}
          width={300}
        />
        <br />
      </Flourish>
    </>
  );
};

export default About;
