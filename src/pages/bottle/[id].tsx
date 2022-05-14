import { useEffect, useRef, useState } from "react";
import { useWallet } from "use-wallet";
import { useRouter } from "next/router";
import {
  bottleAge,
  isCellarApproved,
  approveCellar,
  rejuvenate,
  historicalUriIpfs,
} from "../../Utils/bottleContract";
import { stake, withdraw } from "../../Utils/cellarContract";
import { useQuery } from "@apollo/client";
import { BOTTLE_QUERY } from "../../Utils/queries";
import {
  Page,
  Spaced,
  GreyLink,
  TokenFrame,
  CenteredSelect,
  TokenPage,
  TokenSign,
} from "../../Styles/Components";
import { BottleAddress, chainId, ZERO_ADDRESS } from "../../Utils/constants";
import {
  secondsToString,
  getBottleEra,
  getBottleType,
  BottleType,
  chanceOfSpoil,
  day,
  ageOnRemove,
  year,
} from "../../Utils/utils";
import { useBottleVersions } from "../../Hooks/useUriVersions";
import Select from "rc-select";
import { BigNumber } from "ethers";

const BottlePage = () => {
  const wallet = useWallet();
  const router = useRouter();
  const { id } = router.query;
  const uriVersions = useBottleVersions();
  const [uriVersion, setUriVersion] = useState(0);
  const [age, setAge] = useState("0");
  const [isApproved, setIsApproved] = useState(false);
  const [nullData, setNullData] = useState(true);
  const [bottleType, setBottleType] = useState<BottleType>({
    type: "",
    subtype: "",
    note: "",
    name: "",
  });
  const [imageUri, setImageUri] = useState("");
  const cellarStuff: any = useRef(null);

  const { loading, error, data, refetch } = useQuery(BOTTLE_QUERY, {
    variables: { id: "0x" + id?.toString() },
  });

  const changeImage = async (n: number) => {
    if (!loading && data.bottle) {
      let uri = await historicalUriIpfs(n);
      uri =
        uri +
        "/?seed=" +
        data.bottle.attributes[0] +
        "-" +
        data.bottle.attributes[1] +
        "-" +
        data.bottle.attributes[2] +
        "-" +
        data.bottle.attributes[3] +
        "-" +
        age;
      setUriVersion(n);
      setImageUri(uri);
    }
  };

  useEffect(() => {
    changeImage(uriVersions[uriVersions.length - 1]);
  }, [uriVersions, id]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (data.bottle) {
        setNullData(false);
        setIsApproved(await isCellarApproved(data.bottle.owner.id));

        let fetchedAge = await bottleAge(parseInt(id.toString()));
        setAge(fetchedAge);
        setBottleType(getBottleType(data.bottle.attributes));

        if (data.bottle.inCellar) {
          const stakeTime = Math.floor(
            Date.now() / 1000 - data?.bottle?.stakedAt
          );
          const ageR = BigNumber.from(ageOnRemove(stakeTime).toString());
          cellarStuff.current = {
            stakeTime,
            spoilChance: chanceOfSpoil(Math.floor(stakeTime / day)),
            vinegar: ageOnRemove(stakeTime).toString(),
            age: ageR.div(year).toString(),
            era: getBottleEra(ageR.toString()),
          };
        }
      }
    };
    if (!loading && !error) fetchBalance();
  }, [loading]);

  useEffect(() => {
    refetch();
  }, [wallet, id]);

  return loading ? (
    <Page>
      <h3>Bottle: {id}</h3>
      <br />
      <h4>
        <i>Loading...</i>
      </h4>
    </Page>
  ) : nullData ? (
    <Page>
      <h3>Bottle {id}</h3>
      <br />
      <h4>Bottle not found</h4>
    </Page>
  ) : (
    <TokenPage>
      <h3>Bottle {id}</h3>
      <br />
      <TokenFrame src={imageUri} frameBorder="0" />
      <br />
      <CenteredSelect
        value={uriVersion}
        onChange={(event: any) => changeImage(event.target.value)}
      >
        {uriVersions.map((n) => (
          <Select.Option key={n} value={n}>
            Version {n}
          </Select.Option>
        ))}
      </CenteredSelect>
      <TokenSign>
        <div>
          <b>TokenId:</b> {id}
        </div>
        <br />
        <div>
          <b>Age:</b> {secondsToString(age)}
        </div>
        <div>
          <b>Era:</b> {getBottleEra(age)}
        </div>
        <br />
        <div>
          <b>Type:</b> {bottleType.type}
        </div>
        <div>
          <b>Subtype:</b> {bottleType.subtype}
        </div>
        <div>
          <b>Notes:</b> {bottleType.note}
        </div>
        <div>
          <b>Name:</b> {bottleType.name}
        </div>
        {data.bottle.inCellar && (
          <>
            <br />
            <div>
              <i>Aging in cellar</i>
            </div>
            <div>
              <b>Staked for:</b>{" "}
              {secondsToString(cellarStuff?.current?.stakeTime ?? 0)}
            </div>
            <div>
              <b>Chance of spoil:</b> {cellarStuff?.current?.spoilChance}%
            </div>
            <div>
              <b>Vinegar received if spoil: </b>
              {cellarStuff?.current?.vinegar}
            </div>
            <div>
              <b>Age on removal if not spoiled:</b> {cellarStuff?.current?.age}{" "}
              years
            </div>
            <div>
              <b>Era on removal if not spoiled: </b>
              {cellarStuff?.current?.era}
            </div>
          </>
        )}
        {!data.bottle.inCellar && !data.bottle.canEnterCellar && (
          <div>Already aged in cellar</div>
        )}
        {data.bottle.spoiled && <div>Spoiled to vinegar</div>}
      </TokenSign>

      {data.bottle.rejuvenatedTo && (
        <div>
          Burnt to revive{" "}
          <GreyLink
            href={
              "/bottle/" + parseInt(data.bottle.rejuvenatedTo.id).toString()
            }
          >
            <a>Bottle #{parseInt(data.bottle.rejuvenatedTo.id)}</a>
          </GreyLink>
        </div>
      )}
      {data.bottle.rejuvenatedFrom && (
        <div>
          Rejuvenated from{" "}
          <GreyLink
            href={
              "/bottle/" + parseInt(data.bottle.rejuvenatedFrom.id).toString()
            }
          >
            <a>Bottle #{parseInt(data.bottle.rejuvenatedFrom.id)}</a>
          </GreyLink>
        </div>
      )}
      {data.bottle.from && (
        <div>
          Harvested from{" "}
          <GreyLink
            href={"/vineyard/" + parseInt(data.bottle.from.id).toString()}
          >
            <a>Vineyard #{parseInt(data.bottle.from.id)}</a>
          </GreyLink>
        </div>
      )}
      <br />

      <a
        href={`${
          chainId === 10
            ? "https://quixotic.io/asset"
            : "https://testnet.quixotic.io/asset"
        }/${BottleAddress}/${id}`}
        target={"_blank"}
        rel="noreferrer"
      >
        View on Marketplace
      </a>
      <br />
      <br />

      {wallet.account?.toLowerCase() === data.bottle.owner.id ? (
        isApproved ? (
          <div>
            <Spaced
              type="primary"
              shape="round"
              disabled={data.bottle.canEnterCellar ? false : true}
              onClick={() => stake(wallet, Number(id))}
            >
              Add to Cellar
            </Spaced>
            <Spaced
              type="primary"
              shape="round"
              disabled={
                data.bottle.inCellar && !data.bottle.spoiled ? false : true
              }
              onClick={() => withdraw(wallet, Number(id))}
            >
              Withdraw from Cellar
            </Spaced>
            {data.bottle.spoiled && (
              <Spaced
                type="default"
                shape="round"
                disabled={
                  BigInt(data.bottle.rejuvenateCost) <=
                  BigInt(data.bottle.owner.vinegarBalance)
                    ? false
                    : true
                }
                onClick={() => rejuvenate(wallet, Number(id))}
              >
                Rejuvenate for {data.bottle.rejuvenateCost} Vinegar
              </Spaced>
            )}
          </div>
        ) : (
          <Spaced
            type="default"
            shape="round"
            disabled={data.bottle.canEnterCellar ? false : true}
            onClick={() => approveCellar(wallet)}
          >
            Approve Cellar
          </Spaced>
        )
      ) : data.bottle.owner.id != ZERO_ADDRESS ? (
        <p>Owned by {data.bottle.owner.id}</p>
      ) : null}
    </TokenPage>
  );
};

export default BottlePage;
