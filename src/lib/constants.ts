export const API_BASE_URL = "https://optcgapi.com/api";

export const PACK_SIZE = 12;

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
