import { useAuth } from "../customHooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

export default function PublicOnlyRoute() {
  const { authLoading, user } = useAuth();

  if (authLoading) return <Loader/>;

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}