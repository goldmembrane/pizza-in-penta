import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 언어 리소스 import
import en from "./en";
import ko from "./ko";
import ja from "./ja";
import es from "./es";
import zh from "./zh";
import de from "./de";
import fr from "./fr";
import it from "./it";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    detection: {
      order: ["navigator", "htmlTag"],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en,
      ko,
      ja,
      es,
      zh,
      de,
      fr,
      it,
    },
  });

export default i18n;
