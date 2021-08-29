import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useParams } from "react-router-dom";
import { Menu, Button } from 'elementz';
import {
  Farmable,
  plant,
  water,
  harvest,
  fetchTokenFarmingStats,
  untilCanWater,
  canWaterUntil,
  historicalUri,
  getStreak,
} from "../Utils/vineyardContract";
import { locations, soilTypes } from "../Utils/utils";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import { useQuery } from '@apollo/client';
import { VINEYARD_QUERY } from "../Utils/queries"
import { Page, SuccessText, FailText, Spaced, GreyLink, TokenFrame, CenteredSelect } from "../Styles/Components"
import { ipfs_gateway, vineImage } from "../Utils/constants"
import { useVineVersions } from "../Hooks/useUriVersions"

const VineyardPage = () => {
  const wallet = useWallet();
  const { id } = useParams();
  const uriVersions = useVineVersions();
  const season = useCurrSeason();
  const [nullData, setNullData] = useState(true)
  const [waterStatus, setWaterStatus] = useState(0)
  const [imageUri, setImageUri] = useState("")
  const [uriVersion, setUriVersion] = useState(0)
  const [streak, setStreak] = useState(0)

  const [farmable, setFarmable] = useState<Farmable>({
    canWater: false,
    canHarvest: false,
    canPlant: false
  });

  const { loading, error, data, refetch } = useQuery(VINEYARD_QUERY, { variables: { id: "0x" + id.toString() } })

  const changeImage = async (n: number) => {
    if (!loading) {
      let uri = await historicalUri(n)
      uri = ipfs_gateway + uri + "/?seed=" + data.vineyard.location + "-" + Math.abs(data.vineyard.elevation) + "-" + (data.vineyard.elevation < 0 ? "1" : "0") + "-" + data.vineyard.soil + "-" + data.vineyard.xp
      setUriVersion(n)
      setImageUri(uri)
    }
  }

  useEffect(() => {
    changeImage(uriVersions[uriVersions.length - 1])
  }, [uriVersions]);

  useEffect(() => {
    let myInterval: any
    const fetchBalance = async () => {
      if (data.vineyard) {
        setStreak(await getStreak(id))
        const farmableParams = await fetchTokenFarmingStats(parseInt(id))
        setFarmable(farmableParams);

        let waterCountdown: number = -1
        if (!farmableParams.canPlant) {
          if (farmableParams.canWater) {
            waterCountdown = await canWaterUntil(id)
          } else {
            waterCountdown = await untilCanWater(id)
          }
        }
        setWaterStatus(waterCountdown)
        setNullData(false)

        myInterval = setInterval(() => {
          if (waterCountdown === 0) {
            clearInterval(myInterval)
          } else {
            setWaterStatus(waterCountdown--)
          }
        }, 1000)
      }
    };
    if (!loading && !error) fetchBalance()
    return () => clearInterval(myInterval)
  }, [loading]);

  useEffect(() => {
    refetch()
  }, [wallet, id]);

  const hours = (time: number): string => `${Math.floor(time / 3600)}`
  const minutes = (time: number): string => {
    const num = Math.floor(time / 60) % 60
    return num < 10 ? `0${num}` : `${num}`
  }
  const seconds = (time: number): string => {
    const num = time % 60
    return num < 10 ? `0${num}` : `${num}`
  }

  return (
    loading ?
      <Page>
        <h3>Vineyard: {id}</h3>
        <br />
        <h4><i>Loading...</i></h4>
      </Page> :
      nullData ?
        <Page>
          <h3>Vineyard {id}</h3>
          <br />
          <h4>Vineyard not found</h4>
        </Page> :
        <Page>
          <h3>Vineyard: {id}</h3>
          <TokenFrame src={imageUri} frameBorder="0" />
          <br />
          <CenteredSelect
            value={uriVersion}
            onChange={(event: any) => changeImage(event.target.value)}
          >
            {
              uriVersions.map(n =>
                <option
                  key={n}
                  value={n}
                >
                  Version {n}
                </option>
              )
            }
          </CenteredSelect>
          <br />
          <div><b>TokenId:</b> {id}</div>
          <br />
          <div><b>Location:</b> {locations[data.vineyard.location].name}</div>
          <div><b>Climate:</b> {locations[data.vineyard.location].climate.name}</div>
          <div><b>Elevation:</b> {data.vineyard.elevation}</div>
          <div><b>Soil:</b> {soilTypes[data.vineyard.soil].name}</div>
          <div><b>XP:</b> {data.vineyard.xp}</div>
          <div><b>Streak:</b> {streak}</div>
          <br />

          {
            farmable.canHarvest ?
              <SuccessText>
                Harvestable
              </SuccessText>
              : data.vineyard.seasonsHarvested.includes(season) ?
                <SuccessText>
                  Already harvested this season
                </SuccessText>
                : (
                  farmable.canWater ?
                    <SuccessText>
                      Can water until {hours(waterStatus)}:{minutes(waterStatus)}:{seconds(waterStatus)}
                    </SuccessText>
                    : waterStatus >= 0 ?
                      <SuccessText>
                        Can water in {hours(waterStatus)}:{minutes(waterStatus)}:{seconds(waterStatus)}
                      </SuccessText>
                      : farmable.canPlant ?
                        <SuccessText>
                          Plantable
                        </SuccessText>
                        : <FailText>
                          Vineyard is dead for this season
                        </FailText>
                )

          }
          {
            wallet.account?.toLowerCase() === data.vineyard.owner.id ?
              <div>
                <Spaced disabled={farmable.canWater ? "" : "disabled"} onClick={() => water(wallet, id)}>
                  Water
                </Spaced>
                <Spaced disabled={farmable.canPlant ? "" : "disabled"} onClick={() => plant(wallet, id)}>
                  Plant
                </Spaced>
                <Spaced disabled={farmable.canHarvest ? "" : "disabled"} onClick={() => harvest(wallet, id)}>
                  Harvest
                </Spaced>
              </div>
              : <p>Owned by {data.vineyard.owner.id}</p>
          }
          {
            data.vineyard.bottles ?
              <div>
                Wine Bottles harvested from this vineyard:
                <br />
                {
                  data.vineyard.bottles.map((bottle: any) => (
                    <div key={bottle.id}>
                      <GreyLink to={"/bottle/" + parseInt(bottle.id).toString()}>Bottle #{parseInt(bottle.id)}</GreyLink>
                    </div>
                  ))
                }
              </div>
              : null
          }
        </Page>
  );
};

export default VineyardPage;
