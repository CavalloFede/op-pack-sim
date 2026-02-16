"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCardData } from "@/hooks/useCardData";
import { usePackGenerator } from "@/hooks/usePackGenerator";
import { PackWrapper } from "@/components/pack/PackWrapper";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { LangToggle } from "@/components/ui/LangToggle";
import styles from "./PackOpening.module.css";

export function PackOpening({ setId }: { setId: string }) {
  const router = useRouter();
  const { cards, isLoading, error } = useCardData(setId);
  const { pack, generate, isReady } = usePackGenerator(cards, setId);
  const [packCount, setPackCount] = useState(1);

  useEffect(() => {
    if (isReady && !pack) {
      generate();
    }
  }, [isReady, pack, generate]);

  const handleOpenAnother = useCallback(() => {
    generate();
    setPackCount((c) => c + 1);
  }, [generate]);

  if (isLoading) {
    return (
      <div className={styles.center}>
        <LoadingSpinner size={48} />
        <p className={styles.loadingText}>Loading {setId} cards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.errorText}>Error: {error}</p>
        <Button variant="ghost" onClick={() => router.push("/")}>
          Back to Sets
        </Button>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className={styles.center}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          ← Sets
        </Button>
        <span className={styles.setLabel}>{setId}</span>
        <LangToggle />
        <span className={styles.packCount}>Pack #{packCount}</span>
      </header>

      <PackWrapper pack={pack} onOpenAnother={handleOpenAnother} />
    </main>
  );
}
