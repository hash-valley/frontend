import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import Vine from "../Media/vine.png";
import Dirt from "../Media/dirt.png";
import { Button } from "elementz";
import { locations, soilTypes } from "../Utils/utils";
import { newVineyards, historicalUri } from "../Utils/vineyardContract";
import {
  GridContainer,
  GridItem,
  Page,
  TokenFrame,
} from "../Styles/Components";
import { ipfs_gateway } from "../Utils/constants";
import { useVineVersions } from "../Hooks/useUriVersions";
import styled from "styled-components";

const Step = styled.div`
  margin-top: 32px;
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
      setBaseUri(await historicalUri(uriVersions[uriVersions.length - 1]));
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
    ipfs_gateway +
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
                <img src={Vine} height="120" />
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
          <Button onClick={() => selectElev(elev)}>Select Elevation</Button>
          <br />
          <br />
          <Button onClick={back}>BacK</Button>
        </Step>
      ) : step == 2 ? (
        <Step>
          <div className="soil">
            <h3>Select Soil Type</h3>
            <br />
            <GridContainer>
              {soilTypes.map((soil, index) => (
                <GridItem key={soil.name} onClick={() => selectSoil(index)}>
                  <img src={Dirt} height="120" />
                  <div>{soil.name}</div>
                </GridItem>
              ))}
            </GridContainer>
            <br />
            <br />
            <Button onClick={back}>BacK</Button>
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
          <br />
          <div>Location: {locations[city].name}</div>
          <div>Elevation: {elev} feet</div>
          <div>Soil Type: {soilTypes[soil].name}</div>
          <br />
          {mintHash ? (
            <p>Transaction sent: {mintHash}</p>
          ) : wallet.status === "connected" ? (
            <Button primary onClick={mint}>
              Mint
            </Button>
          ) : (
            <p>Connect Wallet to continue</p>
          )}
          <br />
          <br />
          <Button onClick={startOver}>
            {mintHash ? "Mint Another" : "Start Over"}
          </Button>
        </Step>
      )}
    </Page>
  );
};

export default MintContainer;
