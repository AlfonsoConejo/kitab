import { createContext, useCallback, useEffect, useState, useRef } from "react";
import type { AuthContextType, AuthStatus, User, GetMeResponse, AuthProviderProps } from "@/types/user";
import { apiFetch, notifyOtherTabsOfLogout } from "@/services/apiFetch";
import { API_URL } from "@/services/apiUrl";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const didCheckAuth = useRef(false);
  const sessionVersion = useRef(0);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (user) {
      setAuthStatus("authenticated");
    }
  }, [user]);

  const checkAuth = useCallback(async () => {
    const checkVersion = sessionVersion.current;

    try {
      const resMe = await apiFetch("/api/auth/me");

      if (resMe.ok) {
        const dataMe: GetMeResponse = await resMe.json();

        if (sessionVersion.current !== checkVersion) {
          return;
        }

        if (dataMe.success) {
          setUser(dataMe.data.user);
          setAuthStatus("authenticated");
        } else {
          setUser(null);
          setAuthStatus("unauthenticated");
        }
      } else if (sessionVersion.current === checkVersion) {
        if (resMe.status === 401) {
          setUser(null);
          setAuthStatus("unauthenticated");
        } else {
          setAuthStatus("unavailable");
        }
      }
    } catch (error) {
      console.error(error);

      if (sessionVersion.current !== checkVersion) {
        return;
      }

      if (error instanceof Error && error.message === "SESSION_EXPIRED") {
        setUser(null);
        setAuthStatus("unauthenticated");
      } else {
        setAuthStatus("unavailable");
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const retryAuth = useCallback(async () => {
    setAuthLoading(true);
    await checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleSessionExpired = () => {
      sessionVersion.current += 1;
      setUser(null);
      setAuthStatus("unauthenticated");
    };

    const handleRemoteLogout = () => {
      sessionVersion.current += 1;
      setUser(null);
      setAuthStatus("unauthenticated");
    };

    const handleAuthUnavailable = () => {
      setAuthStatus("unavailable");
    };

    const handleRemoteLogin = () => {
      sessionVersion.current += 1;

      void checkAuth();
    };

    window.addEventListener("kitab:session-expired", handleSessionExpired);
    window.addEventListener("kitab:remote-logout", handleRemoteLogout);
    window.addEventListener("kitab:remote-login", handleRemoteLogin);
    window.addEventListener("kitab:auth-unavailable", handleAuthUnavailable);

    return () => {
      window.removeEventListener("kitab:session-expired", handleSessionExpired);
      window.removeEventListener("kitab:remote-logout", handleRemoteLogout);
      window.removeEventListener("kitab:remote-login", handleRemoteLogin);
      window.removeEventListener("kitab:auth-unavailable", handleAuthUnavailable);
    };
  }, [checkAuth]);

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
      setAuthStatus("unauthenticated");
      notifyOtherTabsOfLogout();
      return true;
    } catch {
      return false;
    }
  };

  const logoutLocally = (): void => {
    sessionVersion.current += 1;
    setUser(null);
    setAuthStatus("unauthenticated");
  };
  
  useEffect(() => {

    if (didCheckAuth.current) return;

    didCheckAuth.current = true;

    void checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        authStatus,
        retryAuth,
        logoutUser,
        logoutLocally,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
