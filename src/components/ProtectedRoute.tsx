// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth", { replace: true });
    } else {
      setChecked(true);
    }
  }, [navigate]);

  if (!checked) return null;

  return <>{children}</>;
};
