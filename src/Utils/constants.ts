import { providers } from "ethers";

export const VineyardAddress = process.env.NEXT_PUBLIC_VINE_ADDRESS ?? "";
export const CellarAddress = process.env.NEXT_PUBLIC_CELLAR_ADDRESS ?? "";
export const BottleAddress = process.env.NEXT_PUBLIC_BOTTLE_ADDRESS ?? "";
export const VinegarAddress = process.env.NEXT_PUBLIC_VINEGAR_ADDRESS ?? "";
export const GiveawayAddress = process.env.NEXT_PUBLIC_GIVEAWAY_ADDRESS ?? "";
export const WineUriAddress = process.env.NEXT_PUBLIC_WINE_URI ?? "";
export const VineUriAddress = process.env.NEXT_PUBLIC_VINE_URI ?? "";

export const MulticallAddress = process.env.NEXT_PUBLIC_MULTI ?? "";

export const AlchemyAddress = process.env.NEXT_PUBLIC_ALCHEMY_ADDRESS ?? "";
export const GrapeAddress = process.env.NEXT_PUBLIC_GRAPE_ADDRESS ?? "";

export const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "";
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) ?? 31337;
export const providerUrl = process.env.NEXT_PUBLIC_PROVIDER_URL ?? "";
export const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "";
export const ipfs_gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "";
export const walletConnectKey = process.env.NEXT_PUBLIC_WALLET_CONNECT ?? "";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const viewProvider = new providers.JsonRpcProvider(providerUrl);

export const DAY = 24 * 60 * 60;
export const YEAR = BigInt(365 * DAY);

export const FIRST_SEASON_DAYS = 21;
export const SEASON_DAYS = 84;

export enum SPELL {
  WITHER,
  DEFEND,
  VITALIZE,
}
