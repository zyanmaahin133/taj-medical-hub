import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = "admin" | "doctor" | "pharmacy" | "lab" | "scan_center" | "user" | "wholesale";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWholesale, setIsWholesale] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setIsAdmin(false);
        setIsWholesale(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching role:", error);
        }

        const userRole = (data?.role as UserRole) || "user";
        setRole(userRole);
        setIsAdmin(userRole === "admin");
        setIsWholesale(userRole === "wholesale");
      } catch (error) {
        console.error("Error:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return { role, isAdmin, isWholesale, loading };
};
