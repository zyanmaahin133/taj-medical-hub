
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Star, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AdminDoctors = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", qualification: "", experience: 0, fee: 0 });

  // Fetch real doctors from Supabase
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Mutation to add a new doctor
  const { mutate: addDoctor, isLoading: isAdding } = useMutation({
    mutationFn: async (doctorData) => {
      const { error } = await supabase.from("doctors").insert(doctorData);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Doctor added successfully!");
      queryClient.invalidateQueries(["admin-doctors"]);
      setAddDialogOpen(false);
      setNewDoctor({ name: "", specialty: "", qualification: "", experience: 0, fee: 0 });
    },
    onError: (error) => {
      toast.error(`Error adding doctor: ${error.message}`);
    },
  });

  // Mutation to delete a doctor
  const { mutate: deleteDoctor } = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("doctors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Doctor deleted successfully!");
      queryClient.invalidateQueries(["admin-doctors"]);
    },
    onError: (error) => {
      toast.error(`Error deleting doctor: ${error.message}`);
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addDoctor(newDoctor);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading doctors...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <p className="text-muted-foreground">Manage registered doctors</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Doctor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Doctor</DialogTitle></DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1"><Label>Name</Label><Input value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} required/></div>
              <div className="space-y-1"><Label>Specialty</Label><Input value={newDoctor.specialty} onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})} required/></div>
              <div className="space-y-1"><Label>Qualification</Label><Input value={newDoctor.qualification} onChange={e => setNewDoctor({...newDoctor, qualification: e.target.value})}/></div>
              <div className="space-y-1"><Label>Experience (years)</Label><Input type="number" value={newDoctor.experience} onChange={e => setNewDoctor({...newDoctor, experience: parseInt(e.target.value) || 0})}/></div>
              <div className="space-y-1"><Label>Fee</Label><Input type="number" value={newDoctor.fee} onChange={e => setNewDoctor({...newDoctor, fee: parseFloat(e.target.value) || 0})}/></div>
              <Button type="submit" disabled={isAdding}>{isAdding ? "Adding..." : "Add Doctor"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search doctors..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader> {/* ... TableHeader is correct ... */} </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  {/* ... TableCells are correct ... */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem> <Edit className="h-4 w-4 mr-2"/> Edit </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteDoctor(doctor.id)} className="text-destructive"> <Trash2 className="h-4 w-4 mr-2"/> Delete </DropdownMenuItem>
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
