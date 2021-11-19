import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWallet } from "use-wallet";
import { useHistory } from "react-router-dom";
import { utils } from "ethers";
import {
  Farmable,
  plantMultiple,
  waterMultiple,
  harvestMultiple,
  fetchTokenFarmingStats,
} from "../Utils/vineyardContract";
import { locations, soilTypes, formatNum } from "../Utils/utils";
import Vine from "../Media/vine.png";
import Bottle from "../Media/bottle.png";
import { useQuery } from "@apollo/client";
import { ACCOUNT_QUERY } from "../Utils/queries";
import {
  GridContainer,
  GridItem,
  Page,
  SuccessText,
  Spaced,
} from "../Styles/Components";

interface Mults {
  canWater: number;
  canPlant: number;
  canHarvest: number;
}

const AccountPage = () => {
  const wallet = useWallet();
  const history = useHistory();
  const { userAddress, view } = useParams();
  const [nullData, setNullData] = useState(true);
  const [farmables, setFarmables] = useState<Array<Farmable>>([]);
  const [mults, setMults] = useState<Mults>({
    canWater: 0,
    canPlant: 0,
    canHarvest: 0,
  });

  const { loading, error, data, refetch } = useQuery(ACCOUNT_QUERY, {
    variables: { userAddress: userAddress.toLowerCase() },
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
                  primary
                  onClick={() =>
                    history.push(`/account/${userAddress}/vineyards`)
                  }
                >
                  Vineyards
                </Spaced>
                <Spaced primary reverse active>
                  Bottles
                </Spaced>
              </div>
            )}
            {(view == "vineyards" || view == undefined) && (
              <div>
                <Spaced primary reverse active>
                  Vineyards
                </Spaced>
                <Spaced
                  primary
                  onClick={() =>
                    history.push(`/account/${userAddress}/bottles`)
                  }
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
                  <Spaced primary onClick={sendPlantMultiple}>
                    Plant All
                  </Spaced>
                ) : null}
                {mults.canWater > 0 ? (
                  <Spaced primary onClick={sendWaterMultiple}>
                    Water All
                  </Spaced>
                ) : null}
                {mults.canHarvest > 0 ? (
                  <Spaced primary onClick={sendHarvestMultiple}>
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
                  onClick={() => history.push(`/vineyard/${token.tokenId}`)}
                >
                  <img src={Vine} height="120" />
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
                  onClick={() => history.push(`/bottle/${token.tokenId}`)}
                >
                  <img src={Bottle} height="120" />
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
