import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../bottons/Button";
import { PrefsControls } from "../prefs/PrefsControls";
import { supabase } from "../../utilities";
import { useGlobalContext } from "../../context/global.context";

export const NavBar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useGlobalContext();

  const links = [
    { to: "/private/ventas", label: t("nav.ventas") },
    { to: "/private/envios", label: t("nav.envios") },
    { to: "/private/receta", label: t("nav.receta") },
    { to: "/private/resumen", label: t("nav.resumen") },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setAuth({ user: null, token: null });
    setOpen(false);
    setLoggingOut(false);
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${
      isActive ? "text-blood font-semibold" : "text-ink-muted hover:text-ink"
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="text-ink md:hidden"
              aria-label={t("nav.openMenu")}
              onClick={() => setOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img
              src="/chorizos.svg"
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-line bg-paper"
            />
            <div className="min-w-0 leading-tight">
              <p className="font-display truncate text-sm font-bold text-ink sm:text-base">
                {t("brand.title")}
              </p>
              <p className="hidden truncate text-xs text-ink-muted sm:block">
                {t("brand.subtitle")}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-5 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <PrefsControls className="hidden sm:flex" />
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? t("nav.loggingOut") : t("nav.logout")}
            </Button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-line bg-surface transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="font-display font-bold">{t("nav.menu")}</p>
          <button
            type="button"
            aria-label={t("nav.closeMenu")}
            onClick={() => setOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-4 py-6 text-lg">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <PrefsControls className="mt-2" />
          <Button
            variant="ghost"
            className="mt-2 w-full"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? t("nav.loggingOut") : t("nav.logout")}
          </Button>
        </nav>
      </aside>
    </>
  );
};
