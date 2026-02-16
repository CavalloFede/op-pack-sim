"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/lib/types";
import { Rarity } from "@/lib/types";
import { CardBack } from "@/components/card/CardBack";
import styles from "./CardFan.module.css";

interface CardFanProps {
  cards: Card[];
  onFanComplete: () => void;
}

const STAGGER_DELAY = 0.06; // seconds between each card
const SPRING_CONFIG = {
  type: "spring" as const,
  damping: 18,
  stiffness: 160,
  mass: 0.8,
};

export function CardFan({ cards, onFanComplete }: CardFanProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<
    { x: number; y: number; rotation: number }[] | null
  >(null);

  // Measure card slot positions and compute offsets from viewport center
  const computeOffsets = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const slots = grid.querySelectorAll<HTMLElement>(`.${styles.cardSlot}`);
    if (slots.length === 0) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const newOffsets = Array.from(slots).map((slot, i) => {
      const rect = slot.getBoundingClientRect();
      const slotCx = rect.left + rect.width / 2;
      const slotCy = rect.top + rect.height / 2;

      // Offset FROM the slot TO the center (initial position relative to final)
      const x = cx - slotCx;
      const y = cy - slotCy;

      // Slight stacked offset so cards overlap like a deck in the center
      const stackOffset = (i - cards.length / 2) * 1.5;

      // Random-ish rotation for the flight (-12 to 12 degrees)
      const rotation = ((i % 5) - 2) * 5 + (i % 3) * 2;

      return {
        x: x + stackOffset,
        y: y + stackOffset * 0.5,
        rotation,
      };
    });

    setOffsets(newOffsets);
  }, [cards.length]);

  // Compute offsets once the grid has rendered
  useEffect(() => {
    // Use rAF to ensure layout is complete before measuring
    const raf = requestAnimationFrame(() => {
      computeOffsets();
    });
    return () => cancelAnimationFrame(raf);
  }, [computeOffsets]);

  // Fire onFanComplete after all cards have animated in
  useEffect(() => {
    if (!offsets) return;
    // Estimate total animation time: last card delay + spring settle time
    const totalTime = (cards.length - 1) * STAGGER_DELAY * 1000 + 600;
    const timer = setTimeout(onFanComplete, totalTime);
    return () => clearTimeout(timer);
  }, [offsets, cards.length, onFanComplete]);

  return (
    <div ref={gridRef} className={styles.grid}>
      {cards.map((card, i) => {
        const offset = offsets?.[i];
        // Before measurement, hide cards at center with opacity 0
        const initial = offset
          ? {
              x: offset.x,
              y: offset.y,
              rotate: offset.rotation,
              scale: 0.6,
              opacity: 1,
            }
          : { opacity: 0, scale: 0.6 };

        const animate = offset
          ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
          : { opacity: 0, scale: 0.6 };

        return (
          <motion.div
            key={`${card.id}-${i}`}
            className={styles.cardSlot}
            initial={initial}
            animate={animate}
            transition={{
              ...SPRING_CONFIG,
              delay: offset ? i * STAGGER_DELAY : 0,
            }}
          >
            <CardBack
              variant={card.rarity === Rarity.Leader ? "red" : "blue"}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
