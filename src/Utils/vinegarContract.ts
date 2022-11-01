import { viewProvider } from "./constants";
import { VinegarAddress } from "./constants";
import { toast } from "react-toastify";
import { Contract } from "ethers";

const vinegarABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

const viewVinegarContract = new Contract(
  VinegarAddress,
  vinegarABI,
  viewProvider
);

export const vinegarBalance = async (address: string) => {
  return await viewVinegarContract.balanceOf(address);
};

export const vinegarAllowance = async (owner: string, spender: string) => {
  return await viewVinegarContract.allowance(owner, spender);
};

export const approveVinegar = async (
  signer: any,
  spender: string,
  amount: number
) => {
  const VinegarContract = new Contract(VinegarAddress, vinegarABI, signer);
  const vinegarWithSigner = VinegarContract.connect(signer);

  try {
    const tx = await vinegarWithSigner.approve(spender, amount);
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const transferVinegar = async (
  signer: any,
  recipient: string,
  amount: number
) => {
  const VinegarContract = new Contract(VinegarAddress, vinegarABI, signer);
  const vinegarWithSigner = VinegarContract.connect(signer);

  try {
    const tx = await vinegarWithSigner.transfer(recipient, amount);
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
