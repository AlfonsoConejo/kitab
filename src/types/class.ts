export type ClassType = "theory" | "laboratory" | "workshop"; 
export type ClassMode = "onsite" | "online";

export type FormClass = {
  id?: number;
  tempId: string;
  days: number[];
  type: ClassType;
  mode: ClassMode;
  classroom: string | null;
  startTime: string;
  endTime: string;
};

export type FormClassField = keyof Omit<FormClass, "id" | "tempId">;

export type Class = {
  id: number;
  subjectId: number;
  subjectName: string;
  days: number[];
  startTime: string;
  endTime: string;
  mode: ClassMode;
  classroom: string | null;
  type: ClassType;
};

export type ClassSubmitData = {
  id?: number;
  days: number[];
  type: ClassType;
  mode: ClassMode;
  classroom: string | null;
  startTime: string;
  endTime: string;
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