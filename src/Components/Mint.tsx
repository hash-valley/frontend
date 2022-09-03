import { useEffect, useState } from "react";
import styled from "styled-components";
import { Page, Header } from "../Styles/Components";
import { useRouter } from "next/router";
import { Button } from "antd";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import { giveawayBalance } from "../Utils/giveawayToken";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ProgressContainer = styled.div`
  padding: 7px;
  max-width: 60%;
  margin: 0 auto;
  margin-bottom: 12px;

  border-radius: 50px;
  box-shadow: 5px 5px 10px #dbdbdb, -5px -5px 10px #ffffff;

  background: rgb(255, 150, 207);
  background: linear-gradient(
    120deg,
    rgba(255, 150, 207, 1) 0%,
    rgba(218, 122, 215, 1) 100%
  );
`;

const Progress = styled.div`
  margin: 0 auto;
  height: 24px;
  background: #e1e4e8;
  border-radius: 12px;
  overflow: hidden;
`;

const ProgressBar = styled.span`
  @-webkit-keyframes progress-animation {
    0% {
      background-position: 100%;
    }
    100% {
      background-position: 0;
    }
  }

  @keyframes progress-animation {
    0% {
      background-position: 100%;
    }
    100% {
      background-position: 0;
    }
  }

  display: block;
  height: 100%;
  background: linear-gradient(
    90deg,
    #ffd33d,
    #ea4aaa 17%,
    #b34bff 34%,
    #01feff 51%,
    #ffd33d 68%,
    #ea4aaa 85%,
    #b34bff
  );
  background-size: 300% 100%;
  -webkit-animation: progress-animation 2s linear infinite;
  animation: progress-animation 2s linear infinite;
`;

const PromoText = styled.i`
  color: green;
`;

const OldPrice = styled.i`
  color: red;
  text-decoration: line-through;
`;

const Centered = styled.div`
  margin: auto;
  margin-left: calc(50% - 67px);
`;

const Mint = () => {
  const { status, address } = useAccount();
  const router = useRouter();
  const protocol = useCurrSeason();
  const [minted, setMinted] = useState(0);
  const [max, setMax] = useState(Infinity);
  const [price, setPrice] = useState(0.07);
  const [hasGive, setHasGive] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);

  useEffect(() => {
    if (status === "connected" && address) {
      giveawayBalance(address!).then((val) =>
        setHasGive(val.gte(BigNumber.from(parseUnits("1.0"))))
      );
      fetch(`/api/merkle?address=${address}`).then(async (res) => {
        let rj = await res.json();
        setHasDiscount(rj.hasClaim);
        setPrice(rj.hasClaim ? 0.04 : 0.07);
      });
    } else {
      setHasGive(false);
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      const supply = protocol.mintedVineyards;
      setMinted(supply);
      if (supply < 100) {
        setPrice(0);
      }
      setMax(protocol.maxVineyards);
    };
    if (protocol) fetchData();
  }, [protocol]);

  return (
    <Page>
      <Header>The Mint</Header>
      <ProgressContainer>
        <Progress>
          <ProgressBar
            style={{ width: ((100 * minted) / max).toString() + "%" }}
          ></ProgressBar>
        </Progress>
      </ProgressContainer>
      <br />
      <h3>
        {minted} / {max} vineyards minted
      </h3>
      {price == 0 ? (
        <h3>
          <i>{100 - minted} free vineyards remaining (then 0.07 Ξ/mint)</i>
        </h3>
      ) : (
        minted < max && (
          <h3>
            {hasDiscount ? (
              <>
                <OldPrice>0.07 Ξ</OldPrice>
                <PromoText> {price} Ξ - Milady Pricing!</PromoText>
              </>
            ) : (
              <i>{price} Ξ</i>
            )}
          </h3>
        )
      )}
      <br />
      <br />
      {minted < max ? (
        <>
          {status === "connected" ? (
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => router.push(`/mint`)}
            >
              Mint
            </Button>
          ) : (
            <Centered>
              <ConnectButton />
            </Centered>
          )}
        </>
      ) : (
        <h2>All Vineyards have been minted!</h2>
      )}
      {minted >= max && hasGive && (
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => router.push(`/mint`)}
        >
          <i>Use Giveaway Token</i>
        </Button>
      )}
    </Page>
  );
};

export default Mint;
