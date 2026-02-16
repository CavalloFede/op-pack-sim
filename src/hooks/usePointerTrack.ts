"use client";

import { useCallback, useRef } from "react";

interface PointerTrackOptions {
  maxRotation?: number;
}

export function usePointerTrack({ maxRotation = 15 }: PointerTrackOptions = {}) {
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 50, y: 50 });
  const currentRef = useRef({ x: 50, y: 50 });
  const elementRef = useRef<HTMLElement | null>(null);

  const updateCSSVars = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;

    // Spring interpolation
    const lerp = 0.1;
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;

    const { x, y } = currentRef.current;
    const rotateY = ((x - 50) / 50) * maxRotation;
    const rotateX = ((y - 50) / 50) * -maxRotation;

    el.style.setProperty("--pointer-x", `${x}%`);
    el.style.setProperty("--pointer-y", `${y}%`);
    el.style.setProperty("--rotate-x", `${rotateX}deg`);
    el.style.setProperty("--rotate-y", `${rotateY}deg`);
    el.style.setProperty("--card-opacity", "1");

    // Continue animating if there's still difference
    const dx = Math.abs(targetRef.current.x - currentRef.current.x);
    const dy = Math.abs(targetRef.current.y - currentRef.current.y);
    if (dx > 0.1 || dy > 0.1) {
      rafRef.current = requestAnimationFrame(updateCSSVars);
    }
  }, [maxRotation]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = e.currentTarget;
      elementRef.current = el;
      const rect = el.getBoundingClientRect();
      targetRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      targetRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCSSVars);
    },
    [updateCSSVars]
  );

  const onPointerLeave = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = e.currentTarget;
      elementRef.current = el;
      targetRef.current.x = 50;
      targetRef.current.y = 50;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCSSVars);

      // After settling, remove active state
      setTimeout(() => {
        el.style.setProperty("--card-opacity", "0");
      }, 300);
    },
    [updateCSSVars]
  );

  return { onPointerMove, onPointerLeave };
}
