const locations = [
  {
    name: "Amsterdam",
    elevation: [-21, -21],
    climate: {
      name: "Temperate Maritime",
      value: 0,
    },
  },
  {
    name: "Tokyo",
    elevation: [131, 131],
    climate: {
      name: "Humid Subtropical",
      value: 1,
    },
  },
  {
    name: "Napa Valley",
    elevation: [20, 20],
    climate: {
      name: "Mediterranean",
      value: 2,
    },
  },
  {
    name: "Denali",
    elevation: [240, 20310],
    climate: {
      name: "Continental Subarctic",
      value: 3,
    },
  },
  {
    name: "Greenland",
    elevation: [0, 12119],
    climate: {
      name: "Tundra",
      value: 4,
    },
  },
  {
    name: "Kashmere",
    elevation: [1000, 10000],
    climate: {
      name: "Moderate",
      value: 5,
    },
  },
  {
    name: "Outback",
    elevation: [-45, 6684],
    climate: {
      name: "Hot Desert",
      value: 6,
    },
  },
  {
    name: "Siberia",
    elevation: [0, 15253],
    climate: {
      name: "Continental Subarctic",
      value: 3,
    },
  },
  {
    name: "Mt. Everest",
    elevation: [29032, 29032],
    climate: {
      name: "Arctic",
      value: 7,
    },
  },
  {
    name: "Amazon Basin",
    elevation: [0, 1200],
    climate: {
      name: "Tropical Jungle",
      value: 8,
    },
  },
  {
    name: "Ohio",
    elevation: [0, 455],
    climate: {
      name: "Humid Subtropical",
      value: 1,
    },
  },
  {
    name: "Borneo",
    elevation: [0, 13435],
    climate: {
      name: "Tropical Maritime",
      value: 9,
    },
  },
  {
    name: "Fujian Province",
    elevation: [0, 7080],
    climate: {
      name: "Temperate Subtropical",
      value: 10,
    },
  },
  {
    name: "Long Island",
    elevation: [0, 120],
    climate: {
      name: "Humid Subtropical",
      value: 1,
    },
  },
  {
    name: "Champagne",
    elevation: [300, 2362],
    climate: {
      name: "Mediterranean",
      value: 2,
    },
  },
];

const soilTypes = [
  {
    name: "Rocky",
  },
  {
    name: "Sandy",
  },
  {
    name: "Clay",
  },
  {
    name: "Boggy",
  },
  {
    name: "Peaty",
  },
  {
    name: "Mulch",
  },
];

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
