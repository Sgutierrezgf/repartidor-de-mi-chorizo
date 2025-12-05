import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/chorizos.jpeg";
import { Button } from "../bottons/Button";
import { useGlobalContext } from "../../context/global.context";
import { supabase } from "../../utilities";
import DarkMode from "../darkMode/DarkMode";

export const NavBar = () => {
  const { auth, setAuth } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

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
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <img src={logo} alt="chorizos" className="h-10 w-10 rounded-full object-cover" />
          <h1 className="font-semibold">Flaco's sausage</h1>
        </div>

        {/* DarkMode — SOLO DESKTOP */}

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-6">
        <div className="hidden md:block">
          <DarkMode />
        </div>
          <li><Link className="hover:text-red-400 transition" to="/orders">Orders</Link></li>
          <li><Link className="hover:text-red-400 transition" to="/private/add-clients">Clients</Link></li>
          <li><Link className="hover:text-red-400 transition" to="/private/recipe">Recipe</Link></li>
          <li><Link className="hover:text-red-400 transition" to="/private/resume">Resume</Link></li>

          {auth.token && (
            <Button onClick={logout}>Logout</Button>
          )}
        </ul>
      </nav>

      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40 dark:bg-opacity-70"
        />
      )}

      {/* SIDEBAR MOBILE */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform
         ${isOpen ? "translate-x-0" : "-translate-x-full"}
         transition-transform duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <img src={logo} alt="chorizos" className="h-10 w-10 rounded-full object-cover" />

          <button
            onClick={() => setIsOpen(false)}
            className="text-white"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-4 py-6 text-lg">

          {/* DarkMode — SOLO MÓVIL */}
          <div className="md:hidden mb-3">
            <DarkMode />
          </div>

          <Link onClick={() => setIsOpen(false)} className="hover:text-red-400" to="/orders">Orders</Link>
          <Link onClick={() => setIsOpen(false)} className="hover:text-red-400" to="/private/add-clients">Clients</Link>
          <Link onClick={() => setIsOpen(false)} className="hover:text-red-400" to="/private/recipe">Recipe</Link>
          <Link onClick={() => setIsOpen(false)} className="hover:text-red-400" to="/private/resume">Resume</Link>

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
