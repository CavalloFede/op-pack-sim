"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DeviceOrientationOptions {
  maxRotation?: number;
  enabled?: boolean;
}

interface DeviceOrientationResult {
  ref: React.RefObject<HTMLElement | null>;
  isSupported: boolean;
  needsPermission: boolean;
  requestPermission: () => Promise<boolean>;
  isActive: boolean;
}

// iOS 13+ requires explicit permission
function hasPermissionAPI(): boolean {
  return (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
      .requestPermission === "function"
  );
}

function getPermissionCached(): string | null {
  try {
    return sessionStorage.getItem("gyro-permission");
  } catch {
    return null;
  }
}

function setPermissionCached(value: string) {
  try {
    sessionStorage.setItem("gyro-permission", value);
  } catch {
    // ignore
  }
}

export function useDeviceOrientation({
  maxRotation = 15,
  enabled = true,
}: DeviceOrientationOptions = {}): DeviceOrientationResult {
  const elementRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 50, y: 50 });
  const currentRef = useRef({ x: 50, y: 50 });

  const [isSupported, setIsSupported] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Check support on mount
  useEffect(() => {
    const supported =
      typeof window !== "undefined" && "DeviceOrientationEvent" in window;
    setIsSupported(supported);

    if (supported && hasPermissionAPI()) {
      const cached = getPermissionCached();
      if (cached === "granted") {
        setNeedsPermission(false);
      } else if (cached === "denied") {
        setNeedsPermission(false);
      } else {
        setNeedsPermission(true);
      }
    }
  }, []);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const updateCSSVars = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;

    const lerp = 0.1;
    currentRef.current.x +=
      (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y +=
      (targetRef.current.y - currentRef.current.y) * lerp;

    const { x, y } = currentRef.current;
    const rotateY = ((x - 50) / 50) * maxRotation;
    const rotateX = ((y - 50) / 50) * -maxRotation;

    el.style.setProperty("--pointer-x", `${x}%`);
    el.style.setProperty("--pointer-y", `${y}%`);
    el.style.setProperty("--rotate-x", `${rotateX}deg`);
    el.style.setProperty("--rotate-y", `${rotateY}deg`);
    el.style.setProperty("--card-opacity", "1");

    const dx = Math.abs(targetRef.current.x - currentRef.current.x);
    const dy = Math.abs(targetRef.current.y - currentRef.current.y);
    if (dx > 0.1 || dy > 0.1) {
      rafRef.current = requestAnimationFrame(updateCSSVars);
    }
  }, [maxRotation]);

  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (prefersReducedMotion.current) return;

      const beta = e.beta ?? 0; // front/back tilt: -180..180
      const gamma = e.gamma ?? 0; // left/right tilt: -90..90

      // Deadzone: ignore small angles when phone is roughly flat
      const DEADZONE = 5;
      const effectiveBeta =
        Math.abs(beta) < DEADZONE ? 0 : beta - Math.sign(beta) * DEADZONE;
      const effectiveGamma =
        Math.abs(gamma) < DEADZONE ? 0 : gamma - Math.sign(gamma) * DEADZONE;

      // Map ±45deg range to 0..100
      const RANGE = 45;
      const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

      targetRef.current.x = clamp(
        (effectiveGamma / RANGE) * 50 + 50,
        0,
        100
      );
      targetRef.current.y = clamp(
        (effectiveBeta / RANGE) * 50 + 50,
        0,
        100
      );

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCSSVars);
    },
    [updateCSSVars]
  );

  // Start/stop listening
  useEffect(() => {
    if (!enabled || !isSupported) {
      setIsActive(false);
      return;
    }

    // If iOS and needs permission (not yet granted), don't listen
    if (hasPermissionAPI() && getPermissionCached() !== "granted") {
      setIsActive(false);
      return;
    }

    window.addEventListener("deviceorientation", handleOrientation);
    setIsActive(true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      cancelAnimationFrame(rafRef.current);
      setIsActive(false);

      // Reset card opacity when disabling
      const el = elementRef.current;
      if (el) {
        el.style.setProperty("--card-opacity", "0");
      }
    };
  }, [enabled, isSupported, handleOrientation]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!hasPermissionAPI()) return false;

    try {
      const result = await (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission();

      setPermissionCached(result);

      if (result === "granted") {
        setNeedsPermission(false);
        return true;
      } else {
        setNeedsPermission(false); // hide prompt even if denied
        return false;
      }
    } catch {
      setNeedsPermission(false);
      return false;
    }
  }, []);

  return {
    ref: elementRef as React.RefObject<HTMLElement | null>,
    isSupported,
    needsPermission,
    requestPermission,
    isActive,
  };
}
