import { useQuery } from "@apollo/client";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { Button, Select } from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { ModalContext } from "../Hooks/ModalProvider";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import {
  AlchemyBack,
  CenteredSelect,
  Page,
  ListItem,
} from "../Styles/Components";
import { castSpell } from "../Utils/alchemyContract";
import { locations, soilTypes } from "../Utils/attributes";
import { DAY, FIRST_SEASON_DAYS, SEASON_DAYS, SPELL } from "../Utils/constants";
import {
  ALCHEMY_DEFENSE_QUERY,
  ALCHEMY_VITALIZE_QUERY,
  ALCHEMY_WITHER_QUERY,
} from "../Utils/queries";
import { formatNum, toDate } from "../Utils/utils";

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
      return "Double xp gain for a planted vineyard if it completes a successful harvest. Must be cast during planting season. Costs Grapes";
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

const FIRST_SEASON_TIME = FIRST_SEASON_DAYS * DAY;
const SEASON_TIME = SEASON_DAYS * DAY;

const percentSeason = (season: number, start: number, now: number) => {
  const totalGameTime = now - start;
  if (season == 0) return 0;
  if (season == 1) return totalGameTime / FIRST_SEASON_TIME;
  else {
    const prevSeasonTime = FIRST_SEASON_TIME + (season - 2) * SEASON_TIME;
    return (totalGameTime - prevSeasonTime) / SEASON_TIME;
  }
};

const Alchemy = () => {
  const [spell, setSpell] = useState<SPELL>(SPELL.WITHER);
  const [time, setTime] = useState<number>(0);
  const { address, status } = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();
  const protocol = useCurrSeason();

  const { loading, error, data, refetch } = useQuery(getQuery(spell), {
    variables: { address: address?.toLowerCase(), timestamp: time.toString() },
  });

  useEffect(() => setTime(Math.floor(Date.now() / 1000)), [spell]);
  const { openModal, closeModal }: any = useContext(ModalContext);

  const cast = async (target: number) => {
    const tx = await castSpell(signer, target, spell);
    addRecentTransaction({
      hash: tx.hash,
      description: `Cast ${spellName(spell)} on ${target}`,
    });
    openModal()
    await tx.wait()
    closeModal()
  };

  const spellCost = (target: number) => {
    switch (spell) {
      case SPELL.WITHER:
        return (
          5000 +
          (1 -
            percentSeason(protocol.season, Number(protocol.startTime), time)) *
            15000
        );
      case SPELL.DEFEND:
        return 2000;
      case SPELL.VITALIZE:
        return 1660;
    }
  };

  const isDisabled = (target: number) => {
    const cost = parseEther(spellCost(target).toString());
    switch (spell) {
      case SPELL.WITHER:
        return BigNumber.from(data?.account?.vinegarBalance ?? 0).lt(cost);
      case SPELL.DEFEND:
        return BigNumber.from(data?.account?.grapeBalance ?? 0).lt(cost);
      case SPELL.VITALIZE:
        return BigNumber.from(data?.account?.grapeBalance ?? 0).lt(cost);
    }
  };

  const spellCostString = (target: number) => {
    switch (spell) {
      case SPELL.WITHER:
        return `${spellCost(target)} $VINEGAR`;
      case SPELL.DEFEND:
        return `${spellCost(target)} $GRAPE`;
      case SPELL.VITALIZE:
        return `${spellCost(target)} $GRAPE`;
    }
  };

  if (protocol.season === 0) {
    return (
      <>
        <AlchemyBack />
        <Page color="white" shadow="black">
          <h2 style={{ color: "white" }}>Available Soon...</h2>
        </Page>
      </>
    );
  }

  return (
    <>
      <AlchemyBack />
      <Page color="white" shadow="black">
        <h2 style={{ color: "white" }}>
          You own {formatNum(formatEther(data?.account?.vinegarBalance ?? 0))}{" "}
          Vinegar and {formatNum(formatEther(data?.account?.grapeBalance ?? 0))}{" "}
          Grapes
        </h2>
        <br />

        <h2 style={{ color: "white" }}>Select a Spell</h2>
        <CenteredSelect
          value={spell}
          onChange={(event: any) => setSpell(event)}
        >
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

        {data?.vineyards.map((v: any, index: number) => (
          <ListItem key={v.tokenId}>
            <div>
              <b>Vineyard ID:</b> {v.tokenId}
            </div>
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
            <br />
            <Button
              type="primary"
              shape="round"
              onClick={() => cast(Number(v.tokenId))}
              disabled={isDisabled(Number(v.tokenId))}
            >
              Cast for {spellCostString(Number(v.tokenId))}
            </Button>
            <br /> <br />
            {index < data?.vineyards.length - 1 && <hr />}
          </ListItem>
        ))}
      </Page>
    </>
  );
};

export default Alchemy;
