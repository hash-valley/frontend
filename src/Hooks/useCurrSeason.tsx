import { useEffect, useState } from "react";
import {
  currentSeason
} from "../Utils/vineyardContract"

export const useCurrSeason = () => {
  const [season, setSeason] = useState(0)

  useEffect(() => {
    const fetchSeason = async () => {
      setSeason(await currentSeason())
    }
    fetchSeason();
  }, []);

  return season
}