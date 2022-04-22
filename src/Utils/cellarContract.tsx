import { providers, Contract } from "ethers";
import { providerUrl } from "./constants";
import { CellarAddress } from "./constants";
import { toast } from "react-toastify";

const cellarABI = [
  "function stake(uint256 _tokenID) public",
  "function withdraw(uint256 _tokenID) public",
  "function staked(uint _tokenID) public view returns(uint)",
  "function withdrawn(uint _tokenID) public view returns(uint)",
  "function owner(uint _tokenID) public view returns(address)",
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);

const viewCellarContract = new Contract(CellarAddress, cellarABI, viewProvider);

const withSigner = (wallet: any) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const CellarContract = new Contract(CellarAddress, cellarABI, provider);
  return CellarContract.connect(signer);
};

export const stakeStatus = async (tokenId: number) => {
  const stakedAt = (await viewCellarContract.staked(tokenId)).toNumber();
  const withdrawnAt = (await viewCellarContract.withdrawn(tokenId)).toNumber();
  return {
    canStake: stakedAt == 0 && withdrawnAt == 0,
    canWithdraw: stakedAt != 0 && withdrawnAt == 0,
  };
};

export const tokenOwner = async (tokenId: number) => {
  return await viewCellarContract.owner(tokenId);
};

export const stake = async (wallet: any, tokenId: number) => {
  const cellarWithSigner = withSigner(wallet);
  try {
    toast.info("Sending...");
    const tx = await cellarWithSigner.stake(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const withdraw = async (wallet: any, tokenId: number) => {
  const cellarWithSigner = withSigner(wallet);
  try {
    toast.info("Sending...");
    const tx = await cellarWithSigner.withdraw(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
