"use client";

import Image from "next/image";
import type { CardSet } from "@/lib/types";
import styles from "./SetSelector.module.css";

interface SetSelectorProps {
  sets: CardSet[];
  onSelect: (setId: string) => void;
}

export function SetSelector({ sets, onSelect }: SetSelectorProps) {
  return (
    <div className={styles.grid}>
      {sets.map((set) => (
        <button
          key={set.id}
          className={styles.card}
          onClick={() => onSelect(set.id)}
        >
          <div className={styles.coverWrap}>
            <Image
              src={set.packImage}
              alt={`${set.name} booster pack`}
              width={200}
              height={280}
              className={styles.coverImg}
              unoptimized
              priority
            />
          </div>
          <span className={styles.setCode}>{set.id}</span>
          <span className={styles.setName}>{set.name}</span>
        </button>
      ))}
    </div>
  );
}
