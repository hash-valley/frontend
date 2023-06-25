import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { Page, Header, HeaderBack, GreyLink } from "../Styles/Components";
import { useRouter } from "next/router";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { FREE_MINT_QUERY } from "../Utils/queries";
import MintButton from "./MintButton";

const MintPage = styled(Page)`
  margin: 10rem auto 7rem auto;

  margin-top: 0px;
  margin-bottom: 1px;
  padding-top: 0.01px;

  ${(props: MintProps) => (props.ownPage ? "" : "min-height: 100vh;")}
`;

const VintHeader = styled(Header)`
  padding: 18px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(to right, purple, red);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;

  text-shadow: -138px -68px #b2ef9b90, -102px -38px #a6d9f770, -48px -19px #dec0f150;

  animation: vint 0.6s infinite;
`;

const ProgressContainer = styled.div`
  padding: 7px;
  max-width: 60%;
  margin: 0 auto;
  margin-bottom: 12px;

  border-radius: 50px;
  box-shadow: 5px 5px 10px #dbdbdb, -5px -5px 10px #ffffff;

  background: rgb(255, 150, 207);
  background: linear-gradient(120deg, rgba(255, 150, 207, 1) 0%, rgba(218, 122, 215, 1) 100%);
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

const PGF = styled.div`
  margin: auto;
  margin-top: 16px;
  font-size: 1rem;
  background: linear-gradient(to right, red, orange);
  max-width: 350px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

interface MintProps {
  ownPage?: boolean;
}

const pgfPercent = (minted: number, max: number) =>
  (10 + 23 * (minted / max)).toFixed(4).replace(/0+$/, "").replace(/[.]+$/, "");

const Mint: FC<MintProps> = ({ ownPage }) => {
  const { address } = useAccount();
  const router = useRouter();
  const protocol = useCurrSeason();
  const [minted, setMinted] = useState(0);
  const [max, setMax] = useState(Infinity);

  const { data, refetch } = useQuery(FREE_MINT_QUERY, {
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
      setMax(protocol.maxVineyards);
    }
  }, [protocol, data]);

  return (
    <MintPage ownPage={ownPage}>
      <HeaderBack>
        <VintHeader>The Vint</VintHeader>
      </HeaderBack>
      <ProgressContainer>
        <Progress>
          <ProgressBar style={{ width: ((100 * minted) / max).toString() + "%" }}></ProgressBar>
        </Progress>
      </ProgressContainer>
      <br />
      <MintButton />

      <div>
        <PGF>
          <GreyLink href="https://medium.com/ethereum-optimism/retroactive-public-goods-funding-33c9b7d00f0c" target="_blank" rel="noreferrer">
              🔥{pgfPercent(minted, max)}% &#10140; {pgfPercent(minted + 1, max)}% donated to PGF 🔥
          </GreyLink>
        </PGF>
      </div>
    </MintPage>
  );
};

export default Mint;
