import { providers, Contract, utils } from "ethers";
import { VineyardAddress, providerUrl, ipfs_gateway } from "./constants";
import { toast } from "react-toastify";
import { locations, soilTypes } from "./utils";

const VineyardABI = [
  "function newVineyards(uint16[] calldata) public payable",
  "function newVineyardGiveaway(uint16[] calldata) public",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256 balance)",
  "function totalSupply() view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId)",
  "function getTokenAttributes(uint _tokenId) public view returns(uint16[] memory attributes)",
  "function xp(uint _tokenID) public view returns(uint)",
  "function plant(uint _tokenID) public",
  "function harvest(uint _tokenID) public",
  "function water(uint _tokenID) public",
  "function plantMultiple(uint256[] calldata _tokenIds) public",
  "function harvestMultiple(uint256[] calldata _tokenIds) public",
  "function waterMultiple(uint256[] calldata _tokenIds) public",
  "function canWater(uint _tokenId) public view returns(bool)",
  "function canPlant(uint _tokenId) public view returns(bool)",
  "function canHarvest(uint _tokenId) public view returns(bool)",
  "function ownerOf(uint256 tokenId) external view returns (address owner)",
  "function currSeason() public view returns (uint256)",
  "function maxVineyards() public view returns (uint256)",
  "function minWaterTime(uint256 _tokenId) public view returns (uint256)",
  "function watered(uint256 _tokenId) public view returns (uint256)",
  "function waterWindow(uint256 _tokenId) public view returns (uint256)",
  "function currentStreak(uint256 _tokenId) public view returns (uint16)",
  "function imgVersionCount() public view returns (uint256)",
  "function imgVersions(uint256 id) public view returns (string)",
  "function suggest(uint256 _tokenId, string calldata _newUri, address _artist) public",
  "function support(uint256 _tokenId) public",
  "function retort(uint256 _tokenId) public",
  "function complete() public",
  "function buySprinkler(uint256 _tokenId) public payable",
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);

const withSigner = (wallet: any) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  return VineyardContract.connect(signer);
};

export const viewVineyardContract = new Contract(
  VineyardAddress,
  VineyardABI,
  viewProvider
);

export interface TokenParams {
  id: number;
  location: number;
  elevation: number;
  soil: number;
  xp: number;
  streak: number;
}

export interface Farmable {
  canWater: boolean;
  canPlant: boolean;
  canHarvest: boolean;
}

export const maxVineyards = async (): Promise<number> => {
  const maxVineyards = await viewVineyardContract.maxVineyards();
  return parseInt(maxVineyards.toString());
};

export const totalSupply = async (): Promise<number> => {
  const totalSupply = await viewVineyardContract.totalSupply();
  return parseInt(totalSupply.toString());
};

export const currentSeason = async (): Promise<number> => {
  const currSeason = await viewVineyardContract.currSeason();
  return parseInt(currSeason.toNumber());
};

export const latestUriVersion = async () => {
  return await viewVineyardContract.imgVersionCount();
};

export const historicalUri = async (n: number): Promise<string> => {
  return await viewVineyardContract.imgVersions(n);
};

export const historicalUriIpfs = async (n: number): Promise<string> => {
  return ipfs_gateway + (await historicalUri(n)).substring(7);
};

/**
 *
 * @param params [location, elevation, elevationIsNegative, soil]
 */
export const newVineyards = async (params: number[], wallet: any) => {
  const vineyardWithSigner = withSigner(wallet);
  let negative: number = 0;
  if (params[1] < 0) negative = 1;
  const processedParams: number[] = [
    params[0],
    Math.abs(params[1]),
    negative,
    params[2],
  ];
  const supply = await totalSupply();
  let tx;
  if (supply < 100) {
    try {
      toast.info("Sending...");
      tx = await vineyardWithSigner.newVineyards(processedParams);
      toast.success("Success!");
      return tx;
    } catch (err: any) {
      console.error(err);
      toast.error(`Error! ${err?.message}`);
    }
  } else {
    try {
      toast.info("Sending...");
      tx = await vineyardWithSigner.newVineyards(processedParams, {
        value: utils.parseEther("0.05"),
      });
      toast.success("Success!");
      return tx;
    } catch (err: any) {
      console.error(err);
      toast.error(`Error! ${err?.message}`);
    }
  }
};

