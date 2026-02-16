export const API_BASE_URL = "https://optcgapi.com/api";

export const PACK_SIZE = 12;

export const CARD_ASPECT_RATIO = 63 / 88; // width / height

export const RARITY_ORDER = ["C", "UC", "R", "L", "SR", "SEC", "ALT"] as const;

export const GUARANTEED_SLOTS = {
  common: 5,
  uncommon: 3,
  rare: 1,
} as const;

export const VARIABLE_SLOTS = 3;

export const VARIABLE_WEIGHTS = {
  SEC: 0.015,
  SR: 0.12,
  ALT: 0.10,
  L: 0.30,
  FILLER: 0.465,
} as const;
