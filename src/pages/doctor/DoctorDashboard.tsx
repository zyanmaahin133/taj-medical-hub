
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole"; // Import the role hook
import DoctorRegister from "./DoctorRegister";

const DashboardContent = ({ user, profile }) => {
  return <div>Welcome, Dr. {profile.full_name}</div>;
};

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isDoctor, loading: roleLoading } = useUserRole(); // Get the user's role

  // ✅ THIS IS THE FIX: Only fetch the doctor profile if the user IS a doctor
  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ["doctor-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("doctor_profiles").select("*").eq("user_id", user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user && isDoctor, // Only run this query if the user is a doctor
    retry: 1,
  });

  if (authLoading || roleLoading || (isDoctor && profileLoading)) {
    return <div>Loading Doctor Dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If the user is a doctor but has no profile, show the registration form.
  if (isDoctor && !profile) {
    return <DoctorRegister />;
  }

  // If the user is a doctor and has a profile, show the dashboard.
  if (isDoctor && profile) {
      return <DashboardContent user={user} profile={profile} />;
  }

  // If the user is not a doctor, show nothing to prevent errors.
  return null;
};

export default DoctorDashboard;
