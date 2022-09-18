import { useState, useEffect } from "react";
import { locations, soilTypes } from "../Utils/attributes";
import { newVineyards } from "../Utils/vineyardContract";
import { giveawayBalance } from "../Utils/giveawayToken";
import {
  GridContainer,
  GridItem,
  Page,
  Spaced,
  RoundedImg,
} from "../Styles/Components";
import styled from "styled-components";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import MintSketch from "../Components/MintSketch";
import { chainId } from "../Utils/constants";
import { useRouter } from "next/router";

const Step = styled.div`
  margin-top: 32px;
`;

const Sign = styled.div`
  margin: 32px 0 12px 0;
`;

const MintContainer = () => {
  const { address, status } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const router = useRouter();
  const addRecentTransaction = useAddRecentTransaction();
  const protocol = useCurrSeason();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(0);
  const [elev, setElev] = useState(0);
  const [soil, setSoil] = useState(0);
  const [mintHash, setMintHash] = useState("");

  const [giveBal, setGiveBal] = useState("0");

  useEffect(() => checkGiveaway(), [address]);

  const minElev = (num: number) => locations[num].elevation[0];
  const maxElev = (num: number) => locations[num].elevation[1];

  const startOver = async () => {
    router.push("/");
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
    checkGiveaway();
  };

  const checkGiveaway = () => {
    if (status === "connected" && address) {
      giveawayBalance(address!).then((val) => setGiveBal(val));
    }
  };

  const handleElev = (event: any) => {
    setElev(event.target.value);
  };

  const mint = async () => {
    const tx = await newVineyards([city, elev, soil], signer, address!);
    addRecentTransaction({ hash: tx.hash, description: "Mint new vineyard" });
    await tx.wait();
    toast.success("Success!");
    //@ts-ignore
    setMintHash(tx?.hash);
  };

  const mintGiveaway = async () => {
    const tx = await newVineyards(
      [city, elev, soil],
      signer,
      protocol.currentPrice
    );
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
          <p>
            Location will affect the elevations you can plant at. Climate will
            affect the notes on the bottles you harvest
          </p>
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
          <p>
            At low elevations you&apos;re more likely to harvest red and white
            wines. At higher elevations you&apos;re more likely to get sparkling
            and rosés
          </p>
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
            <p>Soil affects the likelihood of harvesting specific vintages</p>
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
          ) : status === "connected" && address ? (
            <>
              <Spaced
                size="large"
                type="default"
                shape="round"
                onClick={startOver}
              >
                Start over
              </Spaced>
              {chain?.id === chainId ? (
                <>
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
                <p>Please switch networks in your wallet to continue</p>
              )}
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
