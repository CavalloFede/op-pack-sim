"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { HoloTier } from "@/lib/types";
import { usePointerTrack } from "@/hooks/usePointerTrack";
import { useLang } from "@/lib/langContext";
import styles from "./CardDisplay.module.css";

interface CardDisplayProps {
  card: Card;
  onClick?: () => void;
  enableHolo?: boolean;
  /** External ref for gyro hook to target the card element */
  elementRef?: React.Ref<HTMLDivElement>;
  /** When true, skip pointer event handlers (gyro takes over) */
  disablePointerTrack?: boolean;
}

export function CardDisplay({
  card,
  onClick,
  enableHolo = true,
  elementRef,
  disablePointerTrack = false,
}: CardDisplayProps) {
  const [loaded, setLoaded] = useState(false);
  const { onPointerMove, onPointerLeave } = usePointerTrack();
  const { getImageUrl } = useLang();

  const hasHolo = enableHolo && card.holoTier !== HoloTier.None;
  const holoClass = hasHolo ? `holo-${card.holoTier}` : "";
  const usePointer = hasHolo && !disablePointerTrack;

  return (
    <div
      ref={elementRef}
      className={`${styles.card} holo-card ${holoClass}`}
      onClick={onClick}
      onPointerMove={usePointer ? onPointerMove : undefined}
      onPointerLeave={usePointer ? onPointerLeave : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className={`${styles.inner} card-inner`}>
        <div className={styles.imageWrapper}>
          {!loaded && <div className={styles.skeleton} />}
          <img
            src={getImageUrl(card.imageUrl)}
            alt={card.name}
            className={`${styles.image} ${loaded ? styles.loaded : ""}`}
            onLoad={() => setLoaded(true)}
            loading="eager"
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
