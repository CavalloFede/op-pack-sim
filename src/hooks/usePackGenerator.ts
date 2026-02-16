"use client";

import { useState, useCallback } from "react";
import type { Card, PackResult } from "@/lib/types";
import { generatePack } from "@/lib/packGenerator";

export function usePackGenerator(cards: Card[], setId: string) {
  const [pack, setPack] = useState<PackResult | null>(null);

  const generate = useCallback(() => {
    if (cards.length === 0) return;
    const packCards = generatePack(cards);
    setPack({
      cards: packCards,
      setId,
      timestamp: Date.now(),
    });
  }, [cards, setId]);

  const isReady = cards.length > 0;

  return { pack, generate, isReady };
}
