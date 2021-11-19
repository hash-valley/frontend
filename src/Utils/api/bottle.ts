const bottleTypes = [
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

const year = BigInt(365 * 24 * 60 * 60);
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

const getBottleEra = (bottleAge: number) => {
  let bigAge = BigInt(bottleAge);
  for (let i = 0; i < bottleEras.length; ++i) {
    let range = bottleEras[i].range;
    if (range[0] <= bigAge && bigAge < range[1]) {
      return bottleEras[i].name;
    }
  }
};

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
