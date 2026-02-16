"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimate } from "framer-motion";
import { getPackImageUrl } from "@/lib/constants";
import styles from "./PackEnvelope.module.css";

interface PackEnvelopeProps {
  setId: string;
  isTearing: boolean;
  onTear: () => void;
}

/**
 * Jagged clip-path polygons that simulate a torn foil edge.
 * The tear line sits at roughly 45-55% of the pack height.
 */
const TEAR_CLIP_TOP =
  "polygon(0% 0%, 100% 0%, 100% 48%, 93% 52%, 86% 46%, 78% 53%, 72% 48%, 64% 54%, 57% 47%, 50% 53%, 42% 46%, 35% 52%, 28% 47%, 21% 53%, 14% 48%, 7% 54%, 0% 49%)";

const TEAR_CLIP_BOTTOM =
  "polygon(0% 49%, 7% 54%, 14% 48%, 21% 53%, 28% 47%, 35% 52%, 42% 46%, 50% 53%, 57% 47%, 64% 54%, 72% 48%, 78% 53%, 86% 46%, 93% 52%, 100% 48%, 100% 100%, 0% 100%)";

export function PackEnvelope({ setId, isTearing, onTear }: PackEnvelopeProps) {
  const packUrl = getPackImageUrl(setId);
  const [packScope, animatePack] = useAnimate<HTMLButtonElement>();
  const tearStarted = useRef(false);
  const [showTear, setShowTear] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = packScope.current;
      if (!el || isTearing) return;
      const rect = el.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
    },
    [isTearing, packScope]
  );

  const handleMouseLeave = useCallback(() => {
    const el = packScope.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }, [packScope]);

  async function handleTear() {
    if (tearStarted.current) return;
    tearStarted.current = true;

    // Notify parent immediately so isTearing becomes true
    onTear();

    // Phase 1 — Shake/vibrate (0.2s)
    await animatePack(
      packScope.current,
      { x: [0, -4, 5, -6, 4, -3, 5, -2, 0] },
      { duration: 0.2, ease: "easeInOut" }
    );

    // Reset x and reveal tear halves + flash
    animatePack(packScope.current, { x: 0 }, { duration: 0 });
    setShowTear(true);
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <motion.button
        ref={packScope}
        className={styles.pack}
        onClick={!isTearing ? handleTear : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={
          !isTearing
            ? { y: [0, -8, 0] }
            : undefined
        }
        transition={
          !isTearing
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : undefined
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
          {!isTearing && <div className={styles.foilSheen} />}
        </div>

        {/* White flash burst at the moment of tear */}
        {showTear && (
          <motion.div
            className={styles.tearFlash}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        )}

        {/* Tear halves with jagged clip-paths */}
        {showTear && (
          <>
            {/* Top flap — peels back with 3D rotateX like opening a flap */}
            <motion.div
              className={`${styles.tearHalf} ${styles.tearTop}`}
              style={{
                clipPath: TEAR_CLIP_TOP,
                transformOrigin: "top center",
              }}
              initial={{ rotateX: 0, y: 0, opacity: 1 }}
              animate={{ rotateX: -80, y: -24, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.3, delay: 0.15, ease: "easeIn" },
              }}
            />
            {/* Bottom half — stays briefly then fades down */}
            <motion.div
              className={`${styles.tearHalf} ${styles.tearBottom}`}
              style={{ clipPath: TEAR_CLIP_BOTTOM }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 14, opacity: 0 }}
              transition={{
                duration: 0.2,
                delay: 0.35,
                ease: "easeIn",
              }}
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
