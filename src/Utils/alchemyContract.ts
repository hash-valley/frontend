import { AlchemyAddress, SPELL } from "./constants";
import { toast } from "react-toastify";
import { Contract } from "ethers";

const ABI = [
  "function wither(uint256 target) public",
  "function defend(uint256 target) public",
  "function vitality(uint256 target) public",
];

const withSigner = (signer: any) => {
  const _Contract = new Contract(AlchemyAddress, ABI, signer);
  return _Contract.connect(signer);
};

export const castSpell = async (wallet: any, target: number, spell: SPELL) => {
  const contractWithSigner = withSigner(wallet);
  let tx;
  try {
    switch (spell) {
      case SPELL.WITHER:
        tx = await contractWithSigner.wither(target);
        break;
      case SPELL.DEFEND:
        tx = await contractWithSigner.defend(target);
        break;
      case SPELL.VITALIZE:
        tx = await contractWithSigner.vitality(target);
        break;
    }
    toast.info("Transaction sent");
    return tx;
  } catch (err: any) {
    console.error(err);
    toast.error(`Error! ${err?.message}`);
  }
};
