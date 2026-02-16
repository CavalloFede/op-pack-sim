import { API_BASE_URL } from "./constants";
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
  attribute: string | null;
  card_text: string | null;
  life: string | null;
}

const TCGPLAYER_PACK_IDS: Record<string, string> = {
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

function getPackImageUrl(setId: string): string {
  const productId = TCGPLAYER_PACK_IDS[setId];
  if (productId) {
    return `https://product-images.tcgplayer.com/fit-in/400x400/${productId}.jpg`;
  }
  // Fallback to official site thumbnail
  const slug = setId.toLowerCase().replace(/-/g, "");
  return `https://en.onepiece-cardgame.com/images/products/boosters/${slug}/img_thumbnail.png`;
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
      attribute: c.attribute ?? undefined,
    };
  });
}
