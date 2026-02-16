"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import type { Card } from "@/lib/types";
import { CardDisplay } from "./CardDisplay";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { GyroPrompt } from "@/components/ui/GyroPrompt";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import styles from "./CardInspector.module.css";

interface CardInspectorProps {
  cards: Card[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Ref to the grid container so we can find source card positions */
  gridRef?: React.RefObject<HTMLDivElement | null>;
}

export function CardInspector({
  cards,
  currentIndex,
  onClose,
  onNavigate,
  gridRef,
}: CardInspectorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [firstPop, setFirstPop] = useState(true);

  const isOpen = cards.length > 0 && currentIndex >= 0;
  const card = isOpen ? cards[currentIndex] : null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < cards.length - 1;

  const gyro = useDeviceOrientation({ enabled: isOpen });
  const useGyro = gyro.isActive || gyro.needsPermission;

  // Capture source card rect when opening
  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      setOriginRect(null);
      setFirstPop(true);
      return;
    }

    // Find the source card element in the grid
    const gridEl = gridRef?.current;
    if (gridEl) {
      const slots = gridEl.querySelectorAll("[data-card-slot]");
      const sourceEl = slots[currentIndex] as HTMLElement | undefined;
      if (sourceEl) {
        setOriginRect(sourceEl.getBoundingClientRect());
      }
    }

    setIsAnimatingIn(true);
    // Small delay to let the origin position render, then animate to center
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
        setIsAnimatingIn(false);
      });
    });
  }, [isOpen, currentIndex, gridRef]);

  // Calculate transform to position card at center
  const getCardStyle = (): React.CSSProperties => {
    if (!isOpen) return {};

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Target: card centered, scaled to fit viewport
    const maxW = Math.min(vw * 0.7, 340);
    const maxH = vh * 0.55;
    const cardAspect = 63 / 88;
    let targetW = maxW;
    let targetH = targetW / cardAspect;
    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * cardAspect;
    }

    if (isAnimatingIn && originRect) {
      // Start at the source card's position
      return {
        position: "fixed",
        left: originRect.left,
        top: originRect.top,
        width: originRect.width,
        height: originRect.height,
        zIndex: 1000,
        transition: "none",
      };
    }

    return {
      position: "fixed",
      left: (vw - targetW) / 2,
      top: (vh - targetH) / 2 - 40,
      width: targetW,
      height: targetH,
      zIndex: 1000,
      transition: "all 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)",
      transform: firstPop && isVisible ? "rotateY(360deg)" : "rotateY(0deg)",
    };
  };

  // Mark first pop as done after animation
  useEffect(() => {
    if (isVisible && firstPop) {
      const timer = setTimeout(() => setFirstPop(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, firstPop]);

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
    },
    [isOpen, onClose, hasPrev, hasNext, currentIndex, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!card) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isVisible ? styles.backdropVisible : ""}`}
        onClick={onClose}
      />

      {/* Card flying to center */}
      <div
        ref={cardRef}
        className={styles.flyingCard}
        style={getCardStyle()}
      >
        <CardDisplay
          card={card}
          enableHolo
          elementRef={useGyro ? (gyro.ref as React.RefObject<HTMLDivElement>) : undefined}
          disablePointerTrack={gyro.isActive}
        />
      </div>

      {/* Meta info + nav (fades in after card arrives) */}
      <div
        className={`${styles.controls} ${isVisible ? styles.controlsVisible : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            className={`${styles.navButton} ${styles.navLeft}`}
            onClick={() => onNavigate(currentIndex - 1)}
            aria-label="Previous card"
          >
            ‹
          </button>
        )}

        {hasNext && (
          <button
            className={`${styles.navButton} ${styles.navRight}`}
            onClick={() => onNavigate(currentIndex + 1)}
            aria-label="Next card"
          >
            ›
          </button>
        )}

        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Close inspector"
        >
          ✕
        </button>

        <div className={styles.meta}>
          <h2 className={styles.name}>{card.name}</h2>
          <div className={styles.details}>
            <RarityBadge rarity={card.rarity} />
            <span className={styles.detail}>{card.cardNumber}</span>
            <span className={styles.detail}>{card.set}</span>
            {card.color && <span className={styles.detail}>{card.color}</span>}
            {card.type && <span className={styles.detail}>{card.type}</span>}
            {card.cost && <span className={styles.detail}>Cost: {card.cost}</span>}
            {card.power && <span className={styles.detail}>Power: {card.power}</span>}
          </div>
          <span className={styles.counter}>
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* iOS gyro permission prompt */}
      {gyro.needsPermission && isVisible && (
        <GyroPrompt onRequestPermission={gyro.requestPermission} />
      )}
    </>
  );
}
