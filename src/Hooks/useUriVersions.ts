import { useEffect, useState } from "react";
import { latestUriVersion as latestVineUri } from "../Utils/vineyardContract";
import { latestUriVersion as latestBottleUri } from "../Utils/bottleContract";

export const useVineVersions = () => {
  const [options, setOptions] = useState([0]);

  useEffect(() => {
    const fetch = async () => {
      const latest = Number(await latestVineUri());
      setOptions(Array.from(Array(latest).keys()));
    };
    fetch();
  }, []);

  return options;
};

export const useBottleVersions = () => {
  const [options, setOptions] = useState([0]);

  useEffect(() => {
    const fetch = async () => {
      const latest = Number(await latestBottleUri());
      setOptions(Array.from(Array(latest).keys()));
    };
    fetch();
  }, []);

  return options;
};
