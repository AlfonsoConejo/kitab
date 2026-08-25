export type Subject = {
  id: number;
  periodId: number;
  name: string;
  teacher: string;
  color: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type GetSubjectsSuccessResponse = {
  success: true;
  data: Subject[];
};

export type GetSubjectsErrorResponse = {
  success: false;
  message: string;
};

export type GetSubjectsByPeriodResponse =
  | GetSubjectsSuccessResponse
  | GetSubjectsErrorResponse;