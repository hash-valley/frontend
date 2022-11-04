import { BigNumber, providers } from "ethers";

interface Addresses {
  [key: number]: {
    [key: string]: string | number;
  };
}

const addresses: Addresses = {
  420: {
    startBlock: 2383347,
    vine_address: "0x8610977AE603f75E159b343b49cEcaE600402a5e",
    cellar_address: "0x99Cff2A07D60Ea0C10022f606a485ccf94b5c364",
    bottle_address: "0x2e3512569d2168D759444776baCa8a3F12E86970",
    vinegar_address: "0xBdAfEA17b2fc7eB68245CEbd65BC83697464fBCA",
    giveaway_address: "0x5d1e6A1F191eeCAAfdAE311B6430b5C85132247B",
    address_storage_address: "0x0A92934af18b1FB1b7AE3930A54A21e7A86DF8de",
    royalty_address: "0x874B1C7E65DCaF2a945C69Ed4026AF876E7dC6D3",
    wine_uri_address: "0xe354e86f4Eb7F6a2393ec0b8009e73c2cbcE61dB",
    vine_uri_address: "0x50fC4517b40C9068977609DC7742a74dd6C74eC3",
    multi_address: "0x22692366d8D11716b4F91eF7989175Da416ff85A",
    sale_params_address: "0x5b4BfDEDf7c1e70B6eaE2665ce630FEC54950F16",
    alchemy_address: "0x783d098A97f9Ea091425DfAF0a6Ff18629d65c2E",
    grape_address: "0x3dfd190C62A4EB3dB61552732a96aF49c7d4E5Ff",
    spell_params_address: "0x9501e1463d2f185f7709Da0DB91Ab874b988D365",
    badge_address: "0xd17C105d513EB0783949Cc7E29ff5750A5fA125d",
  },
  10: {
    vine_address: "0xC13C5F3b5F850C48DB8Ef76E899e19F0A3D44201",
    cellar_address: "0x4107fa9cAA6ab4A8831dD09F79F748fC25BAbA4F",
    bottle_address: "0x557e6021e42fD3FBf62339B0Dd64b73b811CF21F",
    vinegar_address: "0xBeBa0d5660f50b99a49C483FB7bc270F06db6eEA",
    giveaway_address: "0x913343b78C3d337D47B94d88c2bBe0C9857b3001",
    address_storage_address: "0xE6f759A183fDFe9D7c4C924a6FB1AE40881Efc47",
    royalty_address: "0xF9eB3a3B87a7F0989FEBEdAADE67c5039b3C2334",
    merkle_address: "0x141aB80A99e855defE2a5728aDF0af70dD733D44",
    wine_uri_address: "0x391eB4ce8FA55187BA1a350523B8225c0cB650Fd",
    vine_uri_address: "0x655046Ba63e2a6Fc4f975a2b9D4bCb7EA7749F56",
    multi_address: "0x5Ed66afD0428F2F8D7045Cb6DFFc5420319816B9",
  },
  31337: {
    startBlock: 1,
    vine_address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    cellar_address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    bottle_address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    vinegar_address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    giveaway_address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    address_storage_address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    royalty_address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    wine_uri_address: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    vine_uri_address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    multi_address: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    sale_params_address: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    alchemy_address: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
    grape_address: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    spell_params_address: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    badge_address: "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d",
  },
};

export const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "";
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) ?? 31337;
export const providerUrl = process.env.NEXT_PUBLIC_PROVIDER_URL ?? "";
export const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "";
export const ipfs_gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "";
export const walletConnectKey = process.env.NEXT_PUBLIC_WALLET_CONNECT ?? "";

export const VineyardAddress = addresses[chainId].vine_address;
export const CellarAddress = addresses[chainId].cellar_address;
export const BottleAddress = addresses[chainId].bottle_address;
export const VinegarAddress = addresses[chainId].vinegar_address;
export const GiveawayAddress = addresses[chainId].giveaway_address;
export const WineUriAddress = addresses[chainId].wine_uri_address;
export const VineUriAddress = addresses[chainId].vine_uri_address;
export const MulticallAddress = addresses[chainId].multi_address;
export const AlchemyAddress = addresses[chainId].alchemy_address;
export const GrapeAddress = addresses[chainId].grape_address;

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
