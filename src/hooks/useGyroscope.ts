"use client";

import { useEffect, useRef, useState } from "react";

export function useGyroscope() {
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const betaRef = useRef(0);
  const gammaRef = useRef(0);

  useEffect(() => {
    setIsSupported("DeviceOrientationEvent" in window);
  }, []);

  const requestPermission = async () => {
    // iOS 13+ requires explicit permission
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission === "function") {
      try {
        const perm = await DOE.requestPermission();
        if (perm === "granted") {
          setHasPermission(true);
          return true;
        }
      } catch {
        return false;
      }
    } else {
      // Android / non-iOS — no permission needed
      setHasPermission(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!hasPermission) return;

    const handler = (e: DeviceOrientationEvent) => {
      betaRef.current = e.beta ?? 0; // front-back tilt (-180..180)
      gammaRef.current = e.gamma ?? 0; // left-right tilt (-90..90)
    };

    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [hasPermission]);

  // Returns CSS-compatible values from gyroscope
  const getGyroValues = () => {
    const x = ((gammaRef.current + 90) / 180) * 100; // normalize to 0-100
    const y = ((betaRef.current + 90) / 180) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return { isSupported, hasPermission, requestPermission, getGyroValues };
}
