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
      {sets.map((set) => (
        <button
          key={set.id}
          className={`${styles.card} ${selectedId === set.id ? styles.selected : ""}`}
          onClick={() => onSelect(set.id)}
        >
          <span className={styles.setId}>{set.id}</span>
          <span className={styles.setName}>{set.name}</span>
        </button>
      ))}
    </div>
  );
}
