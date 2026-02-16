"use client";

import { useRouter } from "next/navigation";
import type { CardSet } from "@/lib/types";
import { SetSelector } from "@/components/ui/SetSelector";
import { LangToggle } from "@/components/ui/LangToggle";
import styles from "./HomeClient.module.css";

export function HomeClient({ sets }: { sets: CardSet[] }) {
  const router = useRouter();

  const handleSelect = (setId: string) => {
    router.push(`/open?set=${setId}`);
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
            onSelect={handleSelect}
          />
        )}
      </section>

      {otherSets.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Extra & Premium</h2>
          <SetSelector
            sets={otherSets}
            onSelect={handleSelect}
          />
        </section>
      )}
    </main>
  );
}
