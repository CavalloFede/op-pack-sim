import { Rarity } from "./types";
import type { Card } from "./types";
import { GUARANTEED_SLOTS, VARIABLE_SLOTS, VARIABLE_WEIGHTS } from "./constants";
import { getRarityOrder } from "./rarityConfig";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollVariableSlot(): Rarity {
  const roll = Math.random();
  let cumulative = 0;

  cumulative += VARIABLE_WEIGHTS.SEC;
  if (roll < cumulative) return Rarity.SecretRare;

  cumulative += VARIABLE_WEIGHTS.SR;
  if (roll < cumulative) return Rarity.SuperRare;

  cumulative += VARIABLE_WEIGHTS.L;
  if (roll < cumulative) return Rarity.Leader;

  cumulative += VARIABLE_WEIGHTS.R;
  if (roll < cumulative) return Rarity.Rare;

  // Filler: random C or UC
  return Math.random() < 0.5 ? Rarity.Common : Rarity.Uncommon;
}

export function generatePack(cards: Card[]): Card[] {
  const byRarity = new Map<Rarity, Card[]>();
  for (const card of cards) {
    const list = byRarity.get(card.rarity) || [];
    list.push(card);
    byRarity.set(card.rarity, list);
  }

  const pack: Card[] = [];

  const commons = byRarity.get(Rarity.Common) || [];
  const uncommons = byRarity.get(Rarity.Uncommon) || [];
  const rares = byRarity.get(Rarity.Rare) || [];
  const leaders = byRarity.get(Rarity.Leader) || [];

  // Guaranteed slots: 5C + 3UC + 1R + 1L
  for (let i = 0; i < GUARANTEED_SLOTS.common; i++) {
    if (commons.length) pack.push(pickRandom(commons));
  }
  for (let i = 0; i < GUARANTEED_SLOTS.uncommon; i++) {
    if (uncommons.length) pack.push(pickRandom(uncommons));
  }
  for (let i = 0; i < GUARANTEED_SLOTS.rare; i++) {
    if (rares.length) pack.push(pickRandom(rares));
  }
  for (let i = 0; i < GUARANTEED_SLOTS.leader; i++) {
    if (leaders.length) pack.push(pickRandom(leaders));
  }

  // Variable slots (2 slots with weighted RNG)
  for (let i = 0; i < VARIABLE_SLOTS; i++) {
    const targetRarity = rollVariableSlot();
    const pool = byRarity.get(targetRarity);

    if (pool && pool.length > 0) {
      pack.push(pickRandom(pool));
    } else {
      // Fallback to C/UC if target rarity pool is empty
      const fallback = commons.length ? commons : uncommons;
      if (fallback.length) pack.push(pickRandom(fallback));
    }
  }

  // Sort: best card last (highest rarity order) for anticipation
  pack.sort((a, b) => getRarityOrder(a.rarity) - getRarityOrder(b.rarity));

  return pack;
}
