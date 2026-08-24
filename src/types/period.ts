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

export type PeriodFormData = {
  name: string;
  startDate: string;
  endDate: string;
  color: string;
};

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

// When only getting one period
export interface GetPeriodSuccessResponse {
  success: true;
  data: Period;
}

export interface GetPeriodErrorResponse {
  success: false;
  message: string;
}

export type GetPeriodResponse =
  | GetPeriodSuccessResponse
  | GetPeriodErrorResponse;