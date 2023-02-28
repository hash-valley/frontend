import { BigNumber, constants, providers } from "ethers";

interface Addresses {
  [key: number]: {
    [key: string]: string;
  };
}

const addresses: Addresses = {
  420: {
    vine_address: "0xDC093997dfe9df6C06CB92F0b4036125974aec59",
    cellar_address: "0x2e124d69959B1E70794F6b8A33b9aF9cA03E9F5b",
    bottle_address: "0xfD4155FF539CEACe09520Cb4Ef791aE5994fA4ff",
    vinegar_address: "0x9AF994899d6E8b095A9152AEB8C77483Fa0d44c9",
    giveaway_address: "0x4a35beeB9c31de539c8c4D59EfEECc90274bC69c",
    address_storage_address: "0x3A392655d2ed428e179c264EAa7E228d7905663E",
    royalty_address: "0xaa647ed90a0E9951ecA0C8C9D8351A2686aEce47",
    wine_uri_address: "0x970b2847455B769507ecA9Fcab75C8F2146f9f41",
    vine_uri_address: "0x3BA1E088db91F9982F6F80e26Fd53fa5D81bb41F",
    multi_address: "0x95f7cBe39777425468438aa26856B35738B0d1D8",
    sale_params_address: "0xC6cE3FdA80fC6EB3d15d2FC274129eA151877437",
    alchemy_address: "0x230192D5C28560B70999F536982995d15fa8a8Da",
    grape_address: "0xD7378ffCD1c5eA076c82eE46ebcd0f7892db4344",
    spell_params_address: "0xF56f55f4C41b9d2A0019D7100420112CB31b1a4B",
    badge_address: "0x6687702E686D4DD1E51194B166c75954cfCD02d2",
  },
  10: {
    vine_address: "0xE55A395d98dAd2D4B0F1C1186dE828EeD9a4F5AB",
    cellar_address: "0xd2f570F0bd8AC97D153fCf7B3BDe646A74c99f0d",
    bottle_address: "0x94b9977d46b3c09923E8B73e5DECfc873009EffA",
    vinegar_address: "0x7439039Db38380357a4eFDF6cBD6193F53fEA287",
    giveaway_address: "0xB7261f780b779D881f6742437499b1c59c2bFfb5",
    address_storage_address: "0xC90e001D24Fc128f94A42a34b655A9DDA50699D7",
    royalty_address: "0x1dA535492b761630aA15248eB93a8875D8E9Cc59",
    wine_uri_address: "0x013299CC6Fd6149E6ee8E5610001dFe31212b8e3",
    vine_uri_address: "0x5E24e6Bf81208646cd24648423270C521cA337d1",
    multi_address: "0xbF386d8f4B2A045Fe8A5cd670e58A52A01af5fF3",
    sale_params_address: "0x0685B1770F8A48CA1812AB68F627cBF23e7c5bEa",
    alchemy_address: "0x792fB90718Af95777856C3EF6F24e97e4436EdD2",
    grape_address: "0x22E9E9Ba27A80054dF01A12CeAFc4f4699360eAA",
    spell_params_address: "0xdb546Cb703A8aBbE8b98155b9E56Dd0e69C37426",
    badge_address: "0xDc4096412eE81e9552F1798f4a09C73290cBEAdc",
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

export const getMessage = () => messages[Math.floor(Math.random() * messages.length)];
