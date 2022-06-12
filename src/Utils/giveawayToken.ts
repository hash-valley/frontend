import { viewProvider } from "./constants";
import { GiveawayAddress, VineyardAddress } from "./constants";
import { toast } from "react-toastify";
import { Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";

const giveawayABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function burnOne() external",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

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

export const approveGiveaway = async (signer: any) => {
  const GiveawayContract = new Contract(GiveawayAddress, giveawayABI, signer);
  const giveawayWithSigner = GiveawayContract.connect(signer);

  try {
    const tx = await giveawayWithSigner.approve(
      VineyardAddress,
      parseEther("1")
    );
    await tx.wait();
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const transferGiveaway = async (
  signer: any,
  recipient: string,
  amount: number
) => {
  const GiveawayContract = new Contract(GiveawayAddress, giveawayABI, signer);
  const giveawayWithSigner = GiveawayContract.connect(signer);

  try {
    const tx = await giveawayWithSigner.transfer(recipient, amount);
    await tx.wait();
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
