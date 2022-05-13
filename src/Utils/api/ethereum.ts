import { providers, Contract } from "ethers";
import { VineyardAddress, BottleAddress, providerUrl } from "../constants";

const abi = [
  "function imgVersions(uint version) public view returns(string)",
  "function artists(uint version) public view returns(address)",
  "function sellerFee() public view returns(uint16)",
];

const vineAbi = [
  "function getTokenAttributes(uint _tokenId) public view returns(uint16[] memory attributes)",
  "function xp(uint _tokenID) public view returns(uint)",
  "function currentStreak(uint256 _tokenId) public view returns (uint16)",
  ...abi,
];

const bottleAbi = [
  "function bottleAge(uint256 _tokenID) public view returns (uint256)",
  "function attributes(uint _tokenID, uint index) public view returns(uint8)",
  "function bottleEra(uint256 _tokenID) public view returns (string)",
  ...abi,
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);
const viewVineyardContract = new Contract(
  VineyardAddress,
  vineAbi,
  viewProvider
);
const viewBottleContract = new Contract(BottleAddress, bottleAbi, viewProvider);

export const vineData = async (version: number, token: number) => {
  const data = await Promise.all([
    viewVineyardContract.getTokenAttributes(token),
    viewVineyardContract.xp(token),
    viewVineyardContract.currentStreak(token),
    viewVineyardContract.imgVersions(version),
    viewVineyardContract.artists(version),
    viewVineyardContract.sellerFee(),
  ]);

  return data;
};

export const bottleData = async (version: number, token: number) => {
  const data = await Promise.all([
    viewBottleContract.attributes(token, 0),
    viewBottleContract.attributes(token, 1),
    viewBottleContract.attributes(token, 2),
    viewBottleContract.attributes(token, 3),
    viewBottleContract.bottleAge(token),
    viewBottleContract.bottleEra(token),
    viewBottleContract.imgVersions(version),
    viewBottleContract.artists(version),
    viewBottleContract.sellerFee(),
  ]);

  return data;
};
