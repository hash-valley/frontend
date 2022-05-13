import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { VINEPROTOCOL_QUERY } from "../Utils/queries";
import styled from "styled-components";
import { Page } from "../Styles/Components";
import { useRouter } from "next/router";
import { Button } from "antd";
import { useCurrSeason } from "../Hooks/useCurrSeason";

const ProgressContainer = styled.div`
  padding: 7px;
  max-width: 60%;
  margin: 0 auto;
  margin-bottom: 12px;

  border-radius: 50px;
  background: #ffffff;
  box-shadow: 5px 5px 10px #dbdbdb, -5px -5px 10px #ffffff;
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

const Header = styled.h1`
  margin: 9rem 0 7rem 0;
  font-size: 3rem;
  font-family: FancyFont;
`;

const Splash = () => {
  const router = useRouter();
  const protocol = useCurrSeason();
  const [minted, setMinted] = useState(0);
  const [max, setMax] = useState(Infinity);
  const [price, setPrice] = useState(0.05);

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
      <Header>Hash Valley Winery</Header>
      <ProgressContainer>
        <Progress>
          <ProgressBar
            style={{ width: ((100 * minted) / max).toString() + "%" }}
          ></ProgressBar>
        </Progress>
      </ProgressContainer>
      <br />
      <h3>
        {minted} / {max} minted
      </h3>
      {price == 0 ? (
        <h3>
          <i>{100 - minted} free vineyards remaining (then 0.05 Ξ/mint)</i>
        </h3>
      ) : (
        <h3>
          <i>{price} Ξ</i>
        </h3>
      )}
      <br />
      <br />
      {minted < max ? (
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => router.push(`/mint`)}
        >
          Mint
        </Button>
      ) : (
        <h2>All Vineyards have been minted already!</h2>
      )}
    </Page>
  );
};

export default Splash;
