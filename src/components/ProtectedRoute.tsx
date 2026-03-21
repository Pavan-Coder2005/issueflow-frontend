import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role?: "admin" | "user"; // ✅ optional role
}

const ProtectedRoute = ({ children, role }: Props) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // ❌ Role mismatch
  if (role && userRole !== role) {
    // redirect based on role
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ✅ Allowed
  return <>{children}</>;
};

export default ProtectedRoute;