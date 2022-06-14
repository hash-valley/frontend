import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Farmable,
  plant,
  water,
  harvest,
  untilCanWater,
  canWaterUntil,
  getStreak,
  buySprinkler,
} from "../../Utils/vineyardContract";
import { hours, minutes, seconds, toDate } from "../../Utils/utils";
import { useCurrSeason } from "../../Hooks/useCurrSeason";
import { useQuery } from "@apollo/client";
import { VINEYARD_QUERY } from "../../Utils/queries";
import {
  Page,
  SuccessText,
  FailText,
  Spaced,
  GreyLink,
  TokenFrame,
  CenteredSelect,
  TokenPage,
  TokenSign,
} from "../../Styles/Components";
import Select from "rc-select";
import { Button } from "antd";
import { chainId, ipfs_gateway, VineyardAddress } from "../../Utils/constants";
import { locations, soilTypes } from "../../Utils/attributes";
import { useAccount, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { getFarmingStatsMulti } from "../../Utils/multicall";
import { toast } from "react-toastify";

const VineyardPage = () => {
  const wallet = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();
  const router = useRouter();
  const { id } = router.query;
  const season = useCurrSeason();
  const [nullData, setNullData] = useState(true);
  const [waterStatus, setWaterStatus] = useState(0);
  const [imageUri, setImageUri] = useState("");
  const [uriVersion, setUriVersion] = useState(0);
  const [streak, setStreak] = useState(0);
  const [refetching, setRefetching] = useState(false);

  const [farmable, setFarmable] = useState<Farmable>({
    canPlant: false,
    canWater: false,
    canHarvest: false,
  });

  const { loading, error, data, refetch } = useQuery(VINEYARD_QUERY, {
    variables: { id: id?.toString() },
  });

  const changeImage = async (n: number) => {
    if (!loading) {
      let uri = data.newUris.find((e: any) => e.version === n).newUri;
      uri =
        ipfs_gateway +
        uri.substring(7) +
        "/?seed=" +
        data.vineyard.location +
        "-" +
        Math.abs(data.vineyard.elevation) +
        "-" +
        (data.vineyard.elevation < 0 ? "1" : "0") +
        "-" +
        data.vineyard.soil +
        "-" +
        data.vineyard.xp;
      setUriVersion(n);
      setImageUri(uri);
    }
  };

  useEffect(() => {
    let myInterval: any;
    const fetchBalance = async () => {
      if (data.vineyard) {
        setNullData(false);
        setStreak(await getStreak(Number(id)));
        const farmableParams = (
          await getFarmingStatsMulti([parseInt(id.toString())])
        )[0];
        setFarmable(farmableParams);

        let waterCountdown: number = -1;
        if (!farmableParams.canPlant) {
          if (farmableParams.canWater) {
            waterCountdown = await canWaterUntil(Number(id));
          } else {
            waterCountdown = await untilCanWater(Number(id));
          }
        }
        setWaterStatus(waterCountdown);

        changeImage(data.newUris.length - 1);

        myInterval = setInterval(() => {
          if (waterCountdown === 0) {
            clearInterval(myInterval);
          } else {
            setWaterStatus(waterCountdown--);
          }
        }, 1000);
      }
    };
    if (!loading && !error && !refetching) fetchBalance();
    return () => clearInterval(myInterval);
  }, [loading, refetching]);

  useEffect(() => {
    refetch();
  }, [wallet, id]);

  const sendWater = async () => {
    const tx = await water(signer, Number(id));
    addRecentTransaction({
      hash: tx.hash,
      description: `Water vineyard ${Number(id)}`,
    });
    await tx.wait();
    toast.success("Success!");
    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  const sendPlant = async () => {
    const tx = await plant(signer, Number(id));
    addRecentTransaction({
      hash: tx.hash,
      description: `Plant vineyard ${Number(id)}`,
    });
    await tx.wait();
    toast.success("Success!");
    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  const sendHarvest = async () => {
    const tx = await harvest(signer, Number(id));
    addRecentTransaction({
      hash: tx.hash,
      description: `Harvest vineyard ${Number(id)}`,
    });
    await tx.wait();
    toast.success("Success!");
    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  const sendBuySprinkler = async () => {
    const tx = await buySprinkler(signer, Number(id));
    addRecentTransaction({
      hash: tx.hash,
      description: `Buy sprinkler for Vineyard ${Number(id)}`,
    });
    await tx.wait();
    toast.success("Success!");
    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  return loading ? (
    <Page>
      <h3>Vineyard: {id}</h3>
      <br />
      <h4>
        <i>Loading...</i>
      </h4>
    </Page>
  ) : nullData ? (
    <Page>
      <h3>Vineyard {id}</h3>
      <br />
      <h4>Vineyard not found</h4>
    </Page>
  ) : (
    <TokenPage>
      <h3>Vineyard {id}</h3>
      <TokenFrame src={imageUri} frameBorder="0" />
      <br />
      <CenteredSelect
        value={uriVersion}
        onChange={(event: any) => changeImage(event)}
      >
        {data.newUris.map((n: any) => (
          <Select.Option key={n.version} value={n.version}>
            Version {n.version}
          </Select.Option>
        ))}
      </CenteredSelect>
      <TokenSign>
        <div>
          <b>TokenId:</b> {id}
        </div>
        <br />
        <div>
          <b>Location:</b> {locations[data.vineyard.location].name}
        </div>
        <div>
          <b>Climate:</b> {locations[data.vineyard.location].climate.name}
        </div>
        <div>
          <b>Elevation:</b> {data.vineyard.elevation}
        </div>
        <div>
          <b>Soil:</b> {soilTypes[data.vineyard.soil].name}
        </div>
        <div>
          <b>XP:</b> {data.vineyard.xp}
        </div>
        <div>
          <b>Streak:</b> {streak}
        </div>
        <div>
          {data.vineyard.sprinklerExpires &&
          Number(data.vineyard.sprinklerExpires) > Date.now() / 1000 ? (
            <>
              <b>Sprinkler expires:</b> {toDate(data.vineyard.sprinklerExpires)}
            </>
          ) : (
            <>
              <b>No Sprinkler</b>
              <Button type="text" size="middle" onClick={sendBuySprinkler}>
                Buy Sprinkler (0.01 Ξ)
              </Button>
            </>
          )}
        </div>
        <br />

        {farmable.canHarvest ? (
          <SuccessText>Harvestable</SuccessText>
        ) : data.vineyard.seasonsHarvested.includes(season.season) ? (
          <SuccessText>Already harvested this season</SuccessText>
        ) : farmable.canWater ? (
          <SuccessText>
            Can water until {hours(waterStatus)}:{minutes(waterStatus)}:
            {seconds(waterStatus)}
          </SuccessText>
        ) : waterStatus >= 0 ? (
          data.vineyard.sprinklerExpires ? (
            <SuccessText>Sprinkling</SuccessText>
          ) : (
            <SuccessText>
              Can water in {hours(waterStatus)}:{minutes(waterStatus)}:
              {seconds(waterStatus)}
            </SuccessText>
          )
        ) : farmable.canPlant ? (
          <SuccessText>Plantable</SuccessText>
        ) : (
          <FailText>Vineyard is dead for this season</FailText>
        )}
      </TokenSign>

      {wallet.data?.address?.toLowerCase() === data.vineyard.owner.id ? (
        <div>
          <Spaced
            type="primary"
            shape="round"
            disabled={!farmable.canWater}
            onClick={sendWater}
          >
            Water
          </Spaced>
          <Spaced
            type="primary"
            shape="round"
            disabled={!farmable.canPlant}
            onClick={sendPlant}
          >
            Plant
          </Spaced>
          <Spaced
            type="primary"
            shape="round"
            disabled={!farmable.canHarvest}
            onClick={sendHarvest}
          >
            Harvest
          </Spaced>
        </div>
      ) : (
        <p>Owned by {data.vineyard.owner.id}</p>
      )}

      <a
        href={`${
          chainId === 10
            ? "https://quixotic.io/asset"
            : "https://testnet.quixotic.io/asset"
        }/${VineyardAddress}/${id}`}
        target="_blank"
        rel="noreferrer"
      >
        View on Marketplace
      </a>
      <br />
      <br />

      {data.vineyard.bottles ? (
        <div>
          Wine Bottles harvested from this vineyard:
          <br />
          {data.vineyard.bottles.map((bottle: any) => (
            <div key={bottle.id}>
              <GreyLink href={"/bottle/" + parseInt(bottle.id).toString()}>
                <a>Bottle #{parseInt(bottle.id)}</a>
              </GreyLink>
            </div>
          ))}
        </div>
      ) : null}
    </TokenPage>
  );
};

export default VineyardPage;
