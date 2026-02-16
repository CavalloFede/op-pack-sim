"use client";

import Image from "next/image";
import type { CardSet } from "@/lib/types";
import { useLang } from "@/lib/langContext";
import styles from "./SetSelector.module.css";

interface SetSelectorProps {
  sets: CardSet[];
  onSelect: (setId: string) => void;
}

export function SetSelector({ sets, onSelect }: SetSelectorProps) {
  const { getImageUrl } = useLang();

  return (
    <div className={styles.grid}>
      {sets.map((set) => (
        <button
          key={set.id}
          className={styles.card}
          onClick={() => onSelect(set.id)}
        >
          {set.coverImageId && (
            <div className={styles.coverWrap}>
              <Image
                src={getImageUrl(set.coverImageId)}
                alt={set.name}
                width={140}
                height={196}
                className={styles.coverImg}
                unoptimized
              />
            </div>
          )}
          <span className={styles.setCode}>{set.id}</span>
          <span className={styles.setName}>{set.name}</span>
        </button>
      ))}
    </div>
  );
}
