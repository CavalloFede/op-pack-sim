"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CardSet } from "@/lib/types";
import { SetSelector } from "@/components/ui/SetSelector";
import { Button } from "@/components/ui/Button";
import { LangToggle } from "@/components/ui/LangToggle";
import styles from "./HomeClient.module.css";

export function HomeClient({ sets }: { sets: CardSet[] }) {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const router = useRouter();

  const handleOpen = () => {
    if (selectedSet) {
      router.push(`/open?set=${selectedSet}`);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>OP Pack Sim</h1>
        <p className={styles.subtitle}>
          Open One Piece TCG booster packs with holographic card effects
        </p>
        <LangToggle />
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose a Set</h2>
        {sets.length === 0 ? (
          <p className={styles.error}>Failed to load sets. Please refresh.</p>
        ) : (
          <SetSelector
            sets={sets}
            selectedId={selectedSet}
            onSelect={setSelectedSet}
          />
        )}
      </section>

      <div className={styles.actions}>
        <Button
          size="lg"
          disabled={!selectedSet}
          onClick={handleOpen}
        >
          Open Pack
        </Button>
      </div>
    </main>
  );
}
