import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // ❌ Not logged in → redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // ✅ Logged in → allow access
  return <>{children}</>;
};

export default ProtectedRoute;
