import { createContext, useEffect, useState, useRef } from "react";
import type { AuthContextType, User, GetMeResponse, AuthProviderProps } from "@/types/user";
import { apiFetch, notifyOtherTabsOfLogout } from "@/services/apiFetch";
import { API_URL } from "@/services/apiUrl";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const didCheckAuth = useRef(false);
  const sessionVersion = useRef(0);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const handleSessionExpired = () => {
      sessionVersion.current += 1;
      setUser(null);
    };

    const handleRemoteLogout = () => {
      sessionVersion.current += 1;
      setUser(null);
    };

    const handleRemoteLogin = () => {
      const loginVersion = sessionVersion.current + 1;
      sessionVersion.current = loginVersion;

      const synchronizeUser = async () => {
        try {
          const resMe = await apiFetch("/api/auth/me");

          if (!resMe.ok) {
            if (sessionVersion.current === loginVersion) {
              setUser(null);
            }
            return;
          }

          const dataMe: GetMeResponse = await resMe.json();

          if (sessionVersion.current === loginVersion) {
            setUser(dataMe.success ? dataMe.data.user : null);
          }
        } catch (error) {
          console.error(error);

          if (sessionVersion.current === loginVersion) {
            setUser(null);
          }
        }
      };

      void synchronizeUser();
    };

    window.addEventListener("kitab:session-expired", handleSessionExpired);
    window.addEventListener("kitab:remote-logout", handleRemoteLogout);
    window.addEventListener("kitab:remote-login", handleRemoteLogin);

    return () => {
      window.removeEventListener("kitab:session-expired", handleSessionExpired);
      window.removeEventListener("kitab:remote-logout", handleRemoteLogout);
      window.removeEventListener("kitab:remote-login", handleRemoteLogin);
    };
  }, []);

  const logoutUser = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        return false;
      }

      sessionVersion.current += 1;
      setUser(null);
      notifyOtherTabsOfLogout();
      return true;
    } catch {
      return false;
    }
  };

  const logoutLocally = (): void => {
    sessionVersion.current += 1;
    setUser(null);
  };
  
  useEffect(() => {

    if (didCheckAuth.current) return;

    didCheckAuth.current = true;

    const checkAuth = async () => {
      const checkVersion = sessionVersion.current;

      try {
        const resMe = await apiFetch("/api/auth/me");

        if (resMe.ok) {
          const dataMe: GetMeResponse = await resMe.json();

          if (dataMe.success) {
            if (sessionVersion.current === checkVersion) {
              setUser(dataMe.data.user);
            }
          } else if (sessionVersion.current === checkVersion) {
            console.error(dataMe.message);
            setUser(null);
          }
        } else if (sessionVersion.current === checkVersion) {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
        if (sessionVersion.current === checkVersion) {
          setUser(null);
        }
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
        logoutUser,
        logoutLocally,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
