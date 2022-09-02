import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { DAY } from "../Utils/constants";
import { VINEPROTOCOL_QUERY } from "../Utils/queries";
import { currentSeason } from "../Utils/vineyardContract";

const FIRST_SEASON_DAYS = 21;
const SEASON_DAYS = 84;

export const useCurrSeason = () => {
  const [season, setSeason] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [fetched, setFetched] = useState(false);

  const { loading, data, refetch } = useQuery(VINEPROTOCOL_QUERY);

  const sDays = (season: number, start: number) => {
    const now = Date.now() / 1000;
    if (season == 0) return 0;
    if (season == 1) return 21 - (now - start) / DAY;
    else {
      const totalGameDays = (now - start) / DAY;
      const prevSeasonDays = FIRST_SEASON_DAYS + (season - 2) * SEASON_DAYS;
      return SEASON_DAYS - (totalGameDays - prevSeasonDays);
    }
  };

  const update = () => refetch().then(() => fetchSeason());

  const fetchSeason = async () => {
    let s = await currentSeason();
    setSeason(s);
    setDaysLeft(sDays(s, data?.vineProtocol.startTime));
    setFetched(true);
  };

  useEffect(() => {
    if (!loading) fetchSeason();
  }, [loading]);

  if (fetched)
    return {
      update,
      season,
      daysLeft: Math.ceil(daysLeft),
      plant: (season === 1 && daysLeft > 14) || daysLeft > 77,
      harvest: data.vineProtocol.gameStarted && daysLeft < 7,
      ...data?.vineProtocol,
    };
  return { season, update };
};
