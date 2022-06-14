import { viewProvider } from "./constants";
import { BottleAddress, CellarAddress } from "./constants";
import { toast } from "react-toastify";
import { Contract } from "ethers";

const bottleABI = [
  "function rejuvenate(uint256 _oldTokenID) public returns (uint256)",
  "function bottleAge(uint256 _tokenID) public view returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) public",
  "function isApprovedForAll(address owner, address operator) public view returns (bool)",
];

const withSigner = (signer: any) => {
  const BottleContract = new Contract(BottleAddress, bottleABI, signer);
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
    toast.info("Transaction sent");
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
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
