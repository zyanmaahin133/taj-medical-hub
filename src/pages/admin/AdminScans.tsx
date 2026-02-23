
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

const AdminScans = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newScan, setNewScan] = useState({ name: "", type: "", price: 0, mrp: 0, reportTime: "" });

  // ... (data fetching logic is correct) ...
  const { data: scans = [], isLoading } = useQuery({ queryKey: ["admin-scans"], queryFn: async () => { const { data, error } = await supabase.from("scans").select("*"); if (error) throw error; return data; } });
  const { mutate: deleteScan } = useMutation({ mutationFn: async (id) => { const { error } = await supabase.from("scans").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { toast.success("Scan deleted"); queryClient.invalidateQueries(["admin-scans"]); } });
  const { mutate: addScan, isLoading: isAdding } = useMutation({ mutationFn: async (scanData) => { const { error } = await supabase.from("scans").insert(scanData); if (error) throw error; }, onSuccess: () => { toast.success("Scan added"); queryClient.invalidateQueries(["admin-scans"]); setAddDialogOpen(false); }, onError: (err) => { toast.error(err.message); } });
  const handleAddSubmit = (e) => { e.preventDefault(); addScan(newScan); };
  const filteredScans = scans.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scans</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Scan</Button></DialogTrigger>
          <DialogContent>
            {/* ✅ THE FIX: Added DialogDescription for accessibility */}
            <DialogHeader>
              <DialogTitle>Add New Scan</DialogTitle>
              <DialogDescription>Fill in the details below to add a new scan.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* ... (form inputs are correct) ... */}
              <div className="space-y-1"><Label>Scan Name</Label><Input value={newScan.name} onChange={e => setNewScan({...newScan, name: e.target.value})} required/></div>
              <div className="space-y-1"><Label>Price</Label><Input type="number" value={newScan.price} onChange={e => setNewScan({...newScan, price: parseFloat(e.target.value) || 0})}/></div>
              <Button type="submit" disabled={isAdding}>{isAdding ? "Adding..." : "Add Scan"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><Input placeholder="Search scans..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Price</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell>{scan.name}</TableCell>
                  <TableCell>₹{scan.price}</TableCell>
                  <TableCell>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal/></Button></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => deleteScan(scan.id)} className="text-destructive">Delete</DropdownMenuItem>
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

export default AdminScans;
