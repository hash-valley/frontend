import { BigNumber, constants, providers } from "ethers";

interface Addresses {
  [key: number]: {
    [key: string]: string;
  };
}

const addresses: Addresses = {
  420: {
    vine_address: "0x787cf97BC7600197fAA76F6ce27fAAFaC03B6e53",
    cellar_address: "0xb890978304b10f90C65D16cA1f51ef0a743C9350",
    bottle_address: "0xe914dB179b544fb59aEBaE78890Cf70a61eC9112",
    vinegar_address: "0x181C004fCCA6799fb276F0F869686d59Bd930E9a",
    giveaway_address: "0xB608F7878362842E7dA028DA7f6768B42dAc5d65",
    address_storage_address: "0x9FCF1958C38c7F804C66CB6848D1A7695D58F958",
    royalty_address: "0x19b7594AF1003735ae8e4F8B72d7ae345FC251D8",
    wine_uri_address: "0xF0Cae60b01d03975Fe9A43C65a205388bC257Bc5",
    vine_uri_address: "0xB082f4541af46d9b17ABfC56e01a2d1e34b8B636",
    multi_address: "0x69C4B2E3c4a27D1D9BCf9CDBFE01B2074Bb10fBe",
    sale_params_address: "0xeF0ddC59E8fb70b0f3623C8f1bc1Cf0C62a6Fb9F",
    alchemy_address: "0x03C48D18159883Be5B1EE5DaD028cEf6507256E2",
    grape_address: "0xa09A0FbE8906C6A0C0084f0b1DA480276a146a10",
    spell_params_address: "0x1bC736B3c942253c744FED045e2d7e933a0F0b97",
    badge_address: "0xc7Ac436bcC5Ba39c8Ce4ACE718a66455a351B22e",
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

export const ZERO_ADDRESS = constants.AddressZero;

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
