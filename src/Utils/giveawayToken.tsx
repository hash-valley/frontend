import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
import { providerUrl } from "./constants";
import { GiveawayAddress, VineyardAddress } from "./constants";
import { toast } from "react-toastify";

const giveawayABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function burnOne() external",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

const viewProvider = new JsonRpcProvider(providerUrl);

const viewGiveawayContract = new Contract(
  GiveawayAddress,
  giveawayABI,
  viewProvider
);

export const giveawayBalance = async (address: string) => {
  return await viewGiveawayContract.balanceOf(address);
};

export const giveawayAllowance = async (owner: string) => {
  return await viewGiveawayContract.allowance(owner, VineyardAddress);
};

export const approveGiveaway = async (wallet: any) => {
  const provider = new Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const GiveawayContract = new Contract(GiveawayAddress, giveawayABI, provider);
  const giveawayWithSigner = GiveawayContract.connect(signer);

  try {
    const tx = await giveawayWithSigner.approve(
      VineyardAddress,
      parseEther("1")
    );
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const transferGiveaway = async (
  wallet: any,
  recipient: string,
  amount: number
) => {
  const provider = new Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const GiveawayContract = new Contract(GiveawayAddress, giveawayABI, provider);
  const giveawayWithSigner = GiveawayContract.connect(signer);

  try {
    const tx = await giveawayWithSigner.transfer(recipient, amount);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
