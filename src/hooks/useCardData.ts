"use client";

import { useState, useEffect } from "react";
import type { Card } from "@/lib/types";
import { fetchSetCards } from "@/lib/api";

const cardCache = new Map<string, Card[]>();

function getSessionCache(setId: string): Card[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`cards-v2-${setId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Card[];
      cardCache.set(setId, parsed);
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function setSessionCache(setId: string, cards: Card[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`cards-v2-${setId}`, JSON.stringify(cards));
  } catch {
    // storage full, ignore
  }
}

export function useCardData(setId: string | null) {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) return;

    // Check memory cache first
    const memCached = cardCache.get(setId);
    if (memCached) {
      setCards(memCached);
      return;
    }

    // Check session cache
    const sessionCached = getSessionCache(setId);
    if (sessionCached) {
      setCards(sessionCached);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchSetCards(setId)
      .then((data) => {
        if (cancelled) return;
        cardCache.set(setId, data);
        setSessionCache(setId, data);
        setCards(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load cards");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setId]);

  return { cards, isLoading, error };
}
