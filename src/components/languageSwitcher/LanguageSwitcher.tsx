import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const changeLang = (lang: "es" | "en") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex items-center gap-1 border rounded-lg px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
      <button
        onClick={() => changeLang("es")}
        className={`px-2 py-0.5 rounded text-sm font-medium transition 
          ${current === "es" ? "bg-red-500 text-white" : "text-gray-700 dark:text-gray-200"}`}
      >
        ES
      </button>
      <button
        onClick={() => changeLang("en")}
        className={`px-2 py-0.5 rounded text-sm font-medium transition 
          ${current === "en" ? "bg-red-500 text-white" : "text-gray-700 dark:text-gray-200"}`}
      >
        EN
      </button>
    </div>
  );
};
