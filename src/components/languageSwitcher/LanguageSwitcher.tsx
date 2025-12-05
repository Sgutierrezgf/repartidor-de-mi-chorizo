import { useTranslation } from "react-i18next";



export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLang = (lang: typeof i18n.language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => changeLang("es")}
        className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
      >
        ES
      </button>
      <button 
        onClick={() => changeLang("en")}
        className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
      >
        EN
      </button>
    </div>
  );
};
