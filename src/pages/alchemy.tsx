import { useQuery } from "@apollo/client";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useSigner } from "wagmi";
import { CenteredSelect, Page } from "../Styles/Components";
import { castSpell } from "../Utils/alchemyContract";
import { locations, soilTypes } from "../Utils/attributes";
import { SPELL } from "../Utils/constants";
import {
  ALCHEMY_DEFENSE_QUERY,
  ALCHEMY_VITALIZE_QUERY,
  ALCHEMY_WITHER_QUERY,
} from "../Utils/queries";
import { toDate } from "../Utils/utils";

const getQuery = (spell: SPELL) => {
  switch (spell) {
    case SPELL.WITHER:
      return ALCHEMY_WITHER_QUERY;
    case SPELL.DEFEND:
      return ALCHEMY_DEFENSE_QUERY;
    case SPELL.VITALIZE:
      return ALCHEMY_VITALIZE_QUERY;
    default:
      return ALCHEMY_VITALIZE_QUERY;
  }
};

const helpText = (spell: SPELL) => {
  switch (spell) {
    case SPELL.WITHER:
      return "Targeted vineyard will die for this season in 8-16 hours. Costs Vinegar";
    case SPELL.DEFEND:
      return "Block a withering spell that has been cast on a vineyard. Costs Grapes";
    case SPELL.VITALIZE:
      return "Increase the xp gain for a planted vineyard if it completes a successful harvest. Must be cast during planting season. Costs Grapes";
    default:
      return "Select a spell";
  }
};

const spellName = (spell: SPELL) => {
  switch (spell) {
    case SPELL.WITHER:
      return "Wither";
    case SPELL.DEFEND:
      return "Defend";
    case SPELL.VITALIZE:
      return "Vitalize";
  }
};

const Alchemy = () => {
  const [spell, setSpell] = useState<SPELL>(SPELL.WITHER);
  const [time, setTime] = useState<number>(0);
  const { address, status } = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();

  const { loading, error, data, refetch } = useQuery(getQuery(spell), {
    variables: { address: address?.toLowerCase(), timestamp: time },
  });

  useEffect(() => setTime(Date.now()), [spell]);

  const cast = async (target: number) => {
    const tx = await castSpell(signer, target, spell);
    addRecentTransaction({
      hash: tx.hash,
      description: `Cast ${spellName(spell)} on ${target}`,
    });
    await tx.wait();
    toast.success("Success!");
  };

  if (process.env.NEXT_PUBLIC_ALCHEMY_ON == "false") {
    return (
      <Page>
        <h2>Available Soon...</h2>
      </Page>
    );
  }

  return (
    <Page>
      <h2>Resources</h2>
      <div>
        <b>Grapes:</b> {data?.account?.grapeBalance ?? 0}
      </div>
      <div>
        <b>Vinegar:</b> {data?.account?.vinegarBalance ?? 0}
      </div>
      <br />

      <h2>Select a Spell</h2>
      <CenteredSelect value={spell} onChange={(event: any) => setSpell(event)}>
        <Select.Option key={0} value={SPELL.WITHER}>
          Wither
        </Select.Option>
        <Select.Option key={1} value={SPELL.DEFEND}>
          Defend
        </Select.Option>
        <Select.Option key={2} value={SPELL.VITALIZE}>
          Vitalize
        </Select.Option>
      </CenteredSelect>
      <br />
      <i>{helpText(spell)}</i>
      <br />
      <br />

      {data?.vineyards.map((v: any) => (
        <div key={v.tokenId}>
          <div><b>ID:</b> {v.tokenId}</div>
          {v.witherDeadline && (
            <div>Withers at: {toDate(v.witherDeadline)}</div>
          )}
          <div>
            <b>Location:</b> {locations[v.location].name}
          </div>
          <div>
            <b>Climate:</b> {locations[v.location].climate.name}
          </div>
          <div>
            <b>Elevation:</b> {v.elevation}
          </div>
          <div>
            <b>Soil:</b> {soilTypes[v.soil].name}
          </div>
          <div>
            <b>XP:</b> {v.xp}
          </div>
          <br/>
          <Button
            type="primary"
            shape="round"
            onClick={() => cast(Number(v.tokenId))}
          >
            Cast
          </Button>
          <hr />
        </div>
      ))}
    </Page>
  );
};

export default Alchemy;
