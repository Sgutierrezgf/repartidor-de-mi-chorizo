import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/chorizos.jpeg";
import { Button } from "../bottons/Button";
import { useGlobalContext } from "../../context/global.context";
import { supabase } from "../../utilities";
import DarkMode from "../darkMode/DarkMode";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../languageSwitcher/LanguageSwitcher";

export const NavBar = () => {
  const { auth, setAuth } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const logout = async () => {
    await supabase.auth.signOut();
    setAuth({ user: null, token: null });
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-white shadow-lg dark:bg-gray-900 dark:text-white">
        {/* Logo + Hamburguesa */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-gray-800 dark:text-gray-200"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <img
            src={logo}
            alt="chorizos"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="font-semibold">{t("navbar.title")}</h1>
        </div>

        {/* DarkMode — SOLO DESKTOP */}

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <DarkMode />
            <LanguageSwitcher />
          </div>

          <li>
            <Link className="hover:text-red-400 transition" to="/orders">
              {t("navbar.orders")}
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-red-400 transition"
              to="/private/add-clients"
            >
              {t("navbar.clients")}
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-red-400 transition"
              to="/private/recipe"
            >
              {t("navbar.recipe")}
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-red-400 transition"
              to="/private/resume"
            >
              {t("navbar.resume")}
            </Link>
          </li>

          {auth.token && <Button onClick={logout}>Logout</Button>}
        </ul>
      </nav>

      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-opacity-40 md:hidden z-40 dark:bg-opacity-70"
        />
      )}

      {/* SIDEBAR MOBILE */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform
         ${isOpen ? "translate-x-0" : "-translate-x-full"}
         transition-transform duration-300 ease-in-out md:hidden dark:bg-gray-800`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <img
            src={logo}
            alt="chorizos"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="px-2" >{t("navbar.title")}</h1>
          <button onClick={() => setIsOpen(false)} className="text-white">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-4 py-6 text-lg">
          {/* DarkMode — SOLO MÓVIL */}
          <div className="flex flex-col gap-4 md:hidden mb-4">
            <DarkMode />
            <LanguageSwitcher />
          </div>

          <Link
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400"
            to="/orders"
          >
            {t("navbar.orders")}
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400"
            to="/private/add-clients"
          >
            {t("navbar.clients")}
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400"
            to="/private/recipe"
          >
            {t("navbar.recipe")}
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400"
            to="/private/resume"
          >
            {t("navbar.resume")}
          </Link>

          {auth.token && (
            <div className="mt-6">
              <Button onClick={logout}>Logout</Button>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
