import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

/** Compact theme + language controls styled for the notebook UI. */
export const PrefsControls = ({ className = "" }: { className?: string }) => {
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "es";

  const setLang = (next: "es" | "en") => {
    void i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="inline-flex rounded-md border border-line bg-paper p-0.5"
        role="group"
        aria-label={t("prefs.langEs")}
      >
        <button
          type="button"
          onClick={() => setLang("es")}
          className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
            lang === "es"
              ? "bg-blood text-surface"
              : "text-ink-muted hover:text-ink"
          }`}
          aria-pressed={lang === "es"}
          title={t("prefs.langEs")}
        >
          ES
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
            lang === "en"
              ? "bg-blood text-surface"
              : "text-ink-muted hover:text-ink"
          }`}
          aria-pressed={lang === "en"}
          title={t("prefs.langEn")}
        >
          EN
        </button>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex size-8 items-center justify-center rounded-md border border-line bg-paper text-ink transition-colors hover:bg-paper-deep"
        aria-label={isDark ? t("prefs.themeLight") : t("prefs.themeDark")}
        title={isDark ? t("prefs.themeLight") : t("prefs.themeDark")}
      >
        {isDark ? (
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z" />
          </svg>
        )}
      </button>
    </div>
  );
};
