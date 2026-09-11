export type DayOffType = "day_off" | "vacation";

export type DayOff = {
  id: number;
  periodId: number;
  name: string;
  type: DayOffType;
  startDate: string;
  endDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DayOffFormData = {
  name: string;
  type: DayOffType;
  startDate: string;
  endDate: string;
  notes: string;
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

export type GetDayOffSuccessResponse = {
  success: true;
  data: DayOff;
};

export type GetDayOffErrorResponse = {
  success: false;
  message: string;
};

export type GetDayOffResponse =
  | GetDayOffSuccessResponse
  | GetDayOffErrorResponse;

export type SaveDayOffSuccessResponse = {
  success: true;
  message: string;
  data: DayOff;
};

export type SaveDayOffErrorResponse = {
  success: false;
  message: string;
};

export type SaveDayOffResponse =
  | SaveDayOffSuccessResponse
  | SaveDayOffErrorResponse;
