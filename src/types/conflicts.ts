export type ConflictColorVariants = "cream" | "yellow";

// Types for external conflicts
export type ExternalConflict = {
  id: string | number;
  conflictDays: number[];
  subject: string;
  startTime: string;
  endTime: string;
};

export type CheckExternalConflictsSuccessResponse = {
  success: true;
  externalConflicts: ExternalConflict[];
};

export type CheckExternalConflictsErrorResponse = {
  success: false;
  message: string;
};

export type CheckExternalConflictsResponse =
  | CheckExternalConflictsSuccessResponse
  | CheckExternalConflictsErrorResponse;


// Types for internal conflicts
export type InternalConflict = {
  classA: string | number;
  classB: string | number;
  conflictDays: number[];
  classAStartTime: string;
  classAEndTime: string;
  classBStartTime: string;
  classBEndTime: string;
};

export type CheckInternalConflictsSuccessResponse = {
  success: true;
  internalConflicts: InternalConflict[];
};

export type CheckInternalConflictsErrorResponse = {
  success: false;
  message: string;
};

export type CheckInternalConflictsResponse =
  | CheckInternalConflictsSuccessResponse
  | CheckInternalConflictsErrorResponse;
