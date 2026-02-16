"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { PackResult, PackState } from "@/lib/types";
import { Rarity } from "@/lib/types";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { PackEnvelope } from "./PackEnvelope";
import { CardFan } from "./CardFan";
import { CardReveal } from "./CardReveal";
import { Button } from "@/components/ui/Button";
import styles from "./PackWrapper.module.css";

interface PackWrapperProps {
  pack: PackResult;
  onOpenAnother: () => void;
}

export function PackWrapper({ pack, onOpenAnother }: PackWrapperProps) {
  const [state, setState] = useState<PackState>("sealed");
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const handleTear = useCallback(() => {
    setState("tearing");
    setTimeout(() => setState("fanning"), 600);
  }, []);

  const handleFanComplete = useCallback(() => {
    setState("revealing");
  }, []);

  const handleRevealCard = useCallback((index: number) => {
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      if (next.size === pack.cards.length) {
        setTimeout(() => setState("summary"), 500);
      }
      return next;
    });
  }, [pack.cards.length]);

  const handleRevealAll = useCallback(() => {
    const all = new Set(pack.cards.map((_, i) => i));
    setRevealedIndices(all);
    setTimeout(() => setState("summary"), 300);
  }, [pack.cards]);

  const handleOpenAnother = useCallback(() => {
    setState("sealed");
    setRevealedIndices(new Set());
    onOpenAnother();
  }, [onOpenAnother]);

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        {(state === "sealed" || state === "tearing") && (
          <PackEnvelope
            key="envelope"
            setId={pack.setId}
            isTearing={state === "tearing"}
            onTear={handleTear}
          />
        )}

        {(state === "fanning" || state === "revealing" || state === "summary") && (
          <div key="cards" className={styles.cardsArea}>
            {state === "fanning" ? (
              <CardFan
                cards={pack.cards}
                onFanComplete={handleFanComplete}
              />
            ) : (
              <>
                <CardReveal
                  cards={pack.cards}
                  revealedIndices={revealedIndices}
                  onRevealCard={handleRevealCard}
                  isSummary={state === "summary"}
                />
                {state === "revealing" && (
                  <div className={styles.actions}>
                    <Button variant="ghost" size="sm" onClick={handleRevealAll}>
                      Reveal All ({pack.cards.length - revealedIndices.size} remaining)
                    </Button>
                  </div>
                )}
                {state === "summary" && (
                  <>
                    <div className={styles.summary}>
                      {Object.values(Rarity).map((rarity) => {
                        const count = pack.cards.filter((c) => c.rarity === rarity).length;
                        if (count === 0) return null;
                        return (
                          <span key={rarity} className={styles.summaryItem}>
                            <RarityBadge rarity={rarity} /> ×{count}
                          </span>
                        );
                      })}
                    </div>
                    <div className={styles.actions}>
                      <Button size="lg" onClick={handleOpenAnother}>
                        Open Another Pack
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
