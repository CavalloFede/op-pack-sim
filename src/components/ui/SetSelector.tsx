"use client";

import type { CardSet } from "@/lib/types";
import styles from "./SetSelector.module.css";

interface SetSelectorProps {
  sets: CardSet[];
  selectedId: string | null;
  onSelect: (setId: string) => void;
}

export function SetSelector({ sets, selectedId, onSelect }: SetSelectorProps) {
  return (
    <div className={styles.grid}>
      {sets.map((set) => {
        const isSelected = selectedId === set.id;
        return (
          <button
            key={set.id}
            className={`${styles.card} ${isSelected ? styles.selected : ""}`}
            onClick={() => onSelect(set.id)}
            aria-pressed={isSelected}
          >
            <span className={styles.setCode}>{set.id}</span>
            <span className={styles.setName}>{set.name}</span>
            {isSelected && <span className={styles.check}>✓</span>}
          </button>
        );
      })}
    </div>
  );
}
