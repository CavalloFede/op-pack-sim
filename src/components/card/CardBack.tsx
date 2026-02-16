"use client";

import styles from "./CardBack.module.css";

interface CardBackProps {
  variant: "blue" | "red";
}

export function CardBack({ variant }: CardBackProps) {
  return (
    <div className={`${styles.cardBack} ${styles[variant]}`}>
      {/* Repeating diagonal pattern */}
      <div className={styles.pattern} />

      {/* Ornate double border */}
      <div className={styles.border} />
      <div className={styles.borderInner} />

      {/* Corner flourishes */}
      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerTR}`} />
      <div className={`${styles.corner} ${styles.cornerBL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Edge accents */}
      <div className={styles.edgeAccentTop} />
      <div className={styles.edgeAccentBottom} />

      {/* Central glow */}
      <div className={variant === "blue" ? styles.glowBlue : styles.glowRed} />

      {/* Skull motif behind text */}
      <div className={styles.skull} />

      {/* Central diamond with text */}
      <div className={styles.diamond}>
        <div className={styles.textGroup}>
          <div className={styles.divider} />
          <span className={styles.title}>ONE PIECE</span>
          <span className={styles.subtitle}>CARD GAME</span>
          <div className={styles.divider} />
        </div>
      </div>
    </div>
  );
}
