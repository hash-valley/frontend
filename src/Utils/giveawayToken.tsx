import { providers, Contract, ethers } from "ethers";
import { providerUrl } from "./constants";
import { GiveawayAddress, VineyardAddress } from "./constants";

const giveawayABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function burnOne() external",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);

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
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const GiveawayContract = new Contract(GiveawayAddress, giveawayABI, provider);
  const giveawayWithSigner = GiveawayContract.connect(signer);
  const tx = await giveawayWithSigner.approve(
    VineyardAddress,
    ethers.utils.parseEther("1")
  );
  return tx;
};

export const transferGiveaway = async (
  wallet: any,
  recipient: string,
  amount: number
) => {
  const provider = new providers.Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const GiveawayContract = new Contract(GiveawayAddress, giveawayABI, provider);
  const giveawayWithSigner = GiveawayContract.connect(signer);
  const tx = await giveawayWithSigner.transfer(recipient, amount);
  return tx;
};