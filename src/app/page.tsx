import { fetchAllSets } from "@/lib/api";
import type { CardSet } from "@/lib/types";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  let sets: CardSet[] = [];
  try {
    sets = await fetchAllSets();
  } catch {
    // Will show error state
  }

  return <HomeClient sets={sets} />;
}
