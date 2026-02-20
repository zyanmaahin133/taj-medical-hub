
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

const AdminLabTests = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState({ name: "", category: "", price: 0, mrp: 0, reportTime: "" });

  // Fetch real lab tests from Supabase
  const { data: labTests = [], isLoading } = useQuery({
    queryKey: ["admin-lab-tests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lab_tests").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Mutation to add a new lab test
  const { mutate: addTest, isLoading: isAdding } = useMutation({
    mutationFn: async (testData) => {
      const { error } = await supabase.from("lab_tests").insert(testData);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lab test added successfully!");
      queryClient.invalidateQueries(["admin-lab-tests"]);
      setAddDialogOpen(false);
      setNewTest({ name: "", category: "", price: 0, mrp: 0, reportTime: "" });
    },
    onError: (error) => {
      toast.error(`Error adding lab test: ${error.message}`);
    },
  });

  // Mutation to delete a lab test
  const { mutate: deleteTest } = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("lab_tests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lab test deleted successfully!");
      queryClient.invalidateQueries(["admin-lab-tests"]);
    },
    onError: (error) => {
      toast.error(`Error deleting lab test: ${error.message}`);
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addTest(newTest);
  };

  const filteredTests = labTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (test.category && test.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) return <div>Loading lab tests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Lab Tests</h1><p className="text-muted-foreground">Manage available lab tests</p></div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Test</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Lab Test</DialogTitle></DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1"><Label>Test Name</Label><Input value={newTest.name} onChange={e => setNewTest({...newTest, name: e.target.value})} required/></div>
              <div className="space-y-1"><Label>Category</Label><Input value={newTest.category} onChange={e => setNewTest({...newTest, category: e.target.value})}/></div>
              <div className="space-y-1"><Label>Price</Label><Input type="number" value={newTest.price} onChange={e => setNewTest({...newTest, price: parseFloat(e.target.value) || 0})}/></div>
              <div className="space-y-1"><Label>MRP</Label><Input type="number" value={newTest.mrp} onChange={e => setNewTest({...newTest, mrp: parseFloat(e.target.value) || 0})}/></div>
              <div className="space-y-1"><Label>Report Time</Label><Input value={newTest.reportTime} onChange={e => setNewTest({...newTest, reportTime: e.target.value})}/></div>
              <Button type="submit" disabled={isAdding}>{isAdding ? "Adding..." : "Add Test"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tests..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>{/* ... */}</TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  {/* ... */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem> <Edit className="h-4 w-4 mr-2"/> Edit </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteTest(test.id)} className="text-destructive"> <Trash2 className="h-4 w-4 mr-2"/> Delete </DropdownMenuItem>
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

export default AdminLabTests;
