export const API_BASE_URL = "https://optcgapi.com/api";

export const PACK_SIZE = 12;

export const PACK_PRICE = 4.99;

export const CARD_ASPECT_RATIO = 63 / 88; // width / height

export const RARITY_ORDER = ["C", "UC", "R", "L", "SR", "SEC"] as const;

// Real English booster pack structure:
// 5C + 3UC + 1R + 1L (guaranteed) + 2 variable slots = 12 cards
export const GUARANTEED_SLOTS = {
  common: 5,
  uncommon: 3,
  rare: 1,
  leader: 1,
} as const;

export const VARIABLE_SLOTS = 2;

// Variable slot weights based on real box rates:
// ~8-10 SR per box (24 packs) = ~0.375 SR per pack across 2 slots
// ~1 SEC per box = ~0.042 per pack across 2 slots
// Rest is filler (extra C/UC/R)
export const VARIABLE_WEIGHTS = {
  SEC: 0.02,   // ~1 per box (24 packs)
  SR: 0.19,    // ~8-10 per box
  L: 0.05,     // extra leader (beyond the guaranteed one)
  R: 0.20,     // extra rare
  FILLER: 0.54, // extra C/UC
} as const;

export const TCGPLAYER_PACK_IDS: Record<string, string> = {
  "OP-01": "450085",
  "OP-02": "455865",
  "OP-03": "477175",
  "OP-04": "485832",
  "OP-05": "498733",
  "OP-06": "515077",
  "OP-07": "532104",
  "OP-08": "542502",
  "OP-09": "563833",
  "OP-10": "586670",
  "OP-11": "620179",
  "OP-12": "628345",
  "OP-13": "628351",
  "OP14-EB04": "666577",
  "EB-01": "521160",
  "EB-02": "594068",
  "EB-03": "666727",
  "PRB-01": "545398",
  "PRB-02": "628451",
};

export function getPackImageUrl(setId: string): string {
  const productId = TCGPLAYER_PACK_IDS[setId];
  if (productId) {
    return `https://product-images.tcgplayer.com/fit-in/400x400/${productId}.jpg`;
  }
  const slug = setId.toLowerCase().replace(/-/g, "");
  return `https://en.onepiece-cardgame.com/images/products/boosters/${slug}/img_thumbnail.png`;
}
