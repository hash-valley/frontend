import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
import { VineyardAddress, viewProvider } from "./constants";
import { toast } from "react-toastify";

const VineyardABI = [
  "function newVineyards(uint16[] calldata) public payable",
  "function newVineyardGiveaway(uint16[] calldata) public",
  "function totalSupply() view returns (uint256)",
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
  "function currSeason() public view returns (uint256)",
  "function minWaterTime(uint256 _tokenId) public view returns (uint256)",
  "function watered(uint256 _tokenId) public view returns (uint256)",
  "function waterWindow(uint256 _tokenId) public view returns (uint256)",
  "function currentStreak(uint256 _tokenId) public view returns (uint16)",
  "function buySprinkler(uint256 _tokenId) public payable",
  "function newVineyardsDiscount(uint16[] calldata _tokenAttributes, uint256 index, bytes32[] calldata merkleProof) public payable",
];

const withSigner = (wallet: any) => {
  const provider = new Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(VineyardAddress, VineyardABI, provider);
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
export const newVineyards = async (params: number[], wallet: any) => {
  const vineyardWithSigner = withSigner(wallet);

  //process params
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

  //discount check
  const res = await fetch(`/api/merkle?address=${wallet.account}`);
  const resjson = await res.json();

  if (supply < 100) {
    try {
      tx = await vineyardWithSigner.newVineyards(processedParams);
      toast.success("Success!");
      return tx;
    } catch (err: any) {
      console.error(err);
      toast.error(`Error! ${err?.message}`);
    }
  } else if (resjson.hasClaim) {
    return await newVineyardsDiscount(processedParams, wallet, resjson);
  } else {
    try {
      tx = await vineyardWithSigner.newVineyards(processedParams, {
        value: parseEther("0.07"),
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
    const tx = await vineyardWithSigner.newVineyardGiveaway(processedParams);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

const newVineyardsDiscount = async (
  processedParams: number[],
  wallet: any,
  claim: any
) => {
  const vineyardWithSigner = withSigner(wallet);

  try {
    const tx = await vineyardWithSigner.newVineyardsDiscount(
      processedParams,
      claim.index,
      claim.proof,
      { value: parseEther("0.04") }
    );
    toast.success("Success!");
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

export const fetchTokenFarmingStats = async (tokenId: number) => {
  return {
    canWater: await viewVineyardContract.canWater(tokenId),
    canPlant: await viewVineyardContract.canPlant(tokenId),
    canHarvest: await viewVineyardContract.canHarvest(tokenId),
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
    const tx = await vineyardWithSigner.harvestMultiple(tokenIds);
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
    const tx = await vineyardWithSigner.buySprinkler(tokenId, {
      value: parseEther("0.01"),
    });
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
