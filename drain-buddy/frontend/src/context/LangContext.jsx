import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "../i18n/translations.js";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("db_lang") || "en");

  function changeLang(code) {
    setLang(code);
    localStorage.setItem("db_lang", code);
  }

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en;
    return (key) => dict[key] || translations.en[key] || key;
  }, [lang]);

  return <LangContext.Provider value={{ lang, changeLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
