import { type ReactNode } from "react";

export interface Period {
  id: number;
  name: string;
  color: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  userId: number;
}

export interface PeriodContextType {
  selectedPeriod: Period | null;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  isLoadingPeriod: boolean;
}

export interface PeriodProviderProps {
  children: ReactNode;
}

export interface GetPeriodsResponse {
  success: boolean;
  data?: Period[];
  message?: string;
}