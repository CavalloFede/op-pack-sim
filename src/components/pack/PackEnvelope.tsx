"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./PackEnvelope.module.css";

interface PackEnvelopeProps {
  setId: string;
  isTearing: boolean;
  onTear: () => void;
}

function getPackImageUrl(setId: string): string {
  const slug = setId.toLowerCase().replace(/-/g, "");
  return `https://en.onepiece-cardgame.com/images/products/boosters/${slug}/img_thumbnail.png`;
}

export function PackEnvelope({ setId, isTearing, onTear }: PackEnvelopeProps) {
  const packUrl = getPackImageUrl(setId);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <motion.button
        className={styles.pack}
        onClick={!isTearing ? onTear : undefined}
        animate={
          isTearing
            ? { scale: 1.2, opacity: 0 }
            : { y: [0, -8, 0] }
        }
        transition={
          isTearing
            ? { duration: 0.6, ease: "easeOut" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={!isTearing ? { scale: 1.05 } : undefined}
        whileTap={!isTearing ? { scale: 0.97 } : undefined}
        aria-label={`Open ${setId} booster pack`}
      >
        <div className={styles.packFace}>
          <Image
            src={packUrl}
            alt={`${setId} booster pack`}
            fill
            className={styles.packImg}
            unoptimized
            priority
          />
          <div className={styles.packGlow} />
        </div>
        {isTearing && (
          <>
            <motion.div
              className={`${styles.tearHalf} ${styles.tearTop}`}
              animate={{ y: -60, opacity: 0, rotateZ: -5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.div
              className={`${styles.tearHalf} ${styles.tearBottom}`}
              animate={{ y: 60, opacity: 0, rotateZ: 5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </>
        )}
      </motion.button>
      {!isTearing && (
        <motion.p
          className={styles.prompt}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap to open
        </motion.p>
      )}
    </motion.div>
  );
}
