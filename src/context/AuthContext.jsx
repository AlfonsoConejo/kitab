import { createContext, useEffect, useState, useRef} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const didCheckAuth = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const logoutUser = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error(error);
    }

    setUser(null);
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
          const dataMe = await resMe.json();

          setUser(dataMe.data.user);
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

          const dataMe = await resMe.json();

          setUser(dataMe.data.user);
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