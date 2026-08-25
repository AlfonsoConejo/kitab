export type Class = {
  id: number;
  subjectId: number;
  subjectName: string;
  days: number[];
  startTime: string;
  endTime: string;
  mode: string;
  classroom: string;
  type: string;
};

export type GetClassesSuccessResponse = {
  success: true;
  data: Class[];
};

export type GetClassesErrorResponse = {
  success: false;
  message: string;
};

export type GetClassesByPeriodResponse =
  | GetClassesSuccessResponse
  | GetClassesErrorResponse;