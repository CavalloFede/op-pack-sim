"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { HoloTier } from "@/lib/types";
import { usePointerTrack } from "@/hooks/usePointerTrack";
import styles from "./CardDisplay.module.css";

interface CardDisplayProps {
  card: Card;
  onClick?: () => void;
  enableHolo?: boolean;
}

export function CardDisplay({ card, onClick, enableHolo = true }: CardDisplayProps) {
  const [loaded, setLoaded] = useState(false);
  const { onPointerMove, onPointerLeave } = usePointerTrack();

  const hasHolo = enableHolo && card.holoTier !== HoloTier.None;
  const holoClass = hasHolo ? `holo-${card.holoTier}` : "";

  return (
    <div
      className={`${styles.card} holo-card ${holoClass}`}
      onClick={onClick}
      onPointerMove={hasHolo ? onPointerMove : undefined}
      onPointerLeave={hasHolo ? onPointerLeave : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className={`${styles.inner} card-inner`}>
        <div className={styles.imageWrapper}>
          {!loaded && <div className={styles.skeleton} />}
          <img
            src={card.imageUrl}
            alt={card.name}
            className={`${styles.image} ${loaded ? styles.loaded : ""}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />
        </div>
        {hasHolo && (
          <>
            <div className="card-shine" />
            <div className="card-glare" />
          </>
        )}
      </div>
    </div>
  );
}
