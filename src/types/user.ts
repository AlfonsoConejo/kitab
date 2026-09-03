export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetMeSuccessResponse {
  success: true;
  data: {
    user: User;
  };
}

export interface GetMeErrorResponse {
  success: false;
  message: string;
}

export type GetMeResponse = GetMeSuccessResponse | GetMeErrorResponse;

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authLoading: boolean;
  logoutUser: () => Promise<boolean>;
  logoutLocally: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
