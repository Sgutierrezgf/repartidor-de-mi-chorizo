import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/chorizos.jpeg";
import { Button } from "../bottons/Button";
import { useGlobalContext } from "../../context/global.context";
import { supabase } from "../../utilities";

export const NavBar = () => {
   const { auth, setAuth } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    setAuth({ user: null, token: null });
    
  };
  return (
    <>
      {/* NAVBAR TOP */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-gray-800 text-white shadow-lg">
        <div className="flex items-center gap-4">
          {/* Botón hamburguesa móvil */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white focus:outline-none"
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

          {/* Logo */}
          <img
            src={logo}
            alt="chorizos"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1>Los chorizos del flaco</h1>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          <li className="hover:text-red-400 transition-colors">
            <Link to="/orders">Orders</Link>
          </li>
          <li className="hover:text-red-400 transition-colors">
            <Link to="/private/add-clients">Clients</Link>
          </li>
          <li className="hover:text-red-400 transition-colors">
            <Link to="/private/recipe">Recipe</Link>
          </li>
          <li className="hover:text-red-400 transition-colors">
            <Link to="/private/resume">Resume</Link>
          </li>
        </ul>
        {/* {
          auth.token ?   <div className="hidden md:flex">
          <Button onClick={logout} >Logout</Button>
        </div> : null
        } */}

        {
          auth.token && <div className="hidden md:flex">
          <Button onClick={logout} >Logout</Button>
        </div>
        }
      
      </nav>

      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
        ></div>
      )}

      {/* SIDEBAR MOBILE */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <img
            src={logo}
            alt="chorizos"
            className="h-10 w-10 rounded-full object-cover"
          />

          <button
            onClick={() => setIsOpen(false)}
            className="text-white focus:outline-none"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-4 px-4 py-6 text-lg">
          <Link
            to="/Orders"
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Orders
          </Link>
          <Link
            to="/private/add-clients"
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Clients
          </Link>
          <Link
            to="/private/recipe"
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Recipe
          </Link>
          <Link
            to="/private/resume"
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Resume
          </Link>
          {
            auth.token && <div className="w-full mt-4">
            <Button onClick={logout} >Logout</Button>
          </div>
          }

        </nav>
      </aside>
    </>
  );
};
