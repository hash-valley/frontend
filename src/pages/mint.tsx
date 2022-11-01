import { useState, useEffect, useContext } from "react";
import { locations, soilTypes } from "../Utils/attributes";
import { newVineyards, newVineyardsGiveaway } from "../Utils/vineyardContract";
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
import MintSketch from "../Components/MintSketch";
import { chainId, DECIMALS } from "../Utils/constants";
import { useRouter } from "next/router";
import { formatUnits } from "ethers/lib/utils";
import { useQuery } from "@apollo/client";
import { FREE_MINT_QUERY } from "../Utils/queries";
import { BigNumber } from "ethers";
import { ModalContext } from "../Hooks/ModalProvider";

const Step = styled.div`
  margin-top: 32px;
`;

const Sign = styled.div`
  margin: 32px 0 12px 0;
`;

const revealedAt = (i: number) =>
  i === 15 ? 500 : i === 16 ? 2500 : i === 17 ? 5000 : 5500;

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

  const { data } = useQuery(FREE_MINT_QUERY, {
    variables: {
      userAddress: address?.toLowerCase() ?? "",
    },
  });

  const minElev = (num: number) => locations[num].elevation[0];
  const maxElev = (num: number) => locations[num].elevation[1];

  const startOver = async () => {
    router.push("/mintprogress");
  };

  const back = () => {
    setStep(step - 1);
    if (step == 0) setElev(Math.floor((minElev(city) + maxElev(city)) / 2));
  };

  const selectCity = (num: number, bonus: boolean) => {
    if (
      bonus &&
      BigNumber.from(data?.account?.giveawayBalance ?? 0).lt(DECIMALS)
    )
      return;
    if (num > protocol.locales) return;
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
  };

  const handleElev = (event: any) => {
    setElev(event.target.value);
  };

  const { openModal, closeModal }: any = useContext(ModalContext);

  const mint = async () => {
    openModal();
    const tx = await newVineyards(
      [city, elev, soil],
      signer,
      protocol.currentPrice
    );
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({ hash: tx.hash, description: "Mint new vineyard" });

    await tx.wait();
    closeModal();

    //@ts-ignore
    setMintHash(tx?.hash);
  };

  const mintGiveaway = async () => {
    openModal();
    const tx = await newVineyardsGiveaway([city, elev, soil], signer);
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: "Mint new vineyard with Merchant token",
    });

    await tx.wait();
    closeModal();

    //@ts-ignore
    setMintHash(tx?.hash);
  };

  const checkMerchantToken = () =>
    BigNumber.from(data?.account?.giveawayBalance ?? 0).gte(DECIMALS) &&
    (protocol.mintedVineyards >= 1000 || city > 14);

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
            {locations.map((loc, index) =>
              loc.bonus ? (
                <GridItem
                  key={loc.name}
                  onClick={() => selectCity(index, true)}
                >
                  <RoundedImg
                    src={
                      index <= protocol.locales
                        ? `/thumbnails/vineyards/${index}.png`
                        : `/thumbnails/vineyards/question.png`
                    }
                    height={120}
                    width={120}
                    unoptimized={true}
                  />
                  {index <= protocol.locales ? (
                    <>
                      <div>{loc.name}</div>
                      <div>{loc.climate.name}</div>
                    </>
                  ) : (
                    <>
                      <br />
                      <i>Revealed at {revealedAt(index)} mints</i>
                      <br />
                    </>
                  )}
                  <i>Merchant Token required</i>
                </GridItem>
              ) : (
                <GridItem
                  key={loc.name}
                  onClick={() => selectCity(index, false)}
                >
                  <RoundedImg
                    src={`/thumbnails/vineyards/${index}.png`}
                    height={120}
                    width={120}
                    unoptimized={true}
                  />
                  <div>{loc.name}</div>
                  <div>{loc.climate.name}</div>
                </GridItem>
              )
            )}
          </GridContainer>
        </Step>
      ) : step == 1 ? (
        <Step>
          <h3>Select Elevation</h3>
          <p>
            {city < 15
              ? `At low elevations you're more likely to harvest red and white
            wines. At higher elevations you're more likely to get sparkling
            and rosés`
              : `Special locations have their own set of wines they and only they can grow`}
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
                      disabled={city >= 15}
                    >
                      Mint
                    </Spaced>
                  )}
                  <>
                    <br />
                    {checkMerchantToken() && (
                      <Spaced
                        size="large"
                        type="primary"
                        shape="round"
                        onClick={mintGiveaway}
                      >
                        Use Merchant Token (
                        {formatUnits(data.account.giveawayBalance)})
                      </Spaced>
                    )}
                  </>
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
