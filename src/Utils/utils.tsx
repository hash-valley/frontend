import { providers } from "ethers";
import { chainId, alchemyKey } from "./constants";

export const day = 24 * 60 * 60;
export const year = BigInt(365 * day);

export const formatNum = (num: string, decimals: number = 3) => {
  const decimal = num.indexOf(".");
  return num.substring(0, decimal + decimals);
};

export const shortenAddress = (addr: string | null) => {
  if (!addr) return "";
  return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
};

export const secondsToString = (seconds: string): string => {
  let bigSeconds = BigInt(seconds);
  const years = bigSeconds / BigInt(31536000);
  if (years > 0) {
    bigSeconds %= years;
  }
  const days = bigSeconds / BigInt(86400);
  if (days > 0) {
    bigSeconds %= days;
  }
  const hours = bigSeconds / BigInt(3600);
  return `${years} years, ${days} days, ${hours} hours`;
};

export const hours = (time: number): string => `${Math.floor(time / 3600)}`;

export const minutes = (time: number): string => {
  const num = Math.floor(time / 60) % 60;
  return num < 10 ? `0${num}` : `${num}`;
};

export const seconds = (time: number): string => {
  const num = time % 60;
  return num < 10 ? `0${num}` : `${num}`;
};

export const getENS = async (address: string) => {
  const provider = new providers.JsonRpcProvider(
    "https://eth-mainnet.alchemyapi.io/v2/" + alchemyKey
  );
  return await provider.lookupAddress(address);
};

export const ensToAddress = async (ens: string) => {
  const provider = new providers.JsonRpcProvider(
    "https://eth-mainnet.alchemyapi.io/v2/" + alchemyKey
  );
  return await provider.getResolver(ens);
};

export const correctNetwork = async () => {
  //@ts-ignore
  const provider = new providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  return network.chainId === chainId;
};

export const getBottleEra = (bottleAge: string | number) => {
  let bigAge = BigInt(bottleAge);
  for (let i = 0; i < bottleEras.length; ++i) {
    let range = bottleEras[i].range;
    if (range[0] <= bigAge && bigAge < range[1]) {
      return bottleEras[i].name;
    }
  }
};

export const chanceOfSpoil = (stakedDays: number) => {
  let chance;
  if (stakedDays < 360) {
    chance = 5 + Math.floor((365 - stakedDays) / 38) ** 2;
  } else {
    chance = 5;
  }
  return 100 - chance;
};

// age in seconds
export const ageOnRemove = (cellarTime: number): BigInt => {
  if (cellarTime <= 360 * day) {
    const months = Math.floor(cellarTime / day / 30);
    const monthTime = cellarTime - months * 30 * day;
    const eraTime = bottleEras[months].range[1] - bottleEras[months].range[0];
    const monthFraction = (BigInt(monthTime) * eraTime) / BigInt(30 * day);
    return bottleEras[months].range[0] + BigInt(monthFraction);
  }
  return bottleEras[12].range[1];
};

export const toDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toUTCString();
};

export interface BottleType {
  type: string;
  subtype: string;
  note: string;
  name: string;
}

export const getBottleType = (attributes: number[]): BottleType => {
  const type = attributes[0];
  const subtype = attributes[1];
  const note = attributes[2];
  const name = attributes[3];

  return {
    type: bottleTypes[type].name,
    subtype: bottleTypes[type].subtypes[subtype].name,
    note: bottleTypes[type].subtypes[subtype].notes[note].name,
    name: bottleTypes[type].subtypes[subtype].notes[note].type[name],
  };
};

export const getBottleClass = (attributes: number[]): string => {
  const type = attributes[0];
  return bottleTypes[type].name;
};

export const getBottleName = (attributes: number[]): string => {
  const type = attributes[0];
  const subtype = attributes[1];
  const note = attributes[2];
  const name = attributes[3];
  return bottleTypes[type].subtypes[subtype].notes[note].type[name];
};

