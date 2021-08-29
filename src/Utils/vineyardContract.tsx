import { providers, Contract, utils } from "ethers";
import { VineyardAddress, providerUrl } from "./constants";
import { locations, soilTypes } from "./utils";

const VineyardABI = [
  "function newVineyards(uint16[] calldata) public payable",
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
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);

export const viewVineyardContract = new Contract(VineyardAddress, VineyardABI, viewProvider);

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

export const maxVineyards = async () => {
  const maxVineyards = await viewVineyardContract.maxVineyards();
  return parseInt(maxVineyards.toString());
};

export const totalSupply = async () => {
  const totalSupply = await viewVineyardContract.totalSupply();
  return parseInt(totalSupply.toString());
};

export const currentSeason = async () => {
  const currSeason = await viewVineyardContract.currSeason();
  return parseInt(currSeason.toNumber());
};

export const latestUriVersion = async () => {
  return await viewVineyardContract.imgVersionCount();
};

export const historicalUri = async (n: number) => {
  return await viewVineyardContract.imgVersions(n);
};

/**
 *
 * @param params [location, elevation, elevationIsNegative, soil]
 */
export const newVineyards = async (params: number[], wallet: any) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  const vineyardWithSigner = VineyardContract.connect(signer);
  let negative: number = 0;
  if (params[1] < 0) negative = 1;
  const processedParams: number[] = [
    params[0],
    Math.abs(params[1]),
    negative,
    params[2],
  ];
  const supply = await totalSupply()
  let tx
  if (supply < 100) {
    tx = await vineyardWithSigner.newVineyards(processedParams);
  } else {
    tx = await vineyardWithSigner.newVineyards(processedParams, {
      value: utils.parseEther("0.05"),
    });
  }
  return tx;
};

export const userBalance = async (userAddress: string) => {
  const balance = await viewVineyardContract.balanceOf(userAddress);
  return parseInt(balance.toString());
};

export const getStreak = async (tokenId: number): Promise<number> => {
  const streak = await viewVineyardContract.currentStreak(tokenId);
  return streak
}

export const fetchTokenParams = async (tokenId: number): Promise<TokenParams> => {
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
}

export const tokenOwner = async (tokenId: number) => {
  return await viewVineyardContract.ownerOf(tokenId)
}

export const tokenIdsByOwner = async (userAddress: string) => {
  const balance = await userBalance(userAddress);
  let tokenIds: TokenParams[] = [];
  let farmables: Farmable[] = [];
  for (let i = 0; i < balance; i++) {
    const id = await viewVineyardContract.tokenOfOwnerByIndex(userAddress, i);
    tokenIds.push(await fetchTokenParams(id.toNumber()));
    farmables.push(await fetchTokenFarmingStats(id.toNumber()))
  }
  return {
    tokenIds,
    farmables
  };
};

export const untilCanWater = async (tokenId: number): Promise<number> => {
  const [minTime, watered] = await Promise.all([
    viewVineyardContract.minWaterTime(tokenId),
    viewVineyardContract.watered(tokenId)
  ])
  const now = Math.floor(Date.now() / 1000)
  return Number(watered) + Number(minTime) - now
}

export const canWaterUntil = async (tokenId: number): Promise<number> => {
  const [minTime, watered, waterWindow] = await Promise.all([
    viewVineyardContract.minWaterTime(tokenId),
    viewVineyardContract.watered(tokenId),
    viewVineyardContract.waterWindow(tokenId)
  ])
  const now = Math.floor(Date.now() / 1000)
  return Number(watered) + Number(minTime) + Number(waterWindow) - now
}

export const water = async (wallet: any, tokenId: number) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  const vineyardWithSigner = VineyardContract.connect(signer);
  const tx = await vineyardWithSigner.water(tokenId);
  return tx;
};

export const plant = async (wallet: any, tokenId: number) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  const vineyardWithSigner = VineyardContract.connect(signer);
  const tx = await vineyardWithSigner.plant(tokenId);
  return tx;
};

export const harvest = async (wallet: any, tokenId: number) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  const vineyardWithSigner = VineyardContract.connect(signer);
  const tx = await vineyardWithSigner.harvest(tokenId);
  return tx;
};

export const plantMultiple = async (wallet: any, tokenIds: number[] | string[]) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  const vineyardWithSigner = VineyardContract.connect(signer);
  const tx = await vineyardWithSigner.plantMultiple(tokenIds);
  return tx;
};

export const waterMultiple = async (wallet: any, tokenIds: number[] | string[]) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  const vineyardWithSigner = VineyardContract.connect(signer);
  const tx = await vineyardWithSigner.waterMultiple(tokenIds);
  return tx;
};

export const harvestMultiple = async (wallet: any, tokenIds: number[] | string[]) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
  const vineyardWithSigner = VineyardContract.connect(signer);
  const tx = await vineyardWithSigner.harvestMultiple(tokenIds);
  return tx;
};
