import { useAuth } from "../customHooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";
import AuthUnavailable from "./AuthUnavailable";

export default function ProtectedRoute() {
    const { authLoading, authStatus, retryAuth, user } = useAuth();
    const location = useLocation();

    if (authLoading) return <Loader/>;

    if (authStatus === "unavailable" && !user) {
        return <AuthUnavailable onRetry={retryAuth} />;
    }

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
