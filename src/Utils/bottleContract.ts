import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { viewProvider } from "./constants";
import { BottleAddress, CellarAddress } from "./constants";
import { toast } from "react-toastify";

const bottleABI = [
  "function rejuvenate(uint256 _oldTokenID) public returns (uint256)",
  "function bottleAge(uint256 _tokenID) public view returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) public",
  "function isApprovedForAll(address owner, address operator) public view returns (bool)",
];

const withSigner = (wallet: any) => {
  const provider = new Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const BottleContract = new Contract(BottleAddress, bottleABI, provider);
  return BottleContract.connect(signer);
};

const viewBottleContract = new Contract(BottleAddress, bottleABI, viewProvider);

export const totalSupply = async (): Promise<number> => {
  const totalSupply = await viewBottleContract.totalSupply();
  return parseInt(totalSupply.toString());
};

export const bottleAge = async (tokenId: number) => {
  const age = await viewBottleContract.bottleAge(tokenId);
  return age.toString();
};

export const isCellarApproved = async (owner: string) => {
  const approved = await viewBottleContract.isApprovedForAll(
    owner,
    CellarAddress
  );
  return approved;
};

export const approveCellar = async (wallet: any) => {
  const bottleWithSigner = withSigner(wallet);
  try {
    const tx = await bottleWithSigner.setApprovalForAll(CellarAddress, true);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const rejuvenate = async (wallet: any, tokenId: number) => {
  const bottleWithSigner = withSigner(wallet);
  try {
    const tx = await bottleWithSigner.rejuvenate(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