export const newVineyardsGiveaway = async (params: number[], wallet: any) => {
  const vineyardWithSigner = withSigner(wallet);
  let negative: number = 0;
  if (params[1] < 0) negative = 1;
  const processedParams: number[] = [
    params[0],
    Math.abs(params[1]),
    negative,
    params[2],
  ];

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.newVineyardGiveaway(processedParams);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const userBalance = async (userAddress: string) => {
  const balance = await viewVineyardContract.balanceOf(userAddress);
  return parseInt(balance.toString());
};

export const getStreak = async (tokenId: number): Promise<number> => {
  const streak = await viewVineyardContract.currentStreak(tokenId);
  return streak;
};

export const fetchTokenParams = async (
  tokenId: number
): Promise<TokenParams> => {
  const xp = await viewVineyardContract.xp(tokenId);
  const streak = await viewVineyardContract.currentStreak(tokenId);
  const params = await viewVineyardContract.getTokenAttributes(tokenId);
  let elevation = params[1].toNumber();
  if (params[2].eq(1)) elevation *= -1;
  return {
    id: tokenId,
    location: params[0].toNumber(),
    elevation,
    soil: params[3].toNumber(),
    xp: xp.toNumber(),
    streak: streak.toNumber(),
  };
};

export const fetchTokenFarmingStats = async (tokenId: number) => {
  return {
    canWater: await viewVineyardContract.canWater(tokenId),
    canPlant: await viewVineyardContract.canPlant(tokenId),
    canHarvest: await viewVineyardContract.canHarvest(tokenId),
  };
};

export const tokenOwner = async (tokenId: number) => {
  return await viewVineyardContract.ownerOf(tokenId);
};

export const tokenIdsByOwner = async (userAddress: string) => {
  const balance = await userBalance(userAddress);
  let tokenIds: TokenParams[] = [];
  let farmables: Farmable[] = [];
  for (let i = 0; i < balance; i++) {
    const id = await viewVineyardContract.tokenOfOwnerByIndex(userAddress, i);
    tokenIds.push(await fetchTokenParams(id.toNumber()));
    farmables.push(await fetchTokenFarmingStats(id.toNumber()));
  }
  return {
    tokenIds,
    farmables,
  };
};

export const untilCanWater = async (tokenId: number): Promise<number> => {
  const [minTime, watered] = await Promise.all([
    viewVineyardContract.minWaterTime(tokenId),
    viewVineyardContract.watered(tokenId),
  ]);
  const now = Math.floor(Date.now() / 1000);
  return Number(watered) + Number(minTime) - now;
};

export const canWaterUntil = async (tokenId: number): Promise<number> => {
  const [minTime, watered, waterWindow] = await Promise.all([
    viewVineyardContract.minWaterTime(tokenId),
    viewVineyardContract.watered(tokenId),
    viewVineyardContract.waterWindow(tokenId),
  ]);
  const now = Math.floor(Date.now() / 1000);
  return Number(watered) + Number(minTime) + Number(waterWindow) - now;
};

export const water = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.water(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const plant = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.plant(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const harvest = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.harvest(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const plantMultiple = async (
  wallet: any,
  tokenIds: number[] | string[]
) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.plantMultiple(tokenIds);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const waterMultiple = async (
  wallet: any,
  tokenIds: number[] | string[]
) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.waterMultiple(tokenIds);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const harvestMultiple = async (
  wallet: any,
  tokenIds: number[] | string[]
) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.harvestMultiple(tokenIds);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const vineProposal = async (
  wallet: any,
  tokenId: number,
  uri: string,
  address: string
) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.suggest(tokenId, uri, address);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const vineSupport = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.support(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const vineRetort = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.retort(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const vineFinalize = async (wallet: any) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.complete();
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const buySprinkler = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    toast.info("Sending...");
    const tx = await vineyardWithSigner.buySprinkler(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
