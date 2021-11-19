import { locations, soilTypes } from "../utils";

export const vineMetadata = (
  vine_location: number,
  vine_elevation: number,
  vine_elevation_neg: number,
  vine_soil: number,
  vine_xp: number,
  vine_streak: number,
  imgUri: string,
  feeRecipient: string,
  sellerFee: number
) => {
  if (vine_elevation_neg) vine_elevation *= -1;

  return {
    image: `ipfs://${imgUri}/?seed=${vine_location}-${vine_elevation}-${vine_elevation_neg}-${vine_soil}-${vine_xp}`,
    external_uri: "https://hashvalley.xyz",
    name: "Hash Valley Winery Vineyard",
    seller_fee_basis_points: sellerFee,
    fee_recipient: feeRecipient,
    attributes: [
      {
        trait_type: "Location",
        value: locations[vine_location].name,
      },
      {
        trait_type: "Climate",
        value: locations[vine_location].climate.name,
      },
      {
        trait_type: "Elevation",
        value: vine_elevation,
      },
      {
        trait_type: "Soil",
        value: soilTypes[vine_soil].name,
      },
      {
        trait_type: "XP",
        value: vine_xp,
      },
      {
        trait_type: "Streak",
        value: vine_streak,
      },
    ],
  };
};
