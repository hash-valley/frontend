import { Flourish, GridContainer, Page, Header } from "../Styles/Components";
import styled from "styled-components";
import { VineyardAddress } from "../Utils/constants";
import Image from "next/image";
import Link from "next/link";
import Roadmap from "./Roadmap";

const Info1 = styled(Page)`
  padding-top: 3rem;
  margin-bottom: 36px;
`;

const Info2 = styled(Page)`
  background: #f0f0ee;
  margin-top: 16px;
  padding-top: 3rem;
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

const Subtitle = styled.h2<{ side: string }>`
  margin: 0 3rem 1rem 3rem;
  text-align: ${(props) => (props.side == "left" ? "left" : "right")};
  font-size: 2rem;
  font-style: italic;
`;

const SubSubtitle = styled.h2`
  margin: 2.2rem 2.2rem 2.4rem 3rem;
  text-align: left;
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
    box-shadow: 14px 14px #d6a7d2, 28px 28px #ffe7ff;
  }
`;

const CenteredDiv = styled.div`
  justify-content: center;
  display: flex;
`;

const About = () => {
  return (
    <>
      <Header>The Blueprint</Header>
      <Info1>
        <Subtitle side="left">
          Hash Valley&apos;s destiny is shaped by its owners
        </Subtitle>
        <SubSubtitle>
          <ol>
            <li>Cultivate a vineyard of your choosing</li>
            <li>Discover rare vintages</li>
            <li>Earn ETH sharing your art with the world</li>
          </ol>
        </SubSubtitle>
        <GridContainer>
          <InfoPanel>
            <h2>
              <i>Vineyards</i>
            </h2>
            <Explain>
              Mintable tokens that yield Wine Bottles if they are planted,
              watered and harvested every season.
            </Explain>
          </InfoPanel>
          <InfoPanel>
            <h2>
              <i>Wine Bottles</i>
            </h2>
            <Explain>
              Grown from a well cared for Vineyard, these can be aged in the
              Cellar and offer voting rights over artwork and secondary market
              royalties.
            </Explain>
          </InfoPanel>
          <InfoPanel>
            <h2>
              <i>Council</i>
            </h2>
            <Explain>
              Vote for the artwork you love or submit your own and claim all
              secondary market royalties plus a special bonus for winning the
              vote.
            </Explain>
          </InfoPanel>
        </GridContainer>
      </Info1>

      <Info2>
        <Subtitle side="right">How Do I Join?</Subtitle>
        <CustomGridContainer>
          <div>
            <SubSubtitle>
              You&apos;ll need to have some ETH on{" "}
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
              After obtaining a Vineyard from the <Link href="/mint">Mint</Link>{" "}
              or on the{" "}
              <a
                href={
                  process.env.NEXT_PUBLIC_CHAIN_ID === "69"
                    ? `https://testnet.qx.app/collection/${VineyardAddress}`
                    : `https://qx.app/collection/${VineyardAddress}`
                }
                target="_blank"
                rel="noreferrer"
              >
                Secondary Market
              </a>
              , wait for the next season to start, plant during the first week
              of the season, water everyday (or buy a sprinkler) and then
              harvest in the final week of the season.
            </SubSubtitle>
            <SubSubtitle>
              Every season is 12 weeks long except for the first season which is
              only three weeks!
            </SubSubtitle>
            <SubSubtitle>
              Once you have a Wine Bottle take your chances aging it in the
              cellar or propose a new artwork in the Council. Winners will have
              their art featured for a minimum of 7 days and receive all
              secondary market royalties.
            </SubSubtitle>
            <SubSubtitle>
              Voting power comes from wine bottle age. Maximize this with the
              Wine Cellar&apos;s Hyperbolic Time Acceleration Technology&trade;
              but keep an eye out - if you leave a bottle too long it may spoil.
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

      <Info1>
        <Subtitle side="left">Milestones</Subtitle>

        <Roadmap
          items={[
            { text: "Vineyard mint opens", complete: true },
            { text: "Mint out - start first season", complete: false },
            {
              text: "New artwork creation opens up to everyone",
              complete: false,
            },
            {
              text: "Create Snapshot page for community signaling on future expansions",
              complete: false,
            },
            {
              text: "Engage generative artists to be featured",
              complete: false,
            },
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
