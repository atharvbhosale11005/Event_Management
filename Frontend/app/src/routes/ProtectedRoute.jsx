import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {

    const token = sessionStorage.getItem("token");

    const user = JSON.parse(
        sessionStorage.getItem("user") || "{}"
    );

    // No JWT → user is not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // JWT exists but role is not allowed
    if (
        allowedRoles &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {

        if (user.role === "ADMIN") {
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );
        }

        if (user.role === "PARTICIPANT") {
            return (
                <Navigate
                    to="/participant/dashboard"
                    replace
                />
            );
        }

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;