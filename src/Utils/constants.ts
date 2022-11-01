import { BigNumber, providers } from "ethers";

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

export const DECIMALS = BigNumber.from("1000000000000000000");

export enum SPELL {
  WITHER,
  DEFEND,
  VITALIZE,
}

const messages = [
  "That'll be right along",
  "Very good sir",
  "Just a moment",
  "Pip pip",
  "Yes, quite",
  "Drinking wine is like using magic: there's always a price to pay",
  "A $100 bottle of wine can taste as awful as a $2 bottle, and the opposite is true, as well",
  "A bottle should sit on your dinner table like all of the other condiments",
  "No nation is drunken where wine is cheap",
  "Customers should complain more",
  "Give a man a bottle of wine, he drinks for a day. Teach a man to make wine, he'll always have lots of friends",
  "Great wine requires a mad man to grow the vine, a wise man to watch over it, a lucid poet to make it, and a lover to drink it",
  "Be careful to trust a person who does not like wine",
  "Too much of anything is bad, but too much good whiskey is barely enough",
  "Have ye tippled drink more fine Than mine host's Canary wine?",
  "...old wood best to burn, old wine to drink...",
  "One should always be drunk. That's all that matters...",
  "Wine is the most healthful and most hygienic of beverages",
  "Don't you hate people who drink white wine?",
  "I like to start off my day with a glass of champagne",
  "Wine is the drink of the gods...and water the drink of beasts",
  "When the wine is in, the wit is out",
];

export const getMessage = () =>
  messages[Math.floor(Math.random() * messages.length)];
