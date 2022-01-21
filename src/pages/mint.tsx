import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import Image from "next/image";
import { Button } from "antd";
import { locations, soilTypes } from "../Utils/utils";
import { newVineyards, historicalUriIpfs } from "../Utils/vineyardContract";
import {
  GreyLink,
  GridContainer,
  GridItem,
  Page,
  TokenFrame,
  Spaced,
} from "../Styles/Components";
import { useVineVersions } from "../Hooks/useUriVersions";
import styled from "styled-components";

const Step = styled.div`
  margin-top: 32px;
`;

const Sign = styled.div`
  margin: 32px 0 12px 0;
`;

const MintContainer = () => {
  const wallet = useWallet();
  const uriVersions = useVineVersions();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(0);
  const [elev, setElev] = useState(0);
  const [soil, setSoil] = useState(0);
  const [mintHash, setMintHash] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [baseUri, setBaseUri] = useState("");

  useEffect(() => {
    const fetchBaseUri = async () =>
      setBaseUri(await historicalUriIpfs(uriVersions[uriVersions.length - 1]));
    fetchBaseUri();
  }, []);

  const minElev = (num: number) => locations[num].elevation[0];
  const maxElev = (num: number) => locations[num].elevation[1];

  const startOver = () => {
    setMintHash("");
    setStep(0);
    setCity(0);
    setElev(0);
    setSoil(0);
  };

  const back = () => {
    setStep(step - 1);
    if (step == 0) setElev(Math.floor((minElev(city) + maxElev(city)) / 2));
  };

  const selectCity = (num: number) => {
    setCity(num);
    setStep(1);
    setElev(Math.floor((minElev(num) + maxElev(num)) / 2));
  };

  const selectElev = (num: number) => {
    setElev(num);
    setStep(2);
  };

  const selectSoil = (num: number) => {
    setSoil(num);
    setStep(3);
    setImageUri(renderImg(num));
  };

  const handleElev = (event: any) => {
    setElev(event.target.value);
  };

  const renderImg = (soilNow: number) =>
    baseUri +
    "/?seed=" +
    city +
    "-" +
    Math.abs(elev) +
    "-" +
    (elev < 0 ? "1" : "0") +
    "-" +
    soilNow +
    "-0";

  const mint = async () => {
    const tx = await newVineyards([city, elev, soil], wallet);
    //@ts-ignore
    setMintHash(tx.hash);
  };

  return (
    <Page>
      <h2>Mint a Vineyard</h2>
      {step == 0 ? (
        <Step>
          <h3>Select a Location</h3>
          <GridContainer>
            {locations.map((loc, index) => (
              <GridItem key={loc.name} onClick={() => selectCity(index)}>
                <Image src={`/thumbnails/vineyards/${index}.png`} height={120} width={120} />
                <div>{loc.name}</div>
                <div>{loc.climate.name}</div>
              </GridItem>
            ))}
          </GridContainer>
        </Step>
      ) : step == 1 ? (
        <Step>
          <h3>Select Elevation</h3>
          <br />
          {minElev(city) != maxElev(city) && (
            <input
              type="range"
              min={minElev(city)}
              max={maxElev(city)}
              value={elev}
              onChange={handleElev}
              className="slider"
              id="myRange"
            />
          )}
          <br />
          {elev}
          <br />
          <br />
          <br />
          <Spaced size="large" type="default" shape="round" onClick={back}>
            Back
          </Spaced>
          <Spaced
            size="large"
            type="primary"
            shape="round"
            onClick={() => selectElev(elev)}
          >
            Confirm
          </Spaced>
        </Step>
      ) : step == 2 ? (
        <Step>
          <div className="soil">
            <h3>Select Soil Type</h3>
            <br />
            <GridContainer>
              {soilTypes.map((soil, index) => (
                <GridItem key={soil.name} onClick={() => selectSoil(index)}>
                  <Image src={`/thumbnails/dirt/${index}.png`} height={130} width={120} />
                  <div>{soil.name}</div>
                </GridItem>
              ))}
            </GridContainer>
            <br />
            <br />
            <Button size="large" type="default" shape="round" onClick={back}>
              Back
            </Button>
          </div>
        </Step>
      ) : (
        <Step>
          <TokenFrame src={imageUri} frameBorder="0" />
          <p>
            <i>
              Your vineyard willl grow and develop as you care for it over time
            </i>
          </p>
          <Sign>
            <div>
              <b>Location:</b> {locations[city].name}
            </div>
            <div>
              <b>Elevation:</b> {elev} feet
            </div>
            <div>
              <b>Soil Type:</b> {soilTypes[soil].name}
            </div>
          </Sign>
          {mintHash ? (
            <>
              <GreyLink href={`https://etherscan.io/tx/${mintHash}`}>
                <a target={"_blank"}>Transaction sent: {mintHash}</a>
              </GreyLink>
              <br />
              <br />
              <Button
                size="large"
                type="default"
                shape="round"
                onClick={startOver}
              >
                Mint Another
              </Button>
            </>
          ) : wallet.status === "connected" ? (
            <>
              <Spaced
                size="large"
                type="default"
                shape="round"
                onClick={startOver}
              >
                Start over
              </Spaced>
              <Spaced size="large" type="primary" shape="round" onClick={mint}>
                Mint
              </Spaced>
            </>
          ) : (
            <p>Connect Wallet to continue</p>
          )}
        </Step>
      )}
    </Page>
  );
};

export default MintContainer;
