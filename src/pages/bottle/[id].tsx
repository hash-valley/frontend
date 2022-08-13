import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  bottleAge,
  isCellarApproved,
  approveCellar,
  rejuvenate,
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
import {
  BottleAddress,
  chainId,
  DAY,
  ipfs_gateway,
  YEAR,
  ZERO_ADDRESS,
} from "../../Utils/constants";
import {
  secondsToString,
  getBottleEra,
  getBottleType,
  BottleType,
  chanceOfSpoil,
  ageOnRemove,
  formatNum,
} from "../../Utils/utils";
import Select from "rc-select";
import { BigNumber } from "ethers";
import { useAccount, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { formatEther } from "ethers/lib/utils";
import { toast } from "react-toastify";

const BottlePage = () => {
  const wallet = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();
  const router = useRouter();
  const { id } = router.query;
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
    variables: { id: id?.toString() },
    onCompleted: async (_data: any) => {
      if (_data.bottle) {
        setNullData(false);
        setIsApproved(await isCellarApproved(_data.bottle.owner.id));

        let fetchedAge = await bottleAge(parseInt(id.toString()));
        setAge(fetchedAge);
        setBottleType(getBottleType(_data.bottle.attributes));

        changeImage(_data.newUris.length - 1, _data, fetchedAge);

        if (_data.bottle.inCellar) {
          const stakeTime = Math.floor(
            Date.now() / 1000 - _data?.bottle?.stakedAt
          );
          const ageR = BigNumber.from(ageOnRemove(stakeTime).toString());
          cellarStuff.current = {
            stakeTime,
            spoilChance: chanceOfSpoil(Math.floor(stakeTime / DAY)),
            vinegar: ageR.div(86400).toString(),
            age: ageR.div(YEAR).toString(),
            era: getBottleEra(ageR.toString()),
          };
        }
      }
    },
  });

  const changeImage = async (n: number, _data = data, _age = age) => {
    let uri = _data.newUris.find((e: any) => e.version === n).newUri;
    uri =
      ipfs_gateway +
      uri.substring(7) +
      "/?seed=" +
      _data.bottle.attributes[0] +
      "-" +
      _data.bottle.attributes[1] +
      "-" +
      _data.bottle.attributes[2] +
      "-" +
      _data.bottle.attributes[3] +
      "-" +
      _age;
    setUriVersion(n);
    setImageUri(uri);
  };

  useEffect(() => {
    refetch();
  }, [wallet, id]);

  const sendStake = async () => {
    const tx = await stake(signer, Number(id));
    addRecentTransaction({
      hash: tx.hash,
      description: `Stake bottle ${Number(id)}`,
    });
    await tx.wait();
    toast.success("Success!");
    setTimeout(refetch, 2000);
  };

  const sendWithdraw = async () => {
    const tx = await withdraw(signer, Number(id));
    addRecentTransaction({
      hash: tx.hash,
      description: `Withdraw bottle ${Number(id)}`,
    });
    await tx.wait();
    toast.success("Success!");
    setTimeout(refetch, 2000);
  };

  const sendRejuve = async () => {
    const tx = await rejuvenate(signer, Number(id));
    addRecentTransaction({
      hash: tx.hash,
      description: `Rejuvenate bottle ${Number(id)}`,
    });
    await tx.wait();
    toast.success("Success!");
    setTimeout(refetch, 2000);
  };

  const sendApproveCellar = async () => {
    const tx = await approveCellar(signer);
    addRecentTransaction({ hash: tx.hash, description: "Approve cellar" });
    await tx.wait();
    toast.success("Success!");
    setTimeout(
      async () => setIsApproved(await isCellarApproved(data.bottle.owner.id)),
      2000
    );
  };

  return loading ? (
    <Page>
      <h2>Bottle: {id}</h2>
      <br />
      <h3>
        <i>Loading</i>
      </h3>
    </Page>
  ) : nullData ? (
    <Page>
      <h2>Bottle {id}</h2>
      <br />
      <h3>Bottle not found</h3>
    </Page>
  ) : (
    <TokenPage>
      <h2>Bottle {id}</h2>
      <br />
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
        target="_blank"
        rel="noreferrer"
      >
        View on Marketplace
      </a>
      <br />
      <br />

      {wallet.data?.address?.toLowerCase() === data.bottle.owner.id ? (
        isApproved ? (
          <div>
            <Spaced
              type="primary"
              shape="round"
              disabled={!data.bottle.canEnterCellar}
              onClick={sendStake}
            >
              Add to Cellar
            </Spaced>
            <Spaced
              type="primary"
              shape="round"
              disabled={
                data.bottle.inCellar && !data.bottle.spoiled ? false : true
              }
              onClick={sendWithdraw}
            >
              Withdraw from Cellar
            </Spaced>
            {data.bottle.spoiled && (
              <Spaced
                type="default"
                shape="round"
                disabled={BigNumber.from(data.bottle.rejuvenateCost).gt(
                  BigNumber.from(data.bottle.owner.vinegarBalance)
                )}
                onClick={sendRejuve}
              >
                Rejuvenate for{" "}
                {formatNum(formatEther(data.bottle.rejuvenateCost))} Vinegar
              </Spaced>
            )}
          </div>
        ) : (
          <Spaced
            type="default"
            shape="round"
            disabled={!data.bottle.canEnterCellar}
            onClick={sendApproveCellar}
          >
            Approve Cellar
          </Spaced>
        )
      ) : data.bottle.owner.id != ZERO_ADDRESS ? (
        <p>
          <GreyLink href={"/account/" + data.bottle.owner.id}>
            <>
              Owned by <a>{data.bottle.owner.id}</a>
            </>
          </GreyLink>
        </p>
      ) : null}
    </TokenPage>
  );
};

export default BottlePage;
