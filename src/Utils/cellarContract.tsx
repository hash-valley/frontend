import { providers, Contract } from "ethers";
import { providerUrl } from "./constants";
import { CellarAddress } from "./constants";

const cellarABI = [
  "function stake(uint256 _tokenID) public",
  "function withdraw(uint256 _tokenID) public",
  "function staked(uint _tokenID) public view returns(uint)",
  "function withdrawn(uint _tokenID) public view returns(uint)",
  "function owner(uint _tokenID) public view returns(address)",
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);

const viewCellarContract = new Contract(CellarAddress, cellarABI, viewProvider);

export const stakeStatus = async (tokenId: number) => {
  const stakedAt = (await viewCellarContract.staked(tokenId)).toNumber()
  const withdrawnAt = (await viewCellarContract.withdrawn(tokenId)).toNumber()
  return {
    canStake: stakedAt == 0 && withdrawnAt == 0,
    canWithdraw: stakedAt != 0 && withdrawnAt == 0,
  }
}

export const tokenOwner = async (tokenId: number) => {
  return await viewCellarContract.owner(tokenId)
}

export const stake = async (wallet: any, tokenId: number) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const CellarContract = new Contract(CellarAddress, cellarABI, provider);
  const cellarWithSigner = CellarContract.connect(signer);
  const tx = await cellarWithSigner.stake(tokenId);
  return tx;
}

export const withdraw = async (wallet: any, tokenId: number) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const CellarContract = new Contract(CellarAddress, cellarABI, provider);
  const cellarWithSigner = CellarContract.connect(signer);
  const tx = await cellarWithSigner.withdraw(tokenId);
  return tx;
}
