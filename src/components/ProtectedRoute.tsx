
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // ✅ THE FIX: Show a full-page loader while auth state is resolving.
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Only after loading is false, check for the user.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If loading is false and user exists, render the protected content.
  return <Outlet />;
};

export default ProtectedRoute;
