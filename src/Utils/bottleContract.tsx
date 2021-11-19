import { providers, Contract } from "ethers";
import { providerUrl } from "./constants";
import { tokenOwner as cellarTokenOwner } from "./cellarContract";
import { BottleAddress, CellarAddress } from "./constants";

const bottleABI = [
  "function rejuvenate(uint256 _oldTokenID) public returns (uint256)",
  "function balanceOf(address) view returns (uint256 balance)",
  "function ownerOf(uint256 tokenId) external view returns (address owner)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId)",
  "function bottleAge(uint256 _tokenID) public view returns (uint256)",
  "function attributes(uint _tokenID) public view returns(uint)",
  "function setApprovalForAll(address operator, bool approved) public",
  "function isApprovedForAll(address owner, address operator) public view returns (bool)",
  "function imgVersionCount() public view returns (uint256)",
  "function imgVersions(uint256 id) public view returns (string)",
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);

export const viewBottleContract = new Contract(
  BottleAddress,
  bottleABI,
  viewProvider
);

export const totalSupply = async () => {
  const totalSupply = await viewBottleContract.totalSupply();
  return parseInt(totalSupply.toString());
};

export const latestUriVersion = async () => {
  return await viewBottleContract.imgVersionCount();
};

export const historicalUri = async (n: number) => {
  return await viewBottleContract.imgVersions(n);
};

export const userBalance = async (userAddress: string) => {
  const balance = await viewBottleContract.balanceOf(userAddress);
  return parseInt(balance.toString());
};

export const tokenOwner = async (tokenId: number) => {
  let owner = await viewBottleContract.ownerOf(tokenId);
  if (owner == CellarAddress) {
    owner = await cellarTokenOwner(tokenId);
  }
  return owner;
};

export const tokenIdsByOwner = async (userAddress: string) => {
  const balance = await userBalance(userAddress);
  let tokenIds: number[] = [];
  for (let i = 0; i < balance; i++) {
    const id = await viewBottleContract.tokenOfOwnerByIndex(userAddress, i);
    tokenIds.push(id.toNumber());
  }
  return tokenIds;
};

export const bottleAge = async (tokenId: number) => {
  const age = await viewBottleContract.bottleAge(tokenId);
  return age.toString();
};

export const bottleAttributes = async (tokenId: number) => {
  const attr = await viewBottleContract.attributes(tokenId);
  return attr.toNumber();
};

export const isCellarApproved = async (owner: string) => {
  const approved = await viewBottleContract.isApprovedForAll(
    owner,
    CellarAddress
  );
  return approved;
};

export const approveCellar = async (wallet: any) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const BottleContract = new Contract(BottleAddress, bottleABI, provider);
  const bottleWithSigner = BottleContract.connect(signer);
  const tx = await bottleWithSigner.setApprovalForAll(CellarAddress, true);
  return tx;
};

export const rejuvenate = async (wallet: any, tokenId: number) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const BottleContract = new Contract(BottleAddress, bottleABI, provider);
  const bottleWithSigner = BottleContract.connect(signer);
  console.log(tokenId);
  const tx = await bottleWithSigner.rejuvenate(tokenId);
  return tx;
};
