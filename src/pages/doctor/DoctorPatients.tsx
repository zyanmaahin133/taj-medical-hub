
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User } from "lucide-react";

const DoctorPatients = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // This query is a bit more complex. It finds all unique patients
  // from the appointments linked to the current doctor.
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["doctor-patients", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: appointmentData, error: apptError } = await supabase
        .from("appointments")
        .select("patient_id")
        .eq("doctor_id", user.id);
      if (apptError) throw apptError;

      const patientIds = [...new Set(appointmentData.map(a => a.patient_id))];
      if (patientIds.length === 0) return [];

      const { data: patientData, error: patientError } = await supabase
        .from("patients") // Assuming a 'patients' table
        .select("*")
        .in("id", patientIds);
      if (patientError) throw patientError;
      return patientData;
    },
    enabled: !!user,
  });

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading patients...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Patients</h1>
        <p className="text-muted-foreground">A list of all patients you have consulted with.</p>
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
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24">No patients found.</TableCell></TableRow>}
              {filteredPatients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={patient.avatar_url} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>N/A</TableCell> {/* Placeholder for last visit date */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorPatients;
