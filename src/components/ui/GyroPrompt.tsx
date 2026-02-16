"use client";

import { useState } from "react";
import styles from "./GyroPrompt.module.css";

interface GyroPromptProps {
  onRequestPermission: () => Promise<boolean>;
}

export function GyroPrompt({ onRequestPermission }: GyroPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const handleEnable = async () => {
    setRequesting(true);
    const granted = await onRequestPermission();
    setRequesting(false);
    if (granted) {
      setDismissed(true);
    }
  };

  return (
    <div
      className={`${styles.prompt} ${dismissed ? styles.promptHidden : ""}`}
    >
      <span>Tilt your phone to see the holographic effect</span>
      <button
        className={styles.enableBtn}
        onClick={handleEnable}
        disabled={requesting}
      >
        {requesting ? "..." : "Enable"}
      </button>
      <button
        className={styles.dismissBtn}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
