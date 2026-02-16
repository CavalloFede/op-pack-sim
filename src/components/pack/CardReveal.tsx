"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/lib/types";
import { HoloTier } from "@/lib/types";
import { CardDisplay } from "@/components/card/CardDisplay";
import { CardInspector } from "@/components/card/CardInspector";
import { RarityBadge } from "@/components/ui/RarityBadge";
import styles from "./CardReveal.module.css";

interface CardRevealProps {
  cards: Card[];
  revealedIndices: Set<number>;
  onRevealCard: (index: number) => void;
  isSummary: boolean;
}

export function CardReveal({
  cards,
  revealedIndices,
  onRevealCard,
  isSummary,
}: CardRevealProps) {
  const [inspectedIndex, setInspectedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");

  return (
    <>
      <div aria-live="polite" className={styles.srOnly}>
        {announcement}
      </div>
      <div className={styles.grid}>
        {cards.map((card, i) => {
          const isRevealed = revealedIndices.has(i);
          const isSpecial = card.holoTier !== HoloTier.None;

          return (
            <div key={`${card.id}-${i}`} className={styles.cardSlot}>
              <div
                className={`${styles.flipContainer} ${isRevealed ? styles.flipped : ""}`}
                onClick={() => {
                  if (!isRevealed) {
                    onRevealCard(i);
                    setAnnouncement(`${card.name} - ${card.rarity}`);
                  } else {
                    setInspectedIndex(i);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!isRevealed) {
                      onRevealCard(i);
                      setAnnouncement(`${card.name} - ${card.rarity}`);
                    } else {
                      setInspectedIndex(i);
                    }
                  }
                }}
                aria-label={isRevealed ? `Inspect ${card.name}` : "Tap to reveal card"}
              >
                <div className={styles.flipBack}>
                  <div className={styles.cardBack}>
                    <div className={styles.cardBackPattern}>
                      <span className={styles.cardBackText}>OP</span>
                    </div>
                  </div>
                </div>
                <div className={styles.flipFront}>
                  {isRevealed && (
                    <motion.div
                      initial={{ scale: isSpecial ? 1.1 : 1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className={styles.cardContainer}
                    >
                      <CardDisplay card={card} />
                      {isSummary && (
                        <div className={styles.cardInfo}>
                          <RarityBadge rarity={card.rarity} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {isRevealed && isSpecial && (
                <div className={styles.particles}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <motion.div
                      key={j}
                      className={styles.particle}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((j / 8) * Math.PI * 2) * 60,
                        y: Math.sin((j / 8) * Math.PI * 2) * 60,
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CardInspector
        cards={cards}
        currentIndex={inspectedIndex}
        onClose={() => setInspectedIndex(-1)}
        onNavigate={setInspectedIndex}
      />
    </>
  );
}
