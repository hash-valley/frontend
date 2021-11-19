import { bottleTypes, getBottleEra } from "../utils";

export const bottleMetadata = (
  attributes: number,
  age: number,
  imgUri: string,
  feeRecipient: string,
  sellerFee: number
) => {
  const type = 0;
  const subtype = 1;
  const note = 2;
  const name = 3;

  return {
    image: `ipfs://${imgUri}/?seed=${attributes}-${age}`,
    external_uri: "https://hashvalley.xyz",
    name: "Hash Valley Winery Bottle",
    seller_fee_basis_points: sellerFee,
    fee_recipient: feeRecipient,
    attributes: [
      {
        trait_type: "Type",
        value: bottleTypes[type].name,
      },
      {
        trait_type: "Subtype",
        value: bottleTypes[type].subtypes[subtype].name,
      },
      {
        trait_type: "Note",
        value: bottleTypes[type].subtypes[subtype].notes[note].name,
      },
      {
        trait_type: "Name",
        value: bottleTypes[type].subtypes[subtype].notes[note].type[name],
      },
      {
        trait_type: "Age",
        value: age.toString(),
      },
      {
        trait_type: "Era",
        value: getBottleEra(age),
      },
    ],
  };
};
