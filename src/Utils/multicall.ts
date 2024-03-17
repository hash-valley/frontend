import { viewProvider, MulticallAddress, VineyardAddress } from "./constants";
import { Contract } from "ethers";

const multiABI = [
  "function getFarmingStats(uint256[] calldata _tokenIds, address vineyard) public view returns (uint[] memory)",
];

const viewContract = new Contract(MulticallAddress, multiABI, viewProvider);

export const getFarmingStatsMulti = async (tokenIds: (number | string)[]) => {
  const res = await viewContract.getFarmingStats(tokenIds, VineyardAddress);
  return res.map((x: any) => {
    x = Number(x);
    return {
      isDead: x === 0,
      canPlant: x === 1,
      canWater: x === 2 || x === 4,
      canHarvest: x === 3 || x === 4,
    };
  });
};
