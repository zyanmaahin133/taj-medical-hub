
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
// ✅ THE FIX: Import DialogDescription
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AdminDoctors = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", qualification: "", experience: 0, fee: 0 });

  // ... (data fetching logic is correct) ...
  const { data: doctors = [], isLoading } = useQuery({ queryKey: ["admin-doctors"], queryFn: async () => { const { data, error } = await supabase.from("doctors").select("*"); if (error) throw error; return data; } });
  const { mutate: deleteDoctor } = useMutation({ mutationFn: async (id) => { const { error } = await supabase.from("doctors").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { toast.success("Doctor deleted"); queryClient.invalidateQueries(["admin-doctors"]); } });
  const { mutate: addDoctor, isLoading: isAdding } = useMutation({ mutationFn: async (doctorData) => { const { error } = await supabase.from("doctors").insert(doctorData); if (error) throw error; }, onSuccess: () => { toast.success("Doctor added"); queryClient.invalidateQueries(["admin-doctors"]); setAddDialogOpen(false); }, onError: (err) => { toast.error(err.message); } });
  const handleAddSubmit = (e) => { e.preventDefault(); addDoctor(newDoctor); };
  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctors Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Doctor</Button></DialogTrigger>
          <DialogContent>
            {/* ✅ THE FIX: Added DialogDescription for accessibility */}
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription>Fill in the details below to add a new doctor to the platform.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* ... (form inputs are correct) ... */}
              <div className="space-y-1"><Label>Name</Label><Input value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} required/></div>
              <div className="space-y-1"><Label>Specialty</Label><Input value={newDoctor.specialty} onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})} required/></div>
              <Button type="submit" disabled={isAdding}>{isAdding ? "Adding..." : "Add Doctor"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><Input placeholder="Search doctors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Specialty</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal/></Button></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => deleteDoctor(doctor.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDoctors;
