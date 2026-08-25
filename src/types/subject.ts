import type { FormClass, Class } from "./class";

export type SubjectForm = {
  id?: number;
  periodId: number;
  name: string;
  teacher: string | null;
  color: string;
  startDate: string;
  endDate: string;
  classes: FormClass[];
};

export type Subject = {
  id: number;
  periodId: number;
  name: string;
  teacher: string | null;
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

export type SubjectWithClasses = Subject & {
  classes: Class[];
};

export type GetSubjectWithClassesSuccessResponse = {
  success: true;
  data: SubjectWithClasses;
};

export type GetSubjectWithClassesErrorResponse = {
  success: false;
  message: string;
};

export type GetSubjectWithClassesResponse =
  | GetSubjectWithClassesSuccessResponse
  | GetSubjectWithClassesErrorResponse;