export interface Period {
  id: number;
  name: string;
  color: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  userId: number;
}

export interface GetPeriodsResponse {
  success: boolean;
  data?: Period[];
  message?: string;
}