import React, { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";


export interface AuthState{
    user: User | null;
    token: string | null;
}

interface GlobalContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const GlobalContext = createContext<GlobalContextType>({
  auth: { user: null, token: null },
  setAuth: () => {},
});

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};
