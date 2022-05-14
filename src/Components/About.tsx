import { GridContainer, Page } from "../Styles/Components";
import styled from "styled-components";
import { VineyardAddress } from "../Utils/constants";

const Info1 = styled(Page)`
  padding-top: 3rem;
  margin-top: 36px;
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
`;
const Subtitle = styled.h2<{ side: string }>`
  margin: 1rem 3rem;
  text-align: ${(props) => (props.side == "left" ? "left" : "right")};
  font-size: 2rem;
  font-family: FancyFont;
`;

const SubSubtitle = styled.h2`
  margin: 2.2rem 2.2rem 2.4rem 3rem;
  text-align: left;
`;

const Explain = styled.p`
  font-size: 1rem;
`;

const About = () => {
  return (
    <>
      <Info1>
        <Subtitle side="left">What is Hash Valley?</Subtitle>
        <SubSubtitle>
          An idle game where vineyard owners grow their wine collection and own
          the future of the ecosystem.
        </SubSubtitle>
        <GridContainer>
          <InfoPanel>
            <h2>
              <i>Vineyards</i>
            </h2>
            <Explain>
              Mintable NFTs that yield Wine Bottles if they are planted, watered
              and harvested every season.
            </Explain>
          </InfoPanel>
          <InfoPanel>
            <h2>
              <i>Wine Bottles</i>
            </h2>
            <Explain>
              Grown from a well cared for Vineyard, these can be aged in the
              Cellar and offer voting rights over project artwork and secondary
              market royalties.
            </Explain>
          </InfoPanel>
          <InfoPanel>
            <h2>
              <i>Cellar</i>
            </h2>
            <Explain>
              Wine Bottles can be staked here to let them age at an accelerated
              rate. Take care however - a bottle left in here too long might
              spoil into Vinegar.
            </Explain>
          </InfoPanel>
        </GridContainer>
      </Info1>

      <Info2>
        <Subtitle side="right">How Do I Play?</Subtitle>
        <SubSubtitle>
          After obtaining a Vineyard from the <a href="/mint">Mint</a> or on the{" "}
          <a
            href={
              process.env.NEXT_PUBLIC_CHAIN_ID === "69"
                ? `https://testnet.quixotic.io/collection/${VineyardAddress}`
                : `https://quixotic.io/collection/${VineyardAddress}`
            }
            target={"_blank"}
            rel="noreferrer"
          >
            Secondary Market
          </a>
          , wait for the next season to start, plant during the first week of
          the season, water everyday (or buy a sprinkler) and then harvest in
          the final week of the season.
        </SubSubtitle>
        <SubSubtitle>
          Every season is 12 weeks long except for the first season which is
          only three weeks!
        </SubSubtitle>
        <SubSubtitle>
          Once you have a Wine Bottle you'll be able to take your chances with
          the cellar or propose a new artwork in the Council.
        </SubSubtitle>
      </Info2>

      <Info1>
        <Subtitle side="left">Wanna go Deeper?</Subtitle>
        <SubSubtitle>
          Check out the{" "}
          <a
            href="https://inathan-m.gitbook.io/hash-valley-winery/"
            target={"_blank"}
            rel="noreferrer"
          >
            full docs
          </a>{" "}
          or take a look at the{" "}
          <a
            href="https://github.com/hash-valley"
            target={"_blank"}
            rel="noreferrer"
          >
            codebase
          </a>{" "}
          to see more.
        </SubSubtitle>
      </Info1>
    </>
  );
};

export default About;
