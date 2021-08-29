import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "elementz";
import { useQuery } from '@apollo/client';
import { VINEPROTOCOL_QUERY } from "../Utils/queries"
import discord from '../Media/discord.svg'
import twitter from '../Media/twitter.svg'
import github from '../Media/github.svg'
import docs from '../Media/docs.svg'
import styled from "styled-components"
import { Page } from "../Styles/Components"

const Progress = styled.div`
  margin: 0 auto;
  max-width: 60%;
  height: 24px;
  background: #e1e4e8;
  border-radius: 12px;
  overflow: hidden;
`

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
  background: linear-gradient(90deg, #ffd33d, #ea4aaa 17%, #b34bff 34%, #01feff 51%, #ffd33d 68%, #ea4aaa 85%, #b34bff);
  background-size: 300% 100%;
  -webkit-animation: progress-animation 2s linear infinite;
          animation: progress-animation 2s linear infinite;
`

const Footer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  color: rgb(168, 168, 168);
  text-align: center;
  padding-top: 12px;
`

const FooterLink = styled.a`
  margin-right: 24px;
  margin-left: 24px;
  opacity: .35;

  &:hover {
    opacity: .6;
    transition-duration: 0.2s;
  }
`

const Splash = () => {
  const history = useHistory();
  const [minted, setMinted] = useState(0)
  const [max, setMax] = useState(Infinity)
  const [price, setPrice] = useState(0.05)

  const { loading, error, data, refetch } = useQuery(VINEPROTOCOL_QUERY)

  useEffect(() => {
    const fetchData = async () => {
      if (data.vineProtocol) {
        const supply = data.vineProtocol.mintedVineyards
        setMinted(supply)
        if (supply < 100) {
          setPrice(0)
        }
        setMax(data.vineProtocol.maxVineyards)
      }
    };
    if (!loading && !error) fetchData();
  }, [loading]);

  useEffect(() => {
    refetch()
  }, [history]);

  return (
    <div>
      <Page>
        <h1>Hash Valley Winery</h1>
        <br /><br /><br />
        <Progress>
          <ProgressBar style={{ width: (100 * minted / max).toString() + "%" }}></ProgressBar>
        </Progress>
        <br />
        <h3>{minted} / {max} minted</h3>
        {
          price == 0 ? <h3><i>{100 - minted} free vineyards remaining (then 0.05 ETH/mint)</i></h3> : <h3><i>{price} ETH</i></h3>
        }
        < br />< br />
        {
          minted < max ?
            <Button primary rounded onClick={() => history.push(`/mint`)}>
              Mint
            </Button>
            : <h2>All Vineyards have been minted already!</h2>
        }
      </Page>
      <Footer>
        <FooterLink href="https://www.github.com"><img src={github} /></FooterLink>
        <FooterLink href="https://www.twitter.com"><img src={twitter} /></FooterLink>
        <FooterLink href="https://www.discord.com"><img src={discord} /></FooterLink>
        <FooterLink href="https://www.github.com"><img src={docs} /></FooterLink>
      </Footer>
    </div>
  );
};

export default Splash;
