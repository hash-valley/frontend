import { JsonRpcProvider } from "@ethersproject/providers";
import { bottleEras, bottleTypes } from "./attributes";
import { DAY } from "./constants";

const mainnetProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_RPC);

export const getEns = async (address: string): Promise<string | null> =>
  await mainnetProvider.lookupAddress(address);

export const formatNum = (num: string, decimals: number = 3) => {
  const decimal = num.indexOf(".");
  return num.substring(0, decimal + decimals);
};

export const secondsToString = (seconds: string): string => {
  let bigSeconds = BigInt(seconds);
  const years = bigSeconds / BigInt(31536000);
  if (years > 0) {
    bigSeconds %= years;
  }
  const days = bigSeconds / BigInt(86400);
  if (days > 0) {
    bigSeconds %= days;
  }
  const hours = bigSeconds / BigInt(3600);
  return `${years} years, ${days} days, ${hours} hours`;
};

export const hours = (time: number): string => `${Math.floor(time / 3600)}`;

export const minutes = (time: number): string => {
  const num = Math.floor(time / 60) % 60;
  return num < 10 ? `0${num}` : `${num}`;
};

export const seconds = (time: number): string => {
  const num = time % 60;
  return num < 10 ? `0${num}` : `${num}`;
};

export const getBottleEra = (bottleAge: string | number) => {
  let bigAge = BigInt(bottleAge);
  for (let i = 0; i < bottleEras.length; ++i) {
    let range = bottleEras[i].range;
    if (range[0] <= bigAge && bigAge < range[1]) {
      return bottleEras[i].name;
    }
  }
};

export const chanceOfSpoil = (stakedDays: number) => {
  let chance;
  if (stakedDays < 360) {
    chance = 5 + Math.floor((365 - stakedDays) / 38) ** 2;
  } else {
    chance = 5;
  }
  return 100 - chance;
};

// age in seconds
export const ageOnRemove = (cellarTime: number): BigInt => {
  if (cellarTime <= 360 * DAY) {
    const months = Math.floor(cellarTime / DAY / 30);
    const monthTime = cellarTime - months * 30 * DAY;
    const eraTime = bottleEras[months].range[1] - bottleEras[months].range[0];
    const monthFraction = (BigInt(monthTime) * eraTime) / BigInt(30 * DAY);
    return bottleEras[months].range[0] + BigInt(monthFraction);
  }
  return bottleEras[12].range[1];
};

export const toDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toUTCString();
};

export interface BottleType {
  type: string;
  subtype: string;
  note: string;
  name: string;
}

export const getBottleType = (attributes: number[]): BottleType => {
  const type = attributes[0];
  const subtype = attributes[1];
  const note = attributes[2];
  const name = attributes[3];

  return {
    type: bottleTypes[type].name,
    subtype: bottleTypes[type].subtypes[subtype].name,
    note: bottleTypes[type].subtypes[subtype].notes[note].name,
    name: bottleTypes[type].subtypes[subtype].notes[note].type[name],
  };
};

export const getBottleClass = (attributes: number[]): string => {
  const type = attributes[0];
  return bottleTypes[type].name;
};

export const getBottleName = (attributes: number[]): string => {
  const type = attributes[0];
  const subtype = attributes[1];
  const note = attributes[2];
  const name = attributes[3];
  return bottleTypes[type].subtypes[subtype].notes[note].type[name];
};
