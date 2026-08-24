import { useAuth } from "../customHooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute() {
    const { authLoading, user } = useAuth();
    const location = useLocation();

    if (authLoading) return <Loader/>;

    if (!user) {
        return (
            <Navigate
                to="/auth/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}