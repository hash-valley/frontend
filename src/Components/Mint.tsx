import { useEffect, useState } from "react";
import styled from "styled-components";
import { Page, Header, HeaderBack } from "../Styles/Components";
import { useRouter } from "next/router";
import { Button } from "antd";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import { BigNumber, utils } from "ethers";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@apollo/client";
import { FREE_MINT_QUERY } from "../Utils/queries";
import { DECIMALS } from "../Utils/constants";
import { formatUnits } from "ethers/lib/utils";

const MintPage = styled(Page)`
  margin: 10rem auto 7rem auto;

  margin-top: 0px;
  margin-bottom: 1px;
  padding-top: 0.01px;
  min-height: 100vh;
`;

const VintHeader = styled(Header)`
  padding: 18px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(to right, purple, red);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;

  text-shadow: -136px -68px #b2ef9b90, -102px -38px #a6d9f770,
    -48px -24px #dec0f150;
`;

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

const Centered = styled.div`
  margin: auto;
  margin-left: calc(50% - 67px);
`;

const BonusText = styled.div`
  margin: auto;
  max-width: 275px;
  background: linear-gradient(
    to right,
    #ef5350,
    #f48fb1,
    #7e57c2,
    #2196f3,
    #26c6da,
    #43a047
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Mint = () => {
  const { status, address } = useAccount();
  const router = useRouter();
  const protocol = useCurrSeason();
  const [minted, setMinted] = useState(0);
  const [max, setMax] = useState(Infinity);
  const [price, setPrice] = useState("0.0");
  const [canMint, setCanMint] = useState(false);

  const { loading, data, refetch } = useQuery(FREE_MINT_QUERY, {
    variables: {
      userAddress: address?.toLowerCase() ?? "",
    },
  });

  useEffect(() => {
    async function reload() {
      await protocol.update();
      await refetch();
    }
    reload();
  }, [router.query.slug]);

  useEffect(() => {
    if (protocol.bottle && max === Infinity) {
      setMinted(protocol.mintedVineyards);
      setPrice(utils.formatEther(protocol.currentPrice));
      setMax(protocol.maxVineyards);
    }
    if (!loading) {
      setCanMint(
        protocol.mintedVineyards >= 1000 ||
          data.account === null ||
          data?.account?.vineyards.length < 5
      );
    }
  }, [protocol, data]);

  return (
    <MintPage>
      <HeaderBack>
        <VintHeader>The Vint</VintHeader>
      </HeaderBack>
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
      {minted < 1000 ? (
        <h3>
          <p>{1000 - minted} free vineyards remaining then 0.01 Ξ</p>
          <p>-</p>
          <i>
            You&apos;ve claimed {data?.account?.vineyards.length ?? 0} / 5 free
            vineyards
          </i>
        </h3>
      ) : (
        minted < max && (
          <h3>
            <p>{price} Ξ</p>
            <i>Price increases 0.01 Ξ every 500 mints</i>
          </h3>
        )
      )}
      {minted >= 5000 && (
        <BonusText>Bonus: 5000 $GRAPE, 5000 $VINEGAR</BonusText>
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
              disabled={!canMint}
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
      {minted >= max &&
        BigNumber.from(data?.account?.giveawayBalance ?? 0).gte(DECIMALS) && (
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={() => router.push(`/mint`)}
          >
            Use Merchant Token ({formatUnits(data.account.giveawayBalance)})
          </Button>
        )}
    </MintPage>
  );
};

export default Mint;
