import { API_BASE_URL, getPackImageUrl } from "./constants";
import type { Card, CardSet } from "./types";
import { HoloTier } from "./types";
import { parseRarity, getHoloTier } from "./rarityConfig";

interface ApiSet {
  set_name: string;
  set_id: string;
}

interface ApiCard {
  card_name: string;
  card_set_id: string;
  rarity: string;
  card_image: string;
  card_image_id: string;
  set_id: string;
  set_name: string;
  card_color: string;
  card_type: string;
  card_cost: string | null;
  card_power: string | null;
  market_price: string | null;
}

export async function fetchAllSets(): Promise<CardSet[]> {
  const res = await fetch(`${API_BASE_URL}/allSets/`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch sets: ${res.status}`);
  }

  const data: ApiSet[] = await res.json();

  return data.map((s) => ({
    id: s.set_id,
    name: s.set_name,
    packImage: getPackImageUrl(s.set_id),
  }));
}

export async function fetchSetCards(setId: string): Promise<Card[]> {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch cards for ${setId}: ${res.status}`);
  }

  const data: ApiCard[] = await res.json();

  return data.map((c) => {
    const rarity = parseRarity(c.rarity);
    const isParallel = c.card_name.includes("(Parallel)");
    // Parallel cards get the alt-art holo treatment regardless of base rarity
    const holoTier = isParallel ? HoloTier.AltArt : getHoloTier(rarity);
    return {
      id: c.card_set_id,
      name: c.card_name,
      cardNumber: c.card_set_id,
      rarity,
      holoTier,
      imageUrl: c.card_image_id,
      set: c.set_id,
      color: c.card_color,
      type: c.card_type,
      cost: c.card_cost ?? undefined,
      power: c.card_power ?? undefined,
      marketPrice: c.market_price ? parseFloat(c.market_price) : undefined,
    };
  });
}
