export enum Rarity {
  Common = "C",
  Uncommon = "UC",
  Rare = "R",
  Leader = "L",
  SuperRare = "SR",
  SecretRare = "SEC",
  AltArt = "ALT",
}

export enum HoloTier {
  None = "none",
  Rare = "rare",
  Leader = "leader",
  SuperRare = "super-rare",
  SecretRare = "secret-rare",
  AltArt = "alt-art",
}

export interface Card {
  id: string;
  name: string;
  cardNumber: string;
  rarity: Rarity;
  holoTier: HoloTier;
  imageUrl: string;
  set: string;
  color?: string;
  type?: string;
  cost?: string;
  power?: string;
  attribute?: string;
}

export interface CardSet {
  id: string;
  name: string;
  coverImageId?: string;
}

export interface PackResult {
  cards: Card[];
  setId: string;
  timestamp: number;
}

export type PackState = "sealed" | "tearing" | "fanning" | "revealing" | "summary";
