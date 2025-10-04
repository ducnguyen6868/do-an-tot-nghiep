import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { userInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && userInfo && userInfo.name) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [userInfo]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
