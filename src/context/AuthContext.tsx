import { createContext, useEffect, useState, useRef } from "react";
import type { AuthContextType, User, GetMeResponse, AuthProviderProps } from "@/types/user";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const didCheckAuth = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const logoutUser = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("LOGOUT_FAILED");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  };
  
  useEffect(() => {

    if (didCheckAuth.current) return;

    didCheckAuth.current = true;

    const checkAuth = async () => {
      try {
        // FIRST AUTH CHECK
        let resMe = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include"
        });

        // ACCESS TOKEN VALID
        if (resMe.ok) {
          const dataMe: GetMeResponse = await resMe.json();

          if (dataMe.success) {
            setUser(dataMe.data.user);
          } else {
            console.error(dataMe.message);
            setUser(null);
          }
        } else {

          // ACCESS TOKEN EXPIRED -> REFRESH
          const resRefresh = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include"
          });

          // REFRESH FAILED
          if (!resRefresh.ok) {
            await logoutUser();
            return;
          }

          // TRY /ME AGAIN
          resMe = await fetch(`${API_URL}/api/auth/me`, {
            credentials: "include"
          });

          // SECOND /ME FAILED
          if (!resMe.ok) {
            await logoutUser();
            return;
          }

          const dataMe: GetMeResponse = await resMe.json();
          
          if (dataMe.success) {
            setUser(dataMe.data.user);
          } else {
            console.error(dataMe.message);
            setUser(null);
          }
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};