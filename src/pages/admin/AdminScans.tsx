
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AdminScans = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newScan, setNewScan] = useState({ name: "", type: "", price: 0, mrp: 0, reportTime: "" });

  // Fetch real scans from Supabase
  const { data: scans = [], isLoading } = useQuery({
    queryKey: ["admin-scans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scans").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Mutation to add a new scan
  const { mutate: addScan, isLoading: isAdding } = useMutation({
    mutationFn: async (scanData) => {
      const { error } = await supabase.from("scans").insert(scanData);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Scan added successfully!");
      queryClient.invalidateQueries(["admin-scans"]);
      setAddDialogOpen(false);
      setNewScan({ name: "", type: "", price: 0, mrp: 0, reportTime: "" });
    },
    onError: (error) => {
      toast.error(`Error adding scan: ${error.message}`);
    },
  });

  // Mutation to delete a scan
  const { mutate: deleteScan } = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("scans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Scan deleted successfully!");
      queryClient.invalidateQueries(["admin-scans"]);
    },
    onError: (error) => {
      toast.error(`Error deleting scan: ${error.message}`);
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addScan(newScan);
  };

  const filteredScans = scans.filter(scan =>
    scan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (scan.type && scan.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) return <div>Loading scans...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Scans</h1><p className="text-muted-foreground">Manage imaging services</p></div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Scan</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Scan</DialogTitle></DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1"><Label>Scan Name</Label><Input value={newScan.name} onChange={e => setNewScan({...newScan, name: e.target.value})} required/></div>
              <div className="space-y-1"><Label>Type</Label><Input value={newScan.type} onChange={e => setNewScan({...newScan, type: e.target.value})}/></div>
              <div className="space-y-1"><Label>Price</Label><Input type="number" value={newScan.price} onChange={e => setNewScan({...newScan, price: parseFloat(e.target.value) || 0})}/></div>
              <div className="space-y-1"><Label>MRP</Label><Input type="number" value={newScan.mrp} onChange={e => setNewScan({...newScan, mrp: parseFloat(e.target.value) || 0})}/></div>
              <div className="space-y-1"><Label>Report Time</Label><Input value={newScan.reportTime} onChange={e => setNewScan({...newScan, reportTime: e.target.value})}/></div>
              <Button type="submit" disabled={isAdding}>{isAdding ? "Adding..." : "Add Scan"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search scans..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>{/* ... */}</TableHeader>
            <TableBody>
              {filteredScans.map((scan) => (
                <TableRow key={scan.id}>
                  {/* ... */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem> <Edit className="h-4 w-4 mr-2"/> Edit </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteScan(scan.id)} className="text-destructive"> <Trash2 className="h-4 w-4 mr-2"/> Delete </DropdownMenuItem>
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