export const locations = [
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
    name: "Madeira",
    elevation: [0, 6106],
    climate: {
      name: "Temperate Subtropical",
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
      value: 4,
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

export const soilTypes = [
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

export const bottleTypes = [
  {
    name: "Red",
    subtypes: [
      {
        name: "Fruity Dry Red",
        notes: [
          {
            name: "Blueberry Blackberry",
            type: [
              "Shiraz",
              "Monastrell",
              "Mencia",
              "Nero Buono",
              "Petit Verdot",
              "Pinotage",
            ],
          },
          {
            name: "Black Cherry Rasberry",
            type: [
              "Cabernet Suavignon",
              "Merlot",
              "Super Tuscan",
              "Amarone",
              "Valpolicalla",
              "Cabernet France",
              "Sangiovese",
              "Priorat",
            ],
          },
          {
            name: "Strawberry Cherry",
            type: [
              "Garnacha",
              "Pinot Nior",
              "Carmenere",
              "Primitivo",
              "Counoise",
              "Barbera",
              "Grenache",
            ],
          },
          {
            name: "Tart Cherry Cranberry",
            type: [
              "Zweigelt",
              "Gamay",
              "Blaufrankisch",
              "St. Laurent",
              "Spatburgunder",
            ],
          },
        ],
      },
      {
        name: "Herbal Dry Red",
        notes: [
          {
            name: "Clay and Cured Meats",
            type: [
              "Barolo",
              "Barbaresco",
              "Chianti",
              "Vacqueyras",
              "Gigondas",
              "Brunello di Montalcino",
            ],
          },
          {
            name: "Truffle & Forest",
            type: [
              "Bourgogne",
              "Dolcetto",
              "Grignolino",
              "Barbera",
              "Beaujolais",
            ],
          },
          {
            name: "Smoke Tobacco Leather",
            type: [
              "Taurasi",
              "Cahors",
              "Rioja",
              "Aglianico",
              "Graves",
              "Rioja",
              "Pessac-Leognan",
            ],
          },
          {
            name: "Black Pepper Gravel",
            type: [
              "Cahors",
              "Medoc",
              "Sagrantino",
              "Tannat",
              "Pauillac",
              "Saint-Julien",
              "Chinon",
              "Lagrein",
              "Hermitage",
              "Bandol",
              "Cotes de Castillon",
              "Fronsac",
              "Rhone",
            ],
          },
        ],
      },
      {
        name: "Sweet Red",
        notes: [
          {
            name: "Sweet Red",
            type: ["Recioto della Valpolicella", "Occhio di Pernice", "Freisa"],
          },
        ],
      },
    ],
  },
  {
    name: "White",
    subtypes: [
      {
        name: "Dry White",
        notes: [
          {
            name: "Light Grapefruit Floral",
            type: [
              "Cortese",
              "Vermentino",
              "Moschofilero",
              "Verdicchio",
              "Orvieto",
              "Pinot Blanc",
              "Greco di Tufo",
            ],
          },
          {
            name: "Light Citrus Lemon",
            type: [
              "Chablis",
              "Picpoul",
              "Garganega",
              "Fiano",
              "Muscadet",
              "Assyrtiko",
              "Silvaner",
              "Albarino",
            ],
          },
          {
            name: "Light Herbal Grassy",
            type: [
              "Pouilly Fume",
              "Entre-deux-Mers",
              "Ugni Blanc",
              "Touraine",
              "Sauvignon Blanc",
              "Chevemy",
              "Verdejo",
            ],
          },
          {
            name: "Rich Creamy Nutty",
            type: [
              "Chardonnay",
              "Montrachet",
              "Macconais",
              "Soave",
              "pessac-Leognan",
              "Savennieres",
              "Antao Vaz",
              "Cote de Beaune",
            ],
          },
          {
            name: "Medium Perfume Floral",
            type: [
              "Torrontes",
              "Vouvray Sec",
              "Malvasiz Secco",
              "Condrieu",
              "Roussanne",
              "Tokaji",
              "Viognier",
              "Fiano",
              "Marsanne",
            ],
          },
        ],
      },
      {
        name: "Sweet White",
        notes: [
          {
            name: "Off-Dry Apricots Peaches",
            type: [
              "Chenin Blanc",
              "Spatlese",
              "Kaniett",
              "Demi-sec",
              "Gewurztraminer",
              "Muller-Thurgau",
            ],
          },
          {
            name: "Sweet Tropical Honey",
            type: [
              "Late Harvest",
              "Muscat Blanc",
              "Aboccato",
              "Sauternes",
              "Auslese",
              "Moelleux",
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Rose",
    subtypes: [
      {
        name: "Dry Rose",
        notes: [
          {
            name: "Herbal Savory",
            type: [
              "Loire Rose",
              "Bandol Rose",
              "Cabernet Franc Rose",
              "Syrah Rose",
              "Cabernet Sauvignon Rose",
            ],
          },
          {
            name: "Fruity Floral",
            type: [
              "Pinot Noir Rose",
              "Grenache Rose",
              "Provence Rose",
              "Sangiovese Rose",
              "Rosado",
              "Tavel",
            ],
          },
        ],
      },
      {
        name: "Off Dry Rose",
        notes: [
          {
            name: "Off Dry Rose",
            type: [
              "Blush",
              "Merlot",
              "Zinfandel",
              "Vin Gris",
              "Garnacha Rosado",
              "Rose d' Anjou",
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Sparkling",
    subtypes: [
      {
        name: "White",
        notes: [
          {
            name: "Dry Creamy Rich",
            type: [
              "Vintage Champagne",
              "Blance de Noirs",
              "Blanc de Blancs",
              "Metodo Classico",
            ],
          },
          {
            name: "Dry Light Citrus",
            type: [
              "Brut Nature",
              "Sec",
              "Cava",
              "Brut",
              "Extra-Brut",
              "Metodo Classico",
              "Proseco Extra-Brut",
            ],
          },
          {
            name: "Off Dry Floral",
            type: [
              "Champagne Extra Dry",
              "Proseco",
              "Sparkling Riesling",
              "Valdobbiadene",
              "Malvasia Secco",
            ],
          },
          {
            name: "Sweet Apricots Rich",
            type: [
              "Moscato d'Asti",
              "Vouvray Mousseux",
              "Demi-Sec",
              "Doux",
              "Asti Spumante",
            ],
          },
        ],
      },
      {
        name: "Red",
        notes: [
          {
            name: "Dry Raspberry Blueberry",
            type: ["Lambrusco Spumante", "Lambrusco Secco", "Sparkling Shiraz"],
          },
          {
            name: "Sweet Blueberry Cherry",
            type: ["Brachetto d'Acqui", "Lambrusco Dolce"],
          },
          {
            name: "Off Dry Raspberry Cherry",
            type: ["Lambrusco Amabile", "Brachetto d'Acqui"],
          },
        ],
      },
      {
        name: "Rose",
        notes: [
          {
            name: "Dry Strawberry Floral",
            type: ["Champagne Rose", "Cremant Rose", "Cava Rose Brut"],
          },
          {
            name: "Off Dry Strawberry Orange",
            type: ["Moscato Rose", "Brachetto d'Acqui Rose", "Cava Rose"],
          },
        ],
      },
    ],
  },
];

const bottleEras = [
  {
    name: "Contemporary",
    range: [BigInt(0), BigInt(100) * year],
  },
  {
    name: "Modern",
    range: [BigInt(100) * year, BigInt(250) * year],
  },
  {
    name: "Romantic",
    range: [BigInt(250) * year, BigInt(500) * year],
  },
  {
    name: "Renaissance",
    range: [BigInt(500) * year, BigInt(800) * year],
  },
  {
    name: "Medeival",
    range: [BigInt(800) * year, BigInt(1600) * year],
  },
  {
    name: "Classical",
    range: [BigInt(1600) * year, BigInt(2700) * year],
  },
  {
    name: "Ancient",
    range: [BigInt(2700) * year, BigInt(4000) * year],
  },
  {
    name: "Neolithic",
    range: [BigInt(4000) * year, BigInt(10000) * year],
  },
  {
    name: "Prehistoric",
    range: [BigInt(10000) * year, BigInt(100000) * year],
  },
  {
    name: "Primordial",
    range: [BigInt(100000) * year, BigInt(1000000000) * year],
  },
  {
    name: "Archean",
    range: [BigInt(1000000000) * year, BigInt(4000000000) * year],
  },
  {
    name: "Astral",
    range: [BigInt(4000000000) * year, BigInt(13000000000) * year],
  },
  {
    name: "Akashic",
    range: [BigInt(13000000000) * year, BigInt(13000000001) * year],
  },
];
