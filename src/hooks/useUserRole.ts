
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = "admin" | "doctor" | "pharmacy" | "lab" | "scan_center" | "user" | "wholesale";

export const useUserRole = () => {
  const { user } = useAuth();

  const { data, isLoading: loading, isError } = useQuery<UserRole | null>({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user role:", error);
        throw error; // Let react-query handle the error state
      }

      return data?.role as UserRole || "user";
    },
    enabled: !!user, // Only run the query if the user is logged in
    staleTime: 1000 * 60 * 5, // Cache the role for 5 minutes
  });

  return {
    role: data,
    isAdmin: data === "admin",
    isWholesale: data === "wholesale",
    isDoctor: data === "doctor",
    loading,
    isError,
  };
};
