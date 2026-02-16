"use client";

import { useLang } from "@/lib/langContext";
import styles from "./LangToggle.module.css";

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.option} ${lang === "en" ? styles.active : ""}`}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        className={`${styles.option} ${lang === "jp" ? styles.active : ""}`}
        onClick={() => setLang("jp")}
      >
        JP
      </button>
    </div>
  );
}
