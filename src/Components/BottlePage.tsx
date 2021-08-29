import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useParams } from "react-router-dom";
import { Menu, Button } from 'elementz';
import { bottleAge, isCellarApproved, approveCellar, rejuvenate, historicalUri } from "../Utils/bottleContract";
import { stake, withdraw } from "../Utils/cellarContract";
import { useQuery } from '@apollo/client';
import { BOTTLE_QUERY } from "../Utils/queries"
import { Page, Spaced, GreyLink, TokenFrame, CenteredSelect } from "../Styles/Components"
import { ZERO_ADDRESS } from "../Utils/constants";
import { secondsToString, getBottleEra, getBottleType, BottleType } from "../Utils/utils"
import { ipfs_gateway, bottleImage } from "../Utils/constants"
import { useBottleVersions } from "../Hooks/useUriVersions"

const BottlePage = () => {
  const wallet = useWallet();
  const { id } = useParams();
  const uriVersions = useBottleVersions();
  const [uriVersion, setUriVersion] = useState(0)
  const [age, setAge] = useState("0")
  const [isApproved, setIsApproved] = useState(false)
  const [nullData, setNullData] = useState(true)
  const [bottleType, setBottleType] = useState<BottleType>(
    {
      type: "",
      subtype: "",
      note: "",
      name: ""
    }
  )
  const [imageUri, setImageUri] = useState("")

  const { loading, error, data, refetch } = useQuery(BOTTLE_QUERY, { variables: { id: "0x" + id.toString() } })

  const changeImage = async (n: number) => {
    if (!loading) {
      let uri = await historicalUri(n)
      uri = ipfs_gateway + uri + "/?seed=" + "3000" + "-" + 127000000000000000
      setUriVersion(n)
      setImageUri(uri)
    }
  }

  useEffect(() => {
    changeImage(uriVersions[uriVersions.length - 1])
  }, [uriVersions]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (data.bottle) {
        setIsApproved(await isCellarApproved(data.bottle.owner.id))

        let fetchedAge = await bottleAge(parseInt(id))
        setAge(fetchedAge)
        setNullData(false)
        setBottleType(getBottleType(data.bottle.attributes))
      }
    };
    if (!loading && !error) fetchBalance()
  }, [loading]);

  useEffect(() => {
    refetch()
  }, [wallet, id]);

  return (
    loading ?
      <Page>
        <h3>Bottle: {id}</h3>
        <br />
        <h4><i>Loading...</i></h4>
      </Page> :
      nullData ?
        <Page>
          <h3>Bottle {id}</h3>
          <br />
          <h4>Bottle not found</h4>
        </Page> :
        <Page>
          <h3>Bottle: {id}</h3>
          <br />
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
          <div><b>Age:</b> {secondsToString(age)}</div>
          <div><b>Era:</b> {getBottleEra(age)}</div>
          <br />
          <div><b>Raw Attributes:</b> {data.bottle.attributes}</div>
          <div><b>Type:</b> {bottleType.type}</div>
          <div><b>Subtype:</b> {bottleType.subtype}</div>
          <div><b>Notes:</b> {bottleType.note}</div>
          <div><b>Name:</b> {bottleType.name}</div>
          {
            data.bottle.inCellar && <div>Aging in cellar</div>
          }
          {
            !data.bottle.inCellar && !data.bottle.canEnterCellar && <div>Already aged in cellar</div>
          }
          {
            data.bottle.spoiled && <div>Spoiled to vinegar</div>
          }
          <br />
          {
            data.bottle.rejuvenatedTo &&
            <div>
              Burnt to revive <GreyLink to={"/bottle/" + parseInt(data.bottle.rejuvenatedTo.id).toString()}>Bottle #{parseInt(data.bottle.rejuvenatedTo.id)}</GreyLink>
            </div>
          }
          {
            data.bottle.rejuvenatedFrom &&
            <div>
              Rejuvenated from <GreyLink to={"/bottle/" + parseInt(data.bottle.rejuvenatedFrom.id).toString()}>Bottle #{parseInt(data.bottle.rejuvenatedFrom.id)}</GreyLink>
            </div>
          }
          {
            data.bottle.from &&
            <div>
              Harvested from <GreyLink to={"/vineyard/" + parseInt(data.bottle.from.id).toString()}>Vineyard #{parseInt(data.bottle.from.id)}</GreyLink>
            </div>
          }
          <br />

          {
            wallet.account?.toLowerCase() === data.bottle.owner.id ?
              (isApproved ?
                <div>
                  <Spaced disabled={data.bottle.canEnterCellar ? "" : "disabled"} onClick={() => stake(wallet, id)}>
                    Add to Cellar
                  </Spaced>
                  <Spaced disabled={data.bottle.inCellar && !data.bottle.spoiled ? "" : "disabled"} onClick={() => withdraw(wallet, id)}>
                    Withdraw from Cellar
                  </Spaced>
                  {
                    data.bottle.spoiled &&
                    <Spaced disabled={BigInt(data.bottle.rejuvenateCost) <= BigInt(data.bottle.owner.vinegarBalance) ? "" : "disabled"} onClick={() => rejuvenate(wallet, id)}>
                      Rejuvenate for {data.bottle.rejuvenateCost} Vinegar
                    </Spaced>
                  }
                </div> :
                <Spaced disabled={data.bottle.canEnterCellar ? "" : "disabled"} onClick={() => approveCellar(wallet)}>
                  Approve Cellar
                </Spaced>)
              : data.bottle.owner.id != ZERO_ADDRESS ? <p>Owned by {data.bottle.owner.id}</p> : null
          }
        </Page>
  );
};

export default BottlePage;
