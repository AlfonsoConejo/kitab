export type DayOff = {
  id: number;
  periodId: number;
  name: string;
  startDate: string;
  endDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetDaysOffSuccessResponse = {
  success: true;
  data: DayOff[];
};

export type GetDaysOffErrorResponse = {
  success: false;
  message: string;
};

export type GetDaysOffByPeriodResponse =
  | GetDaysOffSuccessResponse
  | GetDaysOffErrorResponse;
