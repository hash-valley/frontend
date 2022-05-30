import { bottleTypes } from "../attributes";

export const bottleMetadata = (
  type: number,
  subtype: number,
  note: number,
  name: number,
  age: number,
  era: string,
  imgUri: string,
  feeRecipient: string,
  sellerFee: number,
  token: number
) => {
  return {
    image: `${imgUri}/?seed=${type}-${subtype}-${note}-${name}-${age}`,
    external_url: `https://hashvalley.xyz/bottle/${token}`,
    name: `Hash Valley Winery Bottle ${token}`,
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
        value: era,
      },
    ],
  };
};
