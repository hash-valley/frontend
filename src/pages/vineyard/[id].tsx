import { useContext, useEffect, useState } from "react";
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
  harvestGrapes,
} from "../../Utils/vineyardContract";
import { getEns, hours, minutes, seconds, toDate } from "../../Utils/utils";
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
  InfoText,
  Tag,
} from "../../Styles/Components";
import Select from "rc-select";
import { Button } from "antd";
import { chainId, ipfs_gateway, VineyardAddress } from "../../Utils/constants";
import { locations, soilTypes } from "../../Utils/attributes";
import { useAccount, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { getFarmingStatsMulti } from "../../Utils/multicall";
import { ModalContext } from "../../Hooks/ModalProvider";
import LoadingSpinner from "../../Components/LoadingSpinner";

const VineyardPage = () => {
  const { address } = useAccount();
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
  const [ensData, setEns] = useState<undefined | null | string>();

  const [farmable, setFarmable] = useState<Farmable>({
    canPlant: false,
    canWater: false,
    canHarvest: false,
  });

  const { loading, error, data, refetch } = useQuery(VINEYARD_QUERY, {
    variables: { id: id?.toString() },
    onCompleted: (_data) => {
      if (_data?.vineyard?.owner.id)
        getEns(_data?.vineyard?.owner.id).then((x) => {
          setEns(x);
        });
    },
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
      if (data.vineyard && id) {
        setNullData(false);
        setStreak(await getStreak(Number(id)));
        const farmableParams = (await getFarmingStatsMulti([parseInt(id.toString())]))[0];
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
  }, [address, id]);

  const { openModal, closeModal }: any = useContext(ModalContext);

  const sendWater = async () => {
    openModal();
    const tx = await water(signer, Number(id));
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: `Water vineyard ${Number(id)}`,
    });

    await tx.wait();
    closeModal();

    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  const sendPlant = async () => {
    openModal();
    const tx = await plant(signer, Number(id));
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: `Plant vineyard ${Number(id)}`,
    });

    await tx.wait();
    closeModal();

    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  const sendHarvest = async () => {
    openModal();
    const tx = await harvest(signer, Number(id));
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: `Harvest vineyard ${Number(id)}`,
    });

    await tx.wait();
    closeModal();

    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  const sendHarvestGrapes = async () => {
    openModal();
    const tx = await harvestGrapes(signer, Number(id));
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: `Harvest vineyard ${Number(id)}`,
    });

    await tx.wait();
    closeModal();

    setRefetching(true);
    setTimeout(() => refetch().then(() => setRefetching(false)), 2000);
  };

  const sendBuySprinkler = async () => {
    openModal();
    const tx = await buySprinkler(signer, Number(id));
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: `Buy sprinkler for Vineyard ${Number(id)}`,
    });
    setRefetching(true);

    await tx.wait();
    closeModal();

    setTimeout(() => refetch().then(() => setRefetching(false)), 10000);
  };

  const harvestFailureChance = (remaining: number, harvested: number) => {
    const maxGrapes = remaining + harvested;
    const thresh = (9000 * maxGrapes) / 10000;
    if (harvested >= thresh) {
      return 0; // 100% chance of failure
    } else {
      return 100 - (100 * harvested) / maxGrapes;
    }
  };

  return loading ? (
    <Page>
      <h2>Vineyard: {id}</h2>
      <br />
      <h3>
        <LoadingSpinner />
      </h3>
    </Page>
  ) : nullData ? (
    <Page>
      <h2>Vineyard {id}</h2>
      <br />
      <h3>Vineyard not found</h3>
    </Page>
  ) : (
    <TokenPage>
      <h2>Vineyard {id} </h2>
      <TokenFrame src={imageUri} frameBorder="0" />
      <br />
      <CenteredSelect value={uriVersion} onChange={(event: any) => changeImage(event)}>
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
        {data.vineyard.vitalized && (
          <>
            <Tag color="green">Vitalized</Tag>
            <br />
            <br />
          </>
        )}
        {data.vineyard.witherdeadline && (
          <>
            <div>
              <b>Withers at:</b> {toDate(data.vineyard.witherDeadline)}
            </div>
            <br />
          </>
        )}
        <div>
          {data.vineyard.sprinklerExpires &&
            Number(data.vineyard.sprinklerExpires) > Date.now() / 1000 && (
              <>
                <b>Sprinkler expires:</b> {toDate(data.vineyard.sprinklerExpires)}
              </>
            )}
          <>
            <br />
            {refetching ? (
              "..."
            ) : (
              <Button type="primary" size="middle" onClick={sendBuySprinkler}>
                Buy Sprinkler - add 3 months (Sale: 0 Ξ)
              </Button>
            )}
          </>
        </div>
        <br />

        {season.season > 0 ? (
          <>
            {farmable.canHarvest ? (
              <SuccessText>Harvestable</SuccessText>
            ) : data.vineyard.seasonsHarvested.includes(season.season) ? (
              <SuccessText>Already harvested this season</SuccessText>
            ) : farmable.canWater ? (
              <SuccessText>
                Can water until {hours(waterStatus)}:{minutes(waterStatus)}:{seconds(waterStatus)}
              </SuccessText>
            ) : waterStatus >= 0 ? (
              data.vineyard.sprinklerExpires ? (
                <SuccessText>Sprinkling</SuccessText>
              ) : (
                <SuccessText>
                  Can water in {hours(waterStatus)}:{minutes(waterStatus)}:{seconds(waterStatus)}
                </SuccessText>
              )
            ) : farmable.canPlant ? (
              <SuccessText>Plantable</SuccessText>
            ) : (
              <FailText>Vineyard is dead for this season</FailText>
            )}
          </>
        ) : (
          <InfoText>First season starting soon</InfoText>
        )}
      </TokenSign>

      <TokenSign>
        {Number(data?.vineyard?.grapeStatus[0]?.season) === season.season ? (
          <>
            <div>
              <b>Bottle Harvest:</b>{" "}
              {harvestFailureChance(
                Number(data.vineyard.grapeStatus[0].remaining),
                Number(data.vineyard.grapeStatus[0].harvested)
              )}
              % chance
            </div>
            <div>
              <b>Harvestable Grapes:</b> {data.vineyard.grapeStatus[0].remaining}
            </div>
            <div>
              <>
                <b>Grapes Harvested this Season:</b> {data.vineyard.grapeStatus[0].harvested}
              </>
            </div>
          </>
        ) : (
          <>
            <div>
              <b>Bottle Harvest:</b> 100% chance
            </div>
            <div>
              <b>Harvestable Grapes:</b> {10000 + Number(data.vineyard.xp)}
            </div>
            <div>
              <b>Grapes Harvested this Season:</b> 0
            </div>
          </>
        )}

        <Spaced
          type="primary"
          shape="round"
          onClick={sendHarvestGrapes}
          disabled={
            farmable.canPlant || season.season === 0 || (waterStatus <= 0 && !farmable.canPlant)
          }
        >
          Harvest Grapes
        </Spaced>

        <br />
        <i>
          <a
            href="https://inathan-m.gitbook.io/hash-valley-winery/usdgrape"
            target="_blank"
            rel="noreferrer"
          >
            How does this work?
          </a>
        </i>
      </TokenSign>

      {address?.toLowerCase() === data.vineyard.owner.id ? (
        <div>
          <Spaced type="primary" shape="round" disabled={!farmable.canWater} onClick={sendWater}>
            Water
          </Spaced>
          <Spaced type="primary" shape="round" disabled={!farmable.canPlant} onClick={sendPlant}>
            Plant
          </Spaced>
          <Spaced
            type="primary"
            shape="round"
            disabled={!farmable.canHarvest}
            onClick={sendHarvest}
          >
            Harvest Wine Bottle
          </Spaced>
        </div>
      ) : (
        <p>
          Owned by{" "}
          <GreyLink href={"/account/" + data.vineyard.owner.id}>
            {ensData === undefined ? "..." : ensData === null ? data.vineyard.owner.id : ensData}
          </GreyLink>
        </p>
      )}

      <a
        href={`${
          chainId === 10 ? "https://qx.app/asset" : "https://testnet.qx.app/asset"
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
                Bottle #{parseInt(bottle.id)}
              </GreyLink>
            </div>
          ))}
        </div>
      ) : null}
    </TokenPage>
  );
};

export default VineyardPage;
