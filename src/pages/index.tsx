import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { VINEPROTOCOL_QUERY } from "../Utils/queries";
import Image from "next/image";
import styled from "styled-components";
import { Page } from "../Styles/Components";
import { useRouter } from "next/router";
import { Button } from "antd";

const Progress = styled.div`
  margin: 0 auto;
  max-width: 60%;
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

const Footer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  color: rgb(168, 168, 168);
  text-align: center;
  padding-top: 12px;
`;

const FooterLink = styled.a`
  margin-right: 24px;
  margin-left: 24px;
  opacity: 0.35;

  &:hover {
    opacity: 0.6;
    transition-duration: 0.2s;
  }
`;

const Splash = () => {
  const router = useRouter();
  const [minted, setMinted] = useState(0);
  const [max, setMax] = useState(Infinity);
  const [price, setPrice] = useState(0.05);

  const { loading, error, data, refetch } = useQuery(VINEPROTOCOL_QUERY);

  useEffect(() => {
    const fetchData = async () => {
      if (data.vineProtocol) {
        const supply = data.vineProtocol.mintedVineyards;
        setMinted(supply);
        if (supply < 100) {
          setPrice(0);
        }
        setMax(data.vineProtocol.maxVineyards);
      }
    };
    if (!loading && !error) fetchData();
  }, [loading]);

  useEffect(() => {
    refetch();
  }, [router]);

  return (
    <>
      <Page>
        <h1>Hash Valley Winery</h1>
        <br />
        <br />
        <br />
        <Progress>
          <ProgressBar
            style={{ width: ((100 * minted) / max).toString() + "%" }}
          ></ProgressBar>
        </Progress>
        <br />
        <h3>
          {minted} / {max} minted
        </h3>
        {price == 0 ? (
          <h3>
            <i>{100 - minted} free vineyards remaining (then 0.05 ETH/mint)</i>
          </h3>
        ) : (
          <h3>
            <i>{price} ETH</i>
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
      <Footer>
        <FooterLink href="https://www.github.com">
          <Image src="/github.svg" height={24} width={24} />
        </FooterLink>
        <FooterLink href="https://www.twitter.com">
          <Image src="/twitter.svg" height={24} width={24} />
        </FooterLink>
        <FooterLink href="https://www.discord.com">
          <Image src="/discord.svg" height={24} width={24} />
        </FooterLink>
        <FooterLink href="https://www.medium.com">
          <Image src="/medium.svg" height={24} width={24} />
        </FooterLink>
      </Footer>
    </>
  );
};

export default Splash;
