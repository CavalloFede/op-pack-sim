"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Card } from "@/lib/types";
import { CardDisplay } from "./CardDisplay";
import { RarityBadge } from "@/components/ui/RarityBadge";
import styles from "./CardInspector.module.css";

interface CardInspectorProps {
  cards: Card[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function CardInspector({
  cards,
  currentIndex,
  onClose,
  onNavigate,
}: CardInspectorProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const isOpen = cards.length > 0 && currentIndex >= 0;
  const card = isOpen ? cards[currentIndex] : null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < cards.length - 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowLeft" && hasPrev) {
        onNavigate(currentIndex - 1);
        return;
      }

      if (e.key === "ArrowRight" && hasNext) {
        onNavigate(currentIndex + 1);
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const focusable = [closeRef, prevRef, nextRef]
          .filter((ref) => ref.current && !ref.current.hidden)
          .map((ref) => ref.current!);

        if (focusable.length === 0) return;

        const active = document.activeElement;
        const currentFocusIndex = focusable.indexOf(active as HTMLButtonElement);

        let nextIndex: number;
        if (e.shiftKey) {
          nextIndex =
            currentFocusIndex <= 0
              ? focusable.length - 1
              : currentFocusIndex - 1;
        } else {
          nextIndex =
            currentFocusIndex >= focusable.length - 1
              ? 0
              : currentFocusIndex + 1;
        }
        focusable[nextIndex].focus();
      }
    },
    [isOpen, onClose, hasPrev, hasNext, currentIndex, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

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
              ref={closeRef}
              className={styles.close}
              onClick={onClose}
              aria-label="Close inspector"
            >
              ✕
            </button>

            <div className={styles.nav}>
              {hasPrev && (
                <button
                  ref={prevRef}
                  className={`${styles.navButton} ${styles.navLeft}`}
                  onClick={() => onNavigate(currentIndex - 1)}
                  aria-label="Previous card"
                >
                  ‹
                </button>
              )}

              <div className={styles.cardArea}>
                <CardDisplay card={card} enableHolo />
              </div>

              {hasNext && (
                <button
                  ref={nextRef}
                  className={`${styles.navButton} ${styles.navRight}`}
                  onClick={() => onNavigate(currentIndex + 1)}
                  aria-label="Next card"
                >
                  ›
                </button>
              )}
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
              <span className={styles.counter}>
                {currentIndex + 1} / {cards.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
