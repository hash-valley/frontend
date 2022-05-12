import { providers, Contract } from "ethers";
import { providerUrl } from "./constants";
import { VinegarAddress } from "./constants";
import { toast } from "react-toastify";

const vinegarABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);

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
  wallet: any,
  spender: string,
  amount: number
) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VinegarContract = new Contract(VinegarAddress, vinegarABI, provider);
  const vinegarWithSigner = VinegarContract.connect(signer);

  try {
    const tx = await vinegarWithSigner.approve(spender, amount);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const transferVinegar = async (
  wallet: any,
  recipient: string,
  amount: number
) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VinegarContract = new Contract(VinegarAddress, vinegarABI, provider);
  const vinegarWithSigner = VinegarContract.connect(signer);

  try {
    const tx = await vinegarWithSigner.transfer(recipient, amount);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
