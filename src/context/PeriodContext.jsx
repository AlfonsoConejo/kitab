import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../customHooks/useAuth";

export const PeriodContext = createContext();

export const PeriodProvider = ({ children }) => {
  const { user, authLoading } = useAuth();

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isLoadingPeriod, setIsLoadingPeriod] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.id) {
      setSelectedPeriod(null);
      setIsLoadingPeriod(false);
      return;
    }

    const savedPeriod = localStorage.getItem(
      `selectedPeriod_${user.id}`
    );

    if (savedPeriod) {
      try {
        setSelectedPeriod(JSON.parse(savedPeriod));
      } catch (error) {
        console.error("Error al recuperar el periodo:", error);
        setSelectedPeriod(null);
      }
    } else {
      setSelectedPeriod(null);
    }

    setIsLoadingPeriod(false);
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (!user?.id || isLoadingPeriod) return;

    const key = `selectedPeriod_${user.id}`;

    if (!selectedPeriod) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify(selectedPeriod)
    );
  }, [selectedPeriod, user?.id, isLoadingPeriod]);

  return (
    <PeriodContext.Provider
      value={{
        selectedPeriod,
        setSelectedPeriod,
        isLoadingPeriod,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => useContext(PeriodContext);