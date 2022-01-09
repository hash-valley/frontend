import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useRouter } from "next/router";
import { utils } from "ethers";
import {
  Farmable,
  plantMultiple,
  waterMultiple,
  harvestMultiple,
  fetchTokenFarmingStats,
} from "../../Utils/vineyardContract";
import { locations, soilTypes, formatNum } from "../../Utils/utils";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { ACCOUNT_QUERY } from "../../Utils/queries";
import {
  GridContainer,
  GridItem,
  Page,
  SuccessText,
  Spaced,
} from "../../Styles/Components";

interface Mults {
  canWater: number;
  canPlant: number;
  canHarvest: number;
}

const AccountPage = () => {
  const wallet = useWallet();
  const router = useRouter();
  const { userAddress } = router.query;
  const [view, setView] = useState("vineyards");
  const [nullData, setNullData] = useState(true);
  const [farmables, setFarmables] = useState<Array<Farmable>>([]);
  const [mults, setMults] = useState<Mults>({
    canWater: 0,
    canPlant: 0,
    canHarvest: 0,
  });

  const { loading, error, data, refetch } = useQuery(ACCOUNT_QUERY, {
    variables: { userAddress: userAddress?.toString().toLowerCase() },
  });

  useEffect(() => {
    const fetchBalance = async () => {
      if (data.account) {
        const farmables: Farmable[] = await Promise.all(
          data.account.vineyards.map(
            async (v: any) => await fetchTokenFarmingStats(v.tokenId)
          )
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
        setNullData(false);
      }
    };
    if (!loading && !error) fetchBalance();
  }, [loading]);

  useEffect(() => {
    refetch();
  }, [wallet, userAddress]);

  const sendPlantMultiple = () => {
    let tokens = data.account.vineyards.filter(
      (e: any, i: number) => farmables[i].canPlant
    );
    let ids: string[] = tokens.map((t: any) => t.tokenId);
    plantMultiple(wallet, ids);
  };

  const sendWaterMultiple = () => {
    let tokens = data.account.vineyards.filter(
      (e: any, i: number) => farmables[i].canWater
    );
    let ids: string[] = tokens.map((t: any) => t.tokenId);
    waterMultiple(wallet, ids);
  };

  const sendHarvestMultiple = () => {
    let tokens = data.account.vineyards.filter(
      (e: any, i: number) => farmables[i].canHarvest
    );
    let ids: string[] = tokens.map((t: any) => t.tokenId);
    harvestMultiple(wallet, ids);
  };

  return (
    <Page>
      {loading ? (
        <h3>
          <i>Loading...</i>
        </h3>
      ) : nullData ? (
        <h3>No assets found for this account</h3>
      ) : (
        <div>
          {userAddress === wallet.account ? (
            <h3>
              You own {data.account.vineyards.length} Vineyard
              {data.account.vineyards.length === 1 ? "" : "s"},{" "}
              {data.account.bottles.length} Bottle
              {data.account.bottles.length === 1 ? "" : "s"} and{" "}
              {formatNum(utils.formatEther(data.account.vinegarBalance))}{" "}
              Vinegar
            </h3>
          ) : (
            <h3>
              {data.account.vineyards.length} Vineyard
              {data.account.vineyards.length === 1 ? "" : "s"},{" "}
              {data.account.bottles.length} Bottle
              {data.account.bottles.length === 1 ? "" : "s"} and{" "}
              {formatNum(utils.formatEther(data.account.vinegarBalance))}{" "}
              Vinegar
            </h3>
          )}
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
            {wallet.status === "connected" && userAddress === wallet.account ? (
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
                  <Image src="/vine.png" height={120} width={120} />
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
                  <Image src="/bottle.png" height={120} width={120} />
                  <div>TokenId: {token.tokenId}</div>
                  <div>Attributes: {token.attributes}</div>
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
