import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { VineUriAddress, WineUriAddress } from "./constants";
import { toast } from "react-toastify";

type UriType = "VINEYARD" | "BOTTLE";

const VotableAbi = [
  "function suggest(uint256 _tokenId, string calldata _newUri, address _artist) public",
  "function support(uint256 _tokenId) public",
  "function retort(uint256 _tokenId) public",
  "function complete() public",
];

const withSigner = (wallet: any, uriType: UriType) => {
  const provider = new Web3Provider(wallet.ethereum);
  const signer = provider.getSigner();
  const VineyardContract = new Contract(
    uriType === "VINEYARD" ? VineUriAddress : WineUriAddress,
    VotableAbi,
    provider
  );
  return VineyardContract.connect(signer);
};

export const suggest = async (
  wallet: any,
  tokenId: number,
  uri: string,
  address: string,
  uriType: UriType
) => {
  const vineyardWithSigner = withSigner(wallet, uriType);

  try {
    const tx = await vineyardWithSigner.suggest(tokenId, uri, address);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const support = async (
  wallet: any,
  tokenId: number,
  uriType: UriType
) => {
  const vineyardWithSigner = withSigner(wallet, uriType);

  try {
    const tx = await vineyardWithSigner.support(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const retort = async (
  wallet: any,
  tokenId: number,
  uriType: UriType
) => {
  const vineyardWithSigner = withSigner(wallet, uriType);

  try {
    const tx = await vineyardWithSigner.retort(tokenId);
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};

export const complete = async (wallet: any, uriType: UriType) => {
  const vineyardWithSigner = withSigner(wallet, uriType);

  try {
    const tx = await vineyardWithSigner.complete();
    toast.success("Success!");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
