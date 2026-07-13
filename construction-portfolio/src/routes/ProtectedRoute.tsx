import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Loader from "../admin/components/Loader";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <Loader />;
  if (!isSignedIn) return <Navigate to="/admin/sign-in" replace />;

  return <>{children}</>;
}
