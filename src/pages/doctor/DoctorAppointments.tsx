
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { format } from "date-fns";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ["doctor-appointments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        // ✅ THE FIX: Removed the broken join and selected patient_name directly
        const { data, error } = await supabase
          .from("appointments")
          .select("id, appointment_date, status, patient_name")
          .eq("doctor_id", user.id)
          .order("appointment_date", { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Error fetching appointments:", err);
        return []; // Return empty array on error to prevent crash
      }
    },
    enabled: !!user,
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-blue-500">Confirmed</Badge>;
      case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled': return <Badge className="bg-red-500">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAppointments = appointments.filter(appt =>
    appt.patient_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error loading appointments. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <p className="text-muted-foreground">View and manage your patient appointments.</p>
      </div>
      <Card>
        <CardHeader>
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by patient name..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No appointments found.</TableCell></TableRow>}
              {filteredAppointments.map(appt => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.patient_name || "Unknown Patient"}</TableCell>
                  <TableCell>{format(new Date(appt.appointment_date), "PPP")}</TableCell>
                  <TableCell>{format(new Date(appt.appointment_date), "p")}</TableCell>
                  <TableCell>{getStatusBadge(appt.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAppointments;
