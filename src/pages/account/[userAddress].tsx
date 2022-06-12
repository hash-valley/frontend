import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Farmable,
  plantMultiple,
  waterMultiple,
  harvestMultiple,
} from "../../Utils/vineyardContract";
import { formatNum, getBottleClass, getBottleName } from "../../Utils/utils";
import { useQuery } from "@apollo/client";
import { ACCOUNT_QUERY } from "../../Utils/queries";
import {
  GridContainer,
  GridItem,
  Page,
  SuccessText,
  Spaced,
  RoundedImg,
} from "../../Styles/Components";
import { locations, soilTypes } from "../../Utils/attributes";
import { formatEther } from "ethers/lib/utils";
import { useAccount, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { getFarmingStatsMulti } from "../../Utils/multicall";

interface Mults {
  canWater: number;
  canPlant: number;
  canHarvest: number;
}

const AccountPage = () => {
  const wallet = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();
  const router = useRouter();
  const { userAddress } = router.query;
  const [view, setView] = useState("vineyards");
  const [loadingContract, setLoadingContract] = useState(true);
  const [nullData, setNullData] = useState(false);
  const [farmables, setFarmables] = useState<Array<Farmable>>([]);
  const [mults, setMults] = useState<Mults>({
    canWater: 0,
    canPlant: 0,
    canHarvest: 0,
  });

  const { loading, error, data, refetch } = useQuery(ACCOUNT_QUERY, {
    variables: { userAddress: userAddress?.toString().toLowerCase() },
    onCompleted: async (_data) => {
      if (_data.account) {
        setNullData(false);

        const farmables = await getFarmingStatsMulti(
          _data.account.vineyards.map((v: any) => v.tokenId)
        );
        setFarmables(farmables);

        let multAccumulator: Mults = {
          canWater: 0,
          canPlant: 0,
          canHarvest: 0,
        };
        farmables.forEach((e: any) => {
          multAccumulator.canWater += e.canWater ? 1 : 0;
          multAccumulator.canPlant += e.canPlant ? 1 : 0;
          multAccumulator.canHarvest += e.canHarvest ? 1 : 0;
        });
        setMults(multAccumulator);
        setLoadingContract(false);
      } else {
        setLoadingContract(false);
        setNullData(true);
      }
    },
  });

  useEffect(() => {
    setLoadingContract(true);
    refetch();
  }, [userAddress]);

  const sendPlantMultiple = async () => {
    let tokens = data.account.vineyards.filter(
      (e: any, i: number) => farmables[i].canPlant
    );
    let ids: string[] = tokens.map((t: any) => t.tokenId);
    const tx = await plantMultiple(signer, ids);
    addRecentTransaction({
      hash: tx.hash,
      description: "Plant multiple vineyards",
    });
    setTimeout(refetch, 2000);
  };

  const sendWaterMultiple = async () => {
    let tokens = data.account.vineyards.filter(
      (e: any, i: number) => farmables[i].canWater
    );
    let ids: string[] = tokens.map((t: any) => t.tokenId);
    const tx = await waterMultiple(signer, ids);
    addRecentTransaction({
      hash: tx.hash,
      description: "Water multiple vineyards",
    });
    setTimeout(refetch, 2000);
  };

  const sendHarvestMultiple = async () => {
    let tokens = data.account.vineyards.filter(
      (e: any, i: number) => farmables[i].canHarvest
    );
    let ids: string[] = tokens.map((t: any) => t.tokenId);
    const tx = await harvestMultiple(signer, ids);
    addRecentTransaction({
      hash: tx.hash,
      description: "Harvest multiple vineyards",
    });
    setTimeout(refetch, 2000);
  };

  return (
    <Page>
      {loading || loadingContract ? (
        <h3>
          <i>Loading...</i>
        </h3>
      ) : nullData ? (
        <h3>No assets found for this account</h3>
      ) : (
        <div>
          <h3>
            {userAddress === wallet.data?.address && "You own"}{" "}
            {data.account.vineyards.length} Vineyard
            {data.account.vineyards.length === 1 ? "" : "s"},{" "}
            {data.account.bottles.length} Bottle
            {data.account.bottles.length === 1 ? "" : "s"} and{" "}
            {formatNum(formatEther(data.account.vinegarBalance))} Vinegar
          </h3>
          <div>
            {view == "bottles" && (
              <div>
                <Spaced
                  type="default"
                  shape="round"
                  onClick={() => setView("vineyards")}
                >
                  Vineyards
                </Spaced>
                <Spaced type="primary" shape="round">
                  Bottles
                </Spaced>
              </div>
            )}
            {(view == "vineyards" || view == undefined) && (
              <div>
                <Spaced type="primary" shape="round">
                  Vineyards
                </Spaced>
                <Spaced
                  type="default"
                  shape="round"
                  onClick={() => setView("bottles")}
                >
                  Bottles
                </Spaced>
              </div>
            )}
          </div>
          <div>
            {wallet.status === "success" &&
            userAddress === wallet.data?.address ? (
              <div>
                {mults.canPlant > 0 ? (
                  <Spaced
                    type="primary"
                    shape="round"
                    onClick={sendPlantMultiple}
                  >
                    Plant All
                  </Spaced>
                ) : null}
                {mults.canWater > 0 ? (
                  <Spaced
                    type="primary"
                    shape="round"
                    onClick={sendWaterMultiple}
                  >
                    Water All
                  </Spaced>
                ) : null}
                {mults.canHarvest > 0 ? (
                  <Spaced
                    type="primary"
                    shape="round"
                    onClick={sendHarvestMultiple}
                  >
                    Harvest All
                  </Spaced>
                ) : null}
              </div>
            ) : null}
          </div>
          {(view == "vineyards" || view == undefined) && (
            <GridContainer>
              {data.account.vineyards.map((token: any, index: number) => (
                <GridItem
                  key={token.tokenId}
                  onClick={() => router.push(`/vineyard/${token.tokenId}`)}
                >
                  <RoundedImg
                    src={`/thumbnails/vineyards/${token.location}.png`}
                    height={120}
                    width={120}
                  />
                  <div>TokenId: {token.tokenId}</div>
                  <div>Location: {locations[token.location].name}</div>
                  <div>Climate: {locations[token.location].climate.name}</div>
                  <div>Elevation: {token.elevation}</div>
                  <div>Soil: {soilTypes[token.soil].name}</div>
                  <div>XP: {token.xp}</div>
                  <SuccessText>
                    {farmables[index]?.canPlant ? "Plantable" : null}
                  </SuccessText>
                  <SuccessText>
                    {farmables[index]?.canWater ? "Waterable" : null}
                  </SuccessText>
                  <SuccessText>
                    {farmables[index]?.canHarvest ? "Harvestable" : null}
                  </SuccessText>
                </GridItem>
              ))}
            </GridContainer>
          )}
          {view == "bottles" && (
            <GridContainer>
              {data.account.bottles.map((token: any) => (
                <GridItem
                  key={token.tokenId}
                  onClick={() => router.push(`/bottle/${token.tokenId}`)}
                >
                  <RoundedImg
                    src={
                      token.attributes[0] === 3
                        ? `/thumbnails/bottles/${
                            token.attributes[0] + token.attributes[1]
                          }.png`
                        : `/thumbnails/bottles/${token.attributes[0]}.png`
                    }
                    height={120}
                    width={120}
                  />
                  <div>TokenId: {token.tokenId}</div>
                  <div>Type: {getBottleClass(token.attributes)}</div>
                  <div>Name: {getBottleName(token.attributes)}</div>
                  {token.inCellar && <div>Aging in cellar</div>}
                  {token.canEnterCellar && <div>Can be aged in cellar</div>}
                  {!token.canEnterCellar && !token.inCellar && (
                    <div>Already aged in cellar</div>
                  )}
                  {token.spoiled && <div>Spoiled to vinegar</div>}
                </GridItem>
              ))}
            </GridContainer>
          )}
        </div>
      )}
    </Page>
  );
};

export default AccountPage;
