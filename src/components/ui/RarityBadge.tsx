import { Rarity } from "@/lib/types";
import styles from "./RarityBadge.module.css";

const RARITY_LABELS: Record<Rarity, string> = {
  [Rarity.Common]: "C",
  [Rarity.Uncommon]: "UC",
  [Rarity.Rare]: "R",
  [Rarity.Leader]: "L",
  [Rarity.SuperRare]: "SR",
  [Rarity.SecretRare]: "SEC",
  [Rarity.AltArt]: "ALT",
};

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span className={`${styles.badge} ${styles[rarity]}`}>
      {RARITY_LABELS[rarity]}
    </span>
  );
}
