
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import DoctorRegister from "./DoctorRegister";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, ArrowRight } from "lucide-react";
import { format, isToday, startOfDay, endOfDay } from "date-fns";

// ✅ THE FIX: A real, professional dashboard component
const DashboardContent = ({ user, profile }) => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["doctor-dashboard-stats", user.id],
    queryFn: async () => {
      const todayStart = startOfDay(new Date()).toISOString();
      const todayEnd = endOfDay(new Date()).toISOString();

      const { count: todayCount, error: todayError } = await supabase.from("appointments").select("id", { count: "exact" }).eq("doctor_id", user.id).gte("appointment_date", todayStart).lte("appointment_date", todayEnd);
      if (todayError) throw todayError;

      const { count: patientCount, error: patientError } = await supabase.from("doctor_patients_view").select("patient_id", { count: "exact" }).eq("doctor_id", user.id);
      if (patientError) throw patientError;

      return { todayAppointments: todayCount, totalPatients: patientCount };
    }
  });

  const { data: todayAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["doctor-today-appointments", user.id],
    queryFn: async () => {
        const todayStart = startOfDay(new Date()).toISOString();
        const todayEnd = endOfDay(new Date()).toISOString();
        const { data, error } = await supabase.from("appointments").select("*").eq("doctor_id", user.id).gte("appointment_date", todayStart).lte("appointment_date", todayEnd).order("appointment_date");
        if (error) throw error;
        return data;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, Dr. {profile.full_name}</h1>
        <p className="text-muted-foreground">Here is your summary for today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Today's Appointments</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.todayAppointments ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Patients</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalPatients ?? 0}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
            <div><CardTitle>Today's Schedule</CardTitle><CardDescription>Your appointments for today.</CardDescription></div>
            <Button asChild variant="outline" size="sm"><Link to="/doctor/appointments">View All <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Patient</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                    {appointmentsLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
                    {!appointmentsLoading && todayAppointments.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24">No appointments scheduled for today.</TableCell></TableRow>}
                    {!appointmentsLoading && todayAppointments.map(appt => (
                        <TableRow key={appt.id}>
                            <TableCell className="font-medium">{format(new Date(appt.appointment_date), "p")}</TableCell>
                            <TableCell>{appt.patient_name || "N/A"}</TableCell>
                            <TableCell><Badge>{appt.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isDoctor, loading: roleLoading } = useUserRole();

  const { data: profile, isLoading: profileLoading, error } = useQuery({ queryKey: ["doctor-profile", user?.id], queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from("doctor_profiles").select("*").eq("user_id", user.id).single(); if (error && error.code !== 'PGRST116') throw error; return data; }, enabled: !!user && isDoctor, retry: 1 });

  if (authLoading || roleLoading || (isDoctor && profileLoading)) {
    return <div>Loading Doctor Dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isDoctor && !profile) {
    return <DoctorRegister />;
  }

  if (isDoctor && profile) {
      return <DashboardContent user={user} profile={profile} />;
  }

  return null;
};

export default DoctorDashboard;
