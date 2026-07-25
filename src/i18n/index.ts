import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./es.json";
import en from "./en.json";

const stored =
  typeof window !== "undefined" ? localStorage.getItem("lang") : null;

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: stored === "en" || stored === "es" ? stored : "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export default i18n;
