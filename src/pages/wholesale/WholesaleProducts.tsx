// src/components/WholesaleProducts.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  ShoppingCart,
  FileText,
  Trash2,
  Loader2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logo.jpeg";

/** Types (adjust if you have generated types) */
type Product = { id: string; name: string; category?: string | null; price?: number | null; };
type WholesaleProfile = { user_id: string; business_name?: string | null; contact_person?: string | null; };
type QuoteItem = { product: Product; quantity: number; };

/** AddToQuoteDialog */
const AddToQuoteDialog: React.FC<{ product: Product; onAddToCart: (p: Product, q: number) => void; }> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);
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
          <Plus className="h-4 w-4 mr-2" />
          Add to Quote
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
            min={1}
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

/** WholesaleProducts component */
const WholesaleProducts: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [quoteCart, setQuoteCart] = useState<QuoteItem[]>([]);

  /** Products query */
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      // Optional: log session for debugging
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.debug("Supabase session:", sessionData);
      } catch (err) {
        console.debug("Session fetch error (non-fatal):", err);
      }

      const { data, error } = await supabase.from<Product>("products").select("id, name, category, price");
      if (error) {
        console.error("Products query error:", error);
        throw error;
      }
      console.debug("Products:", data);
      return data ?? [];
    },
    staleTime: 1000 * 60 * 2,
  });

  /** User profile query */
  const { data: userProfile, isLoading: profileLoading } = useQuery<WholesaleProfile | null>({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from<WholesaleProfile>("wholesale_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (error) {
        console.error("wholesale_profiles query error:", error);
        throw error;
      }
      return data ?? null;
    },
    enabled: !!user,
  });

  /** Cart helpers */
  const addToCart = (product: Product, quantity: number) => {
    setQuoteCart((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...current, { product, quantity }];
    });
    toast.success(`${quantity} x ${product.name} added to quote.`);
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    setQuoteCart((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: newQuantity } : item).filter(i => i.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setQuoteCart((current) => current.filter((item) => item.product.id !== productId));
    toast.info("Item removed from quote.");
  };

  /** Submit quote mutation */
  const { mutate: submitQuote, isLoading: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be signed in to submit a quote.");
      if (!userProfile) throw new Error("User profile not found.");
      if (quoteCart.length === 0) throw new Error("Quote cart is empty.");

      // Build PDF
      const doc = new jsPDF();
      const tableData = quoteCart.map(item => [item.product.name, item.quantity, `₹${(item.product.price ?? 0).toFixed(2)}`]);

      try {
        doc.addImage(logo, "JPEG", 15, 10, 30, 30);
      } catch (err) {
        console.warn("Logo addImage failed:", err);
      }
      doc.text("Quote Request", 105, 30, { align: "center" });
      doc.text(`From: ${userProfile.business_name ?? "N/A"}`, 15, 50);
      doc.text(`Contact: ${userProfile.contact_person ?? "N/A"} (${user.email})`, 15, 56);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 62);

      autoTable(doc, { startY: 70, head: [['Product', 'Quantity', 'Est. Price']], body: tableData, theme: 'grid' });

      const pdfBlob = doc.output("blob");
      const filePath = `quote-requests/${user.id}/${Date.now()}.pdf`;
      const fileForUpload = new File([pdfBlob], `${Date.now()}.pdf`, { type: "application/pdf" });

      console.debug("Uploading to storage path:", filePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("wholesale_documents")
        .upload(filePath, fileForUpload, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }
      console.debug("UploadData:", uploadData);

      // Get public URL (bucket is public per your dashboard)
      const { data: publicData } = supabase.storage.from("wholesale_documents").getPublicUrl(filePath);
      // SDK variations: publicData.publicUrl or publicData.public_url
      const documentUrl = (publicData && (publicData.publicUrl ?? (publicData as any).public_url)) || (uploadData as any)?.path || filePath;

      // Insert into quote_requests using document_url column
      const { error: requestError } = await supabase.from("quote_requests").insert({
        user_id: user.id,
        status: "pending",
        items: quoteCart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price,
        })),
        document_url: documentUrl,
      });

      if (requestError) {
        console.error("Insert quote_requests error:", requestError);
        throw requestError;
      }
    },
    onSuccess: () => {
      toast.success("Quote request has been sent to the admin!");
      setQuoteCart([]);
      queryClient.invalidateQueries(["admin-quote-requests"]);
    },
    onError: (err: any) => {
      console.error("Submit quote failed:", err);
      toast.error(`Submission failed: ${err?.message ?? "Unknown error"}`);
    },
  });

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const isLoading = productsLoading || profileLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse All Products</h1>
          <p className="text-muted-foreground">Add products to your quote cart.</p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Quote ({quoteCart.length})
            </Button>
          </SheetTrigger>

          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Your Quote Request</SheetTitle>
              <SheetDescription>Review your items before submitting to the admin.</SheetDescription>
            </SheetHeader>

            <div className="py-4 space-y-4">
              {quoteCart.length > 0 ? quoteCart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Est. Price: ₹{(item.product.price ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={item.quantity} onChange={(e) => updateCartQuantity(item.product.id, Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-20" min={1} />
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              )) : <p className="text-center text-muted-foreground py-8">Your quote cart is empty.</p>}
            </div>

            <SheetFooter>
              <Button onClick={() => submitQuote()} disabled={quoteCart.length === 0 || isSubmitting} className="w-full">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : <><FileText className="h-4 w-4 mr-2" />Submit Quote Request</>}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border-blue-500 bg-blue-50">
        <CardContent className="p-4 flex items-center gap-3">
          <Info className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">Showing All Products</p>
            <p className="text-sm text-blue-700">For a more specific catalog, please contact support about product categorization.</p>
          </div>
        </CardContent>
      </Card>

      {isLoading ? <div>Loading products...</div> : productsError ? (
        <Card><CardContent><p className="text-destructive">Failed to load products. Check console for details.</p></CardContent></Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search all products..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Est. Price</TableHead>
                  <TableHead className="w-[150px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">No products found.</TableCell>
                  </TableRow>
                ) : filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category ?? "—"}</TableCell>
                    <TableCell className="text-right">{product.price != null ? `₹${product.price.toFixed(2)}` : "N/A"}</TableCell>
                    <TableCell className="text-right"><AddToQuoteDialog product={product} onAddToCart={addToCart} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WholesaleProducts;
