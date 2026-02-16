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

  const selectedName = sets.find((s) => s.id === selectedSet)?.name;

  const handleOpen = () => {
    if (selectedSet) {
      router.push(`/open?set=${selectedSet}`);
    }
  };

  // Separate booster sets from extra/premium
  const boosterSets = sets.filter(
    (s) => s.id.startsWith("OP") && !s.id.includes("-EB")
  );
  const otherSets = sets.filter(
    (s) => !s.id.startsWith("OP") || s.id.includes("-EB")
  );

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>OP Pack Sim</h1>
          <LangToggle />
        </div>
        <p className={styles.subtitle}>
          Open One Piece TCG booster packs with holographic card effects
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Booster Sets</h2>
        {sets.length === 0 ? (
          <p className={styles.error}>Failed to load sets. Please refresh.</p>
        ) : (
          <SetSelector
            sets={boosterSets}
            selectedId={selectedSet}
            onSelect={setSelectedSet}
          />
        )}
      </section>

      {otherSets.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Extra & Premium</h2>
          <SetSelector
            sets={otherSets}
            selectedId={selectedSet}
            onSelect={setSelectedSet}
          />
        </section>
      )}

      <div className={styles.actions}>
        <Button
          size="lg"
          disabled={!selectedSet}
          onClick={handleOpen}
        >
          {selectedSet ? `Open ${selectedSet} Pack` : "Select a Set"}
        </Button>
        {selectedName && (
          <p className={styles.selectedLabel}>{selectedName}</p>
        )}
      </div>
    </main>
  );
}
