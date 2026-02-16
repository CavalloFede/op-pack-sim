"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "jp";

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  getImageUrl: (cardImageId: string) => string;
}>({
  lang: "en",
  setLang: () => {},
  getImageUrl: (id) => `https://en.onepiece-cardgame.com/images/cardlist/card/${id}.png`,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const getImageUrl = (cardImageId: string) => {
    const domain = lang === "en" ? "en.onepiece-cardgame.com" : "onepiece-cardgame.com";
    return `https://${domain}/images/cardlist/card/${cardImageId}.png`;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, getImageUrl }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
