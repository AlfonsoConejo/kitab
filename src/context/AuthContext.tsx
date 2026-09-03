import { createContext, useEffect, useState, useRef } from "react";
import type { AuthContextType, User, GetMeResponse, AuthProviderProps } from "@/types/user";
import { apiFetch } from "@/services/apiFetch";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const didCheckAuth = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener("kitab:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("kitab:session-expired", handleSessionExpired);
    };
  }, []);

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
        const resMe = await apiFetch("/api/auth/me");

        if (resMe.ok) {
          const dataMe: GetMeResponse = await resMe.json();

          if (dataMe.success) {
            setUser(dataMe.data.user);
          } else {
            console.error(dataMe.message);
            setUser(null);
          }
        } else {
          setUser(null);
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
