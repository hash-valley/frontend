import { YEAR } from "./constants";

export const locations = [
  {
    name: "Amsterdam",
    elevation: [-21, -21],
    climate: {
      name: "Temperate Maritime",
      value: 0,
    },
    bonus: false,
  },
  {
    name: "Tokyo",
    elevation: [131, 131],
    climate: {
      name: "Humid Subtropical",
      value: 1,
    },
    bonus: false,
  },
  {
    name: "Napa Valley",
    elevation: [20, 20],
    climate: {
      name: "Mediterranean",
      value: 2,
    },
    bonus: false,
  },
  {
    name: "Denali",
    elevation: [240, 20310],
    climate: {
      name: "Continental Subarctic",
      value: 3,
    },
    bonus: false,
  },
  {
    name: "Madeira",
    elevation: [0, 6106],
    climate: {
      name: "Temperate Subtropical",
      value: 4,
    },
    bonus: false,
  },
  {
    name: "Kashmere",
    elevation: [1000, 10000],
    climate: {
      name: "Moderate",
      value: 5,
    },
    bonus: false,
  },
  {
    name: "Outback",
    elevation: [-45, 6684],
    climate: {
      name: "Hot Desert",
      value: 6,
    },
    bonus: false,
  },
  {
    name: "Siberia",
    elevation: [0, 15253],
    climate: {
      name: "Continental Subarctic",
      value: 3,
    },
    bonus: false,
  },
  {
    name: "Mt. Everest",
    elevation: [29032, 29032],
    climate: {
      name: "Arctic",
      value: 7,
    },
    bonus: false,
  },
  {
    name: "Amazon Basin",
    elevation: [0, 1200],
    climate: {
      name: "Tropical Jungle",
      value: 8,
    },
    bonus: false,
  },
  {
    name: "Ohio",
    elevation: [0, 455],
    climate: {
      name: "Humid Subtropical",
      value: 1,
    },
    bonus: false,
  },
  {
    name: "Borneo",
    elevation: [0, 13435],
    climate: {
      name: "Tropical Maritime",
      value: 9,
    },
    bonus: false,
  },
  {
    name: "Fujian Province",
    elevation: [0, 7080],
    climate: {
      name: "Temperate Subtropical",
      value: 4,
    },
    bonus: false,
  },
  {
    name: "Long Island",
    elevation: [0, 120],
    climate: {
      name: "Humid Subtropical",
      value: 1,
    },
    bonus: false,
  },
  {
    name: "Champagne",
    elevation: [300, 2362],
    climate: {
      name: "Mediterranean",
      value: 2,
    },
    bonus: false,
  },
  {
    name: "Atlantis",
    elevation: [-1600, -150],
    climate: {
      name: "Ocean Floor",
      value: 10,
    },
    bonus: true,
  },
  {
    name: "Orbital Ring",
    elevation: [8448000, 117406080],
    climate: {
      name: "Zero Gravity",
      value: 11,
    },
    bonus: true,
  },
  {
    name: "Hypercubic Tesselation Plane",
    elevation: [0, 0],
    climate: {
      name: "Harmonic Vibrance Manifold",
      value: 12,
    },
    bonus: true,
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

export const bottleEras = [
  {
    name: "Contemporary",
    range: [BigInt(0), BigInt(100) * YEAR],
  },
  {
    name: "Modern",
    range: [BigInt(100) * YEAR, BigInt(250) * YEAR],
  },
  {
    name: "Romantic",
    range: [BigInt(250) * YEAR, BigInt(500) * YEAR],
  },
  {
    name: "Renaissance",
    range: [BigInt(500) * YEAR, BigInt(800) * YEAR],
  },
  {
    name: "Medeival",
    range: [BigInt(800) * YEAR, BigInt(1600) * YEAR],
  },
  {
    name: "Classical",
    range: [BigInt(1600) * YEAR, BigInt(2700) * YEAR],
  },
  {
    name: "Ancient",
    range: [BigInt(2700) * YEAR, BigInt(4000) * YEAR],
  },
  {
    name: "Neolithic",
    range: [BigInt(4000) * YEAR, BigInt(10000) * YEAR],
  },
  {
    name: "Prehistoric",
    range: [BigInt(10000) * YEAR, BigInt(100000) * YEAR],
  },
  {
    name: "Primordial",
    range: [BigInt(100000) * YEAR, BigInt(1000000000) * YEAR],
  },
  {
    name: "Archean",
    range: [BigInt(1000000000) * YEAR, BigInt(4000000000) * YEAR],
  },
  {
    name: "Astral",
    range: [BigInt(4000000000) * YEAR, BigInt(13000000000) * YEAR],
  },
  {
    name: "Akashic",
    range: [BigInt(13000000000) * YEAR, BigInt(13000000001) * YEAR],
  },
];
