import { Rarity, HoloTier } from "./types";
import { RARITY_ORDER } from "./constants";

const RARITY_MAP: Record<string, Rarity> = {
  C: Rarity.Common,
  Common: Rarity.Common,
  UC: Rarity.Uncommon,
  Uncommon: Rarity.Uncommon,
  R: Rarity.Rare,
  Rare: Rarity.Rare,
  L: Rarity.Leader,
  Leader: Rarity.Leader,
  SR: Rarity.SuperRare,
  "Super Rare": Rarity.SuperRare,
  SEC: Rarity.SecretRare,
  "Secret Rare": Rarity.SecretRare,
  SP: Rarity.AltArt,
  "Special Art": Rarity.AltArt,
  "Alternate Art": Rarity.AltArt,
  ALT: Rarity.AltArt,
  P: Rarity.Common,
  Promo: Rarity.Common,
};

const HOLO_TIER_MAP: Record<Rarity, HoloTier> = {
  [Rarity.Common]: HoloTier.None,
  [Rarity.Uncommon]: HoloTier.None,
  [Rarity.Rare]: HoloTier.Rare,
  [Rarity.Leader]: HoloTier.Leader,
  [Rarity.SuperRare]: HoloTier.SuperRare,
  [Rarity.SecretRare]: HoloTier.SecretRare,
  [Rarity.AltArt]: HoloTier.AltArt,
};

export function parseRarity(raw: string): Rarity {
  return RARITY_MAP[raw] ?? Rarity.Common;
}

export function getHoloTier(rarity: Rarity): HoloTier {
  return HOLO_TIER_MAP[rarity];
}

export function getRarityOrder(rarity: Rarity): number {
  const idx = RARITY_ORDER.indexOf(rarity as (typeof RARITY_ORDER)[number]);
  return idx === -1 ? 0 : idx;
}
