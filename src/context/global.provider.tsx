import { type ReactNode, useEffect, useState } from "react";
import { GlobalContext } from "./global.context";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../utilities";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialAuth: AuthState = {
  user: null,
  token: null,
};

interface GlobalProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProps) => {
  const [auth, setAuth] = useState<AuthState>(initialAuth);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setAuth({
          user: session.user,
          token: session.access_token,
        });
      }

      setLoading(false); 
    };

    loadSession();
  }, []);

  
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setAuth({
            user: session.user,
            token: session.access_token,
          });
        } else {
          setAuth(initialAuth);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  
  if (loading) return <div>Cargando...</div>;

  return (
    <GlobalContext.Provider value={{ auth, setAuth }}>
      {children}
    </GlobalContext.Provider>
  );
};
