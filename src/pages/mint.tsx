import { useState, useEffect } from "react";
import { Button } from "antd";
import { locations, soilTypes } from "../Utils/attributes";
import { newVineyards, newVineyardsGiveaway } from "../Utils/vineyardContract";
import { giveawayBalance } from "../Utils/giveawayToken";
import {
  GridContainer,
  GridItem,
  Page,
  TokenFrame,
  Spaced,
  RoundedImg,
  SketchFrame,
} from "../Styles/Components";
import styled from "styled-components";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import { useQuery } from "@apollo/client";
import { MINT_QUERY } from "../Utils/queries";
import { ipfs_gateway } from "../Utils/constants";
import { useAccount, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import MintSketch from "../Components/MintSketch";

const Step = styled.div`
  margin-top: 32px;
`;

const Sign = styled.div`
  margin: 32px 0 12px 0;
`;

const MintContainer = () => {
  const wallet = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();
  const protocol = useCurrSeason();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(0);
  const [elev, setElev] = useState(0);
  const [soil, setSoil] = useState(0);
  const [mintHash, setMintHash] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [baseUri, setBaseUri] = useState("");

  const [giveBal, setGiveBal] = useState("0");

  const { loading, error, data } = useQuery(MINT_QUERY, {
    onCompleted: (_data) => {
      setBaseUri(ipfs_gateway + _data.newUris[0].newUri.substring(7));
    },
  });

  useEffect(() => checkGiveaway(), [wallet.data?.address]);

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

  const selectSoil = () => {
    setStep(3);
    setImageUri(renderImg(soil));
    checkGiveaway();
  };

  const checkGiveaway = () => {
    if (wallet.status === "success" && wallet.data?.address) {
      giveawayBalance(wallet.data?.address!).then((val) => setGiveBal(val));
    }
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
    const tx = await newVineyards(
      [city, elev, soil],
      signer,
      wallet.data?.address!
    );
    addRecentTransaction({ hash: tx.hash, description: "Mint new vineyard" });
    await tx.wait();
    toast.success("Success!");
    //@ts-ignore
    setMintHash(tx?.hash);
  };

  const mintGiveaway = async () => {
    const tx = await newVineyardsGiveaway([city, elev, soil], signer);
    addRecentTransaction({
      hash: tx.hash,
      description: "Mint new vineyard with token",
    });
    await tx.wait();
    toast.success("Success!");
    //@ts-ignore
    setMintHash(tx?.hash);
  };

  return (
    <Page>
      <h2>Mint a Vineyard</h2>

      {step > 0 && (
        <MintSketch
          vine_elevation={elev}
          vine_location={city}
          vine_soil={soil}
        />
      )}

      {step == 0 ? (
        <Step>
          <h3>Select a Location</h3>
          <GridContainer>
            {locations.map((loc, index) => (
              <GridItem key={loc.name} onClick={() => selectCity(index)}>
                <RoundedImg
                  src={`/thumbnails/vineyards/${index}.png`}
                  height={120}
                  width={120}
                />
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
              {soilTypes.map((_soil, index) => (
                <GridItem
                  selected={soil === index}
                  key={_soil.name}
                  onClick={() => setSoil(index)}
                >
                  <RoundedImg
                    src={`/thumbnails/dirt/${index}.png`}
                    height={130}
                    width={120}
                  />
                  <div>{_soil.name}</div>
                </GridItem>
              ))}
            </GridContainer>
            <br />
            <br />
            <Spaced size="large" type="default" shape="round" onClick={back}>
              Back
            </Spaced>
            <Spaced
              size="large"
              type="primary"
              shape="round"
              onClick={() => selectSoil()}
            >
              Confirm
            </Spaced>
          </div>
        </Step>
      ) : (
        <Step>
          <p>
            <i>
              Your vineyard is dynamic and will develop as you care for it over
              time.
              <br />
              Voting in the council will unlock new art updates
            </i>
          </p>
          <Sign>
            <div>
              <b>Location:</b> {locations[city].name}
            </div>
            <div>
              <b>Climate:</b> {locations[city].climate.name}
            </div>
            <div>
              <b>Elevation:</b> {elev} feet
            </div>
            <div>
              <b>Soil Type:</b> {soilTypes[soil].name}
            </div>
          </Sign>
          {mintHash ? (
            <Spaced
              size="large"
              type="default"
              shape="round"
              onClick={startOver}
            >
              Mint Another
            </Spaced>
          ) : wallet.status === "success" && wallet.data?.address ? (
            <>
              <Spaced
                size="large"
                type="default"
                shape="round"
                onClick={startOver}
              >
                Start over
              </Spaced>
              {protocol.mintedVineyards < protocol.maxVineyards && (
                <Spaced
                  size="large"
                  type="primary"
                  shape="round"
                  onClick={mint}
                >
                  Mint
                </Spaced>
              )}
              {BigInt(giveBal) >= 1e18 ? (
                <Spaced
                  size="large"
                  type="primary"
                  shape="round"
                  onClick={mintGiveaway}
                >
                  Use Giveaway Token
                </Spaced>
              ) : null}
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
