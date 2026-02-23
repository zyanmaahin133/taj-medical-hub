import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Search, Plus, ShoppingCart, FileText, Trash2, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logo.jpeg";

const AddToQuoteDialog = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2"/>Add to Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {product.name} to Quote</DialogTitle>
          <DialogDescription>Enter the quantity you would like to request.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const WholesaleProducts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [quoteCart, setQuoteCart] = useState([]);

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id, name, category, price");
      if (error) throw error;
      return data;
    },
  });

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("wholesale_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Cart management
  const addToCart = (product, quantity) => {
    setQuoteCart(current => {
      const existing = current.find(item => item.product.id === product.id);
      if (existing) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, quantity }];
    });
    toast.success(`${quantity} x ${product.name} added to quote.`);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setQuoteCart(current =>
      current
        .map(item =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setQuoteCart(current => current.filter(item => item.product.id !== productId));
    toast.info("Item removed from quote.");
  };

  // Submit quote
  const { mutate: submitQuote, isLoading: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (!user || !userProfile || quoteCart.length === 0) throw new Error("Missing required data.");

      // Generate PDF
      const doc = new jsPDF();
      const tableData = quoteCart.map(item => [
        item.product.name,
        item.quantity,
        `₹${item.product.price.toFixed(2)}`
      ]);
      doc.addImage(logo, 'JPEG', 15, 10, 30, 30);
      doc.text("Quote Request", 105, 30, { align: 'center' });
      doc.text(`From: ${userProfile.business_name}`, 15, 50);
      doc.text(`Contact: ${userProfile.contact_person} (${user.email})`, 15, 56);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 62);
      autoTable(doc, { startY: 70, head: [['Product', 'Quantity', 'Est. Price']], body: tableData, theme: 'grid' });
      const pdfBlob = doc.output('blob');

      // Upload PDF to Supabase Storage
      const filePath = `quote-requests/${user.id}/${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wholesale_documents')
        .upload(filePath, pdfBlob);
      if (uploadError) throw uploadError;

      // Insert quote request record
      const { error: requestError } = await supabase.from('quote_requests').insert({
        user_id: user.id,
        status: 'pending',
        items: quoteCart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price,
        })),
        document_url: uploadData.path,
      });
      if (requestError) throw requestError;
    },
    onSuccess: () => {
      toast.success("Quote request has been sent to the admin!");
      setQuoteCart([]);
      queryClient.invalidateQueries(["admin-quote-requests"]);
    },
    onError: (err: any) => toast.error(`Submission failed: ${err.message}`),
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isLoading = productsLoading || profileLoading;

  return (
    <div className="space-y-6">
      {/* Header and Quote Cart */}
      {/* Product Table */}
      {/* Cart submission */}
      {/* ...UI code as in your snippet */}
    </div>
  );
};

export default WholesaleProducts;
