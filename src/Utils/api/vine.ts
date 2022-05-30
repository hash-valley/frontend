import { locations, soilTypes } from "../attributes";

export const vineMetadata = (
  vine_location: number,
  vine_elevation: number,
  vine_elevation_neg: number,
  vine_soil: number,
  vine_xp: number,
  vine_streak: number,
  imgUri: string,
  feeRecipient: string,
  sellerFee: number,
  token: number
) => {
  if (vine_elevation_neg) vine_elevation *= -1;

  return {
    image: `${imgUri}/?seed=${vine_location}-${Math.abs(vine_elevation)}-${vine_elevation_neg}-${vine_soil}-${vine_xp}`,
    external_url: `https://hashvalley.xyz/vineyard/${token}`,
    name: `Hash Valley Winery Vineyard ${token}`,
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
