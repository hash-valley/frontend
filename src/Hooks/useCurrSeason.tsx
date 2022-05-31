import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { day } from "../Utils/constants";
import { VINEPROTOCOL_QUERY } from "../Utils/queries";
import { currentSeason } from "../Utils/vineyardContract";

export const useCurrSeason = () => {
  const [season, setSeason] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [fetched, setFetched] = useState(false);

  const { loading, data } = useQuery(VINEPROTOCOL_QUERY);

  const sDays = (season: number, start: number) => {
    const now = Date.now() / 1000;
    if (season == 0) return 0;
    if (season == 1) return 21 - (now - start) / day;
    else return 84 - (now - start - 21 * day - (season - 1) * 84 * day) / day;
  };

  useEffect(() => {
    const fetchSeason = async () => {
      let s = await currentSeason();
      setSeason(s);
      setDaysLeft(sDays(s, data.vineProtocol.startTime));
      setFetched(true);
    };
    if (!loading) fetchSeason();
  }, [loading]);

  if (fetched)
    return {
      season,
      daysLeft: Math.ceil(daysLeft),
      plant: (season === 1 && daysLeft > 14) || daysLeft > 77,
      harvest: daysLeft < 7,
      ...data?.vineProtocol,
    };
  return { season };
};
