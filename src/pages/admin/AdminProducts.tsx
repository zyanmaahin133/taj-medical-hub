import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    brand: "",
    manufacturer: "",
    price: "",
    discount_percent: "",
    form: "",
    dosage: "",
    pack_size: "",
    description: "",
    requires_prescription: false,
    stock_quantity: "",
    image_url: "",
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const addProduct = useMutation({
    mutationFn: async (product: any) => {
      const { error } = await supabase.from("medicines").insert(product);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product added successfully");
      setIsAddOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add product"),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...product }: any) => {
      const { error } = await supabase.from("medicines").update(product).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product updated");
      setEditProduct(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("medicines").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const resetForm = () => {
    setFormData({
      name: "", generic_name: "", brand: "", manufacturer: "",
      price: "", discount_percent: "", form: "", dosage: "",
      pack_size: "", description: "", requires_prescription: false,
      stock_quantity: "", image_url: "",
    });
  };

  const handleSubmit = () => {
    const product = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      discount_percent: parseFloat(formData.discount_percent) || 0,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
    };

    if (editProduct) {
      updateProduct.mutate({ id: editProduct.id, ...product });
    } else {
      addProduct.mutate(product);
    }
  };

  const openEdit = (product: any) => {
    setEditProduct(product);
    setFormData({
      name: product.name || "",
      generic_name: product.generic_name || "",
      brand: product.brand || "",
      manufacturer: product.manufacturer || "",
      price: product.price?.toString() || "",
      discount_percent: product.discount_percent?.toString() || "",
      form: product.form || "",
      dosage: product.dosage || "",
      pack_size: product.pack_size || "",
      description: product.description || "",
      requires_prescription: product.requires_prescription || false,
      stock_quantity: product.stock_quantity?.toString() || "",
      image_url: product.image_url || "",
    });
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.generic_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.form === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const forms = [...new Set(products.map((p: any) => p.form).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your medicine inventory</p>
        </div>
        <Dialog open={isAddOpen || !!editProduct} onOpenChange={(open) => {
          if (!open) { setIsAddOpen(false); setEditProduct(null); resetForm(); }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <Label>Generic Name</Label>
                <Input value={formData.generic_name} onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })} />
              </div>
              <div>
                <Label>Brand</Label>
                <Input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
              </div>
              <div>
                <Label>Manufacturer</Label>
                <Input value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} />
              </div>
              <div>
                <Label>Form</Label>
                <Select value={formData.form} onValueChange={(v) => setFormData({ ...formData, form: v })}>
                  <SelectTrigger><SelectValue placeholder="Select form" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Capsule">Capsule</SelectItem>
                    <SelectItem value="Syrup">Syrup</SelectItem>
                    <SelectItem value="Injection">Injection</SelectItem>
                    <SelectItem value="Cream">Cream</SelectItem>
                    <SelectItem value="Drops">Drops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price *</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div>
                <Label>Discount %</Label>
                <Input type="number" value={formData.discount_percent} onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })} />
              </div>
              <div>
                <Label>Stock Quantity</Label>
                <Input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} />
              </div>
              <div>
                <Label>Dosage</Label>
                <Input value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} placeholder="e.g., 500mg" />
              </div>
              <div>
                <Label>Pack Size</Label>
                <Input value={formData.pack_size} onChange={(e) => setFormData({ ...formData, pack_size: e.target.value })} placeholder="e.g., 10 tablets" />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.requires_prescription}
                  onChange={(e) => setFormData({ ...formData, requires_prescription: e.target.checked })}
                />
                <Label>Requires Prescription</Label>
              </div>
              <div className="col-span-2">
                <Button onClick={handleSubmit} className="w-full">
                  {editProduct ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                {forms.map((form: string) => (
                  <SelectItem key={form} value={form}>{form}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-lg">💊</div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.form || "-"}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">₹{product.price}</p>
                          {product.discount_percent > 0 && (
                            <p className="text-xs text-green-600">{product.discount_percent}% off</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.stock_quantity || 0}</TableCell>
                      <TableCell>
                        <Badge className={product.is_active && product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}>
                          {product.is_active && product.stock_quantity > 0 ? "Active" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => deleteProduct.mutate(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;
