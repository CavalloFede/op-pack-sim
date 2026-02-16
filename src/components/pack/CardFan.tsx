"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/lib/types";
import styles from "./CardFan.module.css";

interface CardFanProps {
  cards: Card[];
  onFanComplete: () => void;
}

export function CardFan({ cards, onFanComplete }: CardFanProps) {
  useEffect(() => {
    const timer = setTimeout(onFanComplete, 800 + cards.length * 60);
    return () => clearTimeout(timer);
  }, [cards.length, onFanComplete]);

  return (
    <div className={styles.grid}>
      {cards.map((card, i) => (
        <motion.div
          key={`${card.id}-${i}`}
          className={styles.cardSlot}
          initial={{ scale: 0, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 200,
            delay: i * 0.06,
          }}
        >
          <div className={styles.cardBack}>
            <div className={styles.cardBackPattern}>
              <span className={styles.cardBackText}>OP</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
