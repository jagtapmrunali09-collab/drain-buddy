import { useLang } from "../context/LangContext.jsx";
import { LANGUAGES } from "../i18n/translations.js";

export default function LanguageSwitcher({ compact = false }) {
  const { lang, changeLang } = useLang();
  return (
    <select
      value={lang}
      onChange={(e) => changeLang(e.target.value)}
      aria-label="Change language"
      className={`rounded-full border border-line bg-white text-xs font-semibold text-subink px-3 py-1.5 outline-none focus:border-teal-500 cursor-pointer ${
        compact ? "" : "hidden sm:block"
      }`}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
