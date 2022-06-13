import { viewProvider } from "./constants";
import { CellarAddress } from "./constants";
import { toast } from "react-toastify";
import { Contract } from "ethers";

const cellarABI = [
  "function stake(uint256 _tokenID) public",
  "function withdraw(uint256 _tokenID) public",
  "function staked(uint _tokenID) public view returns(uint)",
  "function withdrawn(uint _tokenID) public view returns(uint)",
];

const viewCellarContract = new Contract(CellarAddress, cellarABI, viewProvider);

const withSigner = (signer: any) => {
  const CellarContract = new Contract(CellarAddress, cellarABI, signer);
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

export const stake = async (wallet: any, tokenId: number) => {
  const cellarWithSigner = withSigner(wallet);
  try {
    const tx = await cellarWithSigner.stake(tokenId);
    toast.info("Transaction sent");
    await tx.wait();
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
    const tx = await cellarWithSigner.withdraw(tokenId);
    toast.info("Transaction sent");
    await tx.wait();
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
