"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Card } from "@/lib/types";
import { CardDisplay } from "./CardDisplay";
import { RarityBadge } from "@/components/ui/RarityBadge";
import styles from "./CardInspector.module.css";

interface CardInspectorProps {
  card: Card | null;
  onClose: () => void;
}

export function CardInspector({ card, onClose }: CardInspectorProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (card) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [card, handleKeyDown]);

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-label={`Inspecting ${card.name}`}
          aria-modal="true"
        >
          <motion.div
            className={styles.content}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.close}
              onClick={onClose}
              aria-label="Close inspector"
            >
              ✕
            </button>

            <div className={styles.cardArea}>
              <CardDisplay card={card} enableHolo />
            </div>

            <div className={styles.meta}>
              <h2 className={styles.name}>{card.name}</h2>
              <div className={styles.details}>
                <RarityBadge rarity={card.rarity} />
                <span className={styles.detail}>{card.cardNumber}</span>
                <span className={styles.detail}>{card.set}</span>
                {card.color && (
                  <span className={styles.detail}>{card.color}</span>
                )}
                {card.type && (
                  <span className={styles.detail}>{card.type}</span>
                )}
                {card.cost && (
                  <span className={styles.detail}>Cost: {card.cost}</span>
                )}
                {card.power && (
                  <span className={styles.detail}>Power: {card.power}</span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
