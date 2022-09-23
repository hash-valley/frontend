import { VineyardAddress, viewProvider } from "./constants";
import { toast } from "react-toastify";
import { Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";

const VineyardABI = [
  "function newVineyards(int256[] calldata) public payable",
  "function newVineyardGiveaway(int256[] calldata) public",
  "function totalSupply() view returns (uint256)",
  "function getTokenAttributes(uint _tokenId) public view returns(int256[] memory attributes)",
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
  "function currSeason() public view returns (uint256)",
  "function minWaterTime(uint256 _tokenId) public view returns (uint256)",
  "function watered(uint256 _tokenId) public view returns (uint256)",
  "function waterWindow(uint256 _tokenId) public view returns (uint256)",
  "function currentStreak(uint256 _tokenId) public view returns (uint16)",
  "function buySprinkler(uint256 _tokenId) public payable",
  "function harvestGrapes(uint256 _tokenId) public",
];

const withSigner = (signer: any) => {
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, signer);
  return VineyardContract.connect(signer);
};

const viewVineyardContract = new Contract(
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

export const totalSupply = async (): Promise<number> => {
  const totalSupply = await viewVineyardContract.totalSupply();
  return parseInt(totalSupply.toString());
};

export const currentSeason = async (): Promise<number> => {
  const currSeason = await viewVineyardContract.currSeason();
  return parseInt(currSeason.toNumber());
};

/**
 *
 * @param params [location, elevation, elevationIsNegative, soil]
 */
export const newVineyards = async (
  params: number[],
  wallet: any,
  value: string
) => {
  const vineyardWithSigner = withSigner(wallet);

  // send tx
  try {
    const tx = await vineyardWithSigner.newVineyards(params, {
      value,
    });
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const newVineyardsGiveaway = async (params: number[], wallet: any) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    const tx = await vineyardWithSigner.newVineyardGiveaway(params);
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
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

// export const fetchTokenFarmingStats = async (tokenId: number) => {
//   return {
//     canWater: await viewVineyardContract.canWater(tokenId),
//     canPlant: await viewVineyardContract.canPlant(tokenId),
//     canHarvest: await viewVineyardContract.canHarvest(tokenId),
//   };
// };

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
    const tx = await vineyardWithSigner.water(tokenId);
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const plant = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    const tx = await vineyardWithSigner.plant(tokenId);
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const harvest = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    const tx = await vineyardWithSigner.harvest(tokenId);
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const harvestGrapes = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    const tx = await vineyardWithSigner.harvestGrapes(tokenId);
    toast.info("Transaction sent");
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

  toast.info(`Planting vineyards: ${tokenIds.join(", ")}`);
  try {
    const tx = await vineyardWithSigner.plantMultiple(tokenIds);
    toast.info("Transaction sent");
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

  toast.info(`Watering vineyards: ${tokenIds.join(", ")}`);
  try {
    const tx = await vineyardWithSigner.waterMultiple(tokenIds);
    toast.info("Transaction sent");
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

  toast.info(`Harvesting vineyards: ${tokenIds.join(", ")}`);
  try {
    const tx = await vineyardWithSigner.harvestMultiple(tokenIds);
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const buySprinkler = async (wallet: any, tokenId: number) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    const tx = await vineyardWithSigner.buySprinkler(tokenId, {
      value: parseEther("0.01"),
    });
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
