import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Store, Package, FileText, ShoppingCart, Clock, CheckCircle, 
  XCircle, Plus, Minus, Upload, Download, Search, LogOut,
  TrendingUp, CreditCard, Building, AlertCircle
} from "lucide-react";
import logo from "@/assets/logo.jpeg";

const WholesaleDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quoteItems, setQuoteItems] = useState<Array<{ name: string; quantity: number; notes: string }>>([
    { name: "", quantity: 1, notes: "" }
  ]);
  const [quoteNotes, setQuoteNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch wholesale profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wholesale_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch quote requests
  const { data: quotes = [] } = useQuery({
    queryKey: ["wholesale-quotes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ["wholesale-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch products for search
  const { data: products = [] } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  // Submit quote request
  const submitQuote = useMutation({
    mutationFn: async () => {
      const validItems = quoteItems.filter(item => item.name.trim());
      if (validItems.length === 0) {
        throw new Error("Please add at least one item");
      }

      const { error } = await supabase
        .from("quote_requests")
        .insert({
          user_id: user?.id,
          wholesale_profile_id: profile?.id,
          items: validItems,
          notes: quoteNotes,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wholesale-quotes"] });
      setQuoteItems([{ name: "", quantity: 1, notes: "" }]);
      setQuoteNotes("");
      toast.success("Quote request submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit quote");
    },
  });

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ tab: "login" }} replace />;
  }

  if (!profile) {
    return <Navigate to="/wholesale/register" replace />;
  }

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { name: "", quantity: 1, notes: "" }]);
  };

  const removeQuoteItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  const updateQuoteItem = (index: number, field: string, value: any) => {
    const updated = [...quoteItems];
    updated[index] = { ...updated[index], [field]: value };
    setQuoteItems(updated);
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.generic_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      quoted: "bg-blue-500",
      accepted: "bg-green-500",
      rejected: "bg-red-500",
      expired: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const pendingQuotes = quotes.filter((q: any) => q.status === "pending").length;
  const creditAvailable = (profile.credit_limit || 0) - (profile.credit_used || 0);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Taj Medical" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h1 className="font-bold text-primary">Taj Medical Store</h1>
              <p className="text-xs text-muted-foreground">Wholesale Partner</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="font-medium">{profile.business_name}</p>
              <p className="text-sm text-muted-foreground">{profile.contact_person}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Verification Status */}
        {!profile.is_verified && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Verification Pending</p>
                <p className="text-sm text-yellow-700">
                  Your business profile is under review. You can still browse products and submit quotes.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingQuotes}</p>
                  <p className="text-sm text-muted-foreground">Pending Quotes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{creditAvailable.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Credit Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="products">Browse Products</TabsTrigger>
            <TabsTrigger value="profile">Business Profile</TabsTrigger>
          </TabsList>

          {/* Quote Requests Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* New Quote Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Request New Quote
                  </CardTitle>
                  <CardDescription>
                    Submit a list of products you need and we'll send you a custom quote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quoteItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Product name"
                          value={item.name}
                          onChange={(e) => updateQuoteItem(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateQuoteItem(index, "quantity", parseInt(e.target.value) || 1)}
                          min={1}
                        />
                      </div>
                      {quoteItems.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeQuoteItem(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button variant="outline" size="sm" onClick={addQuoteItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Items
                  </Button>

                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any specific requirements, brands, or pack sizes..."
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => submitQuote.mutate()}
                      disabled={submitQuote.isPending}
                    >
                      {submitQuote.isPending ? "Submitting..." : "Submit Quote Request"}
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload PDF List
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quote History */}
              <Card>
                <CardHeader>
                  <CardTitle>Quote History</CardTitle>
                </CardHeader>
                <CardContent>
                  {quotes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No quote requests yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {quotes.map((quote: any) => (
                        <div key={quote.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-mono text-muted-foreground">
                              #{quote.id.slice(0, 8)}
                            </span>
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status}
                            </Badge>
                          </div>
                          <p className="text-sm">
                            {(quote.items as any[])?.length || 0} items requested
                          </p>
                          {quote.quoted_amount && (
                            <p className="font-semibold mt-1">
                              Quoted: ₹{quote.quoted_amount.toLocaleString()}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No orders yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-medium">#{order.id.slice(0, 8)}</span>
                          <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {(order.items as any[])?.length || 0} items
                          </span>
                          <span className="font-bold">₹{order.total?.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Ordered on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Browse Products</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.slice(0, 12).map((product: any) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold">₹{product.price}</span>
                        {profile.discount_percentage > 0 && (
                          <Badge variant="secondary">
                            {profile.discount_percentage}% off
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Business Name</Label>
                      <p className="font-medium">{profile.business_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Business Type</Label>
                      <p className="font-medium capitalize">{profile.business_type?.replace("_", " ")}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">GST Number</Label>
                      <p className="font-medium">{profile.gst_number || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Drug License</Label>
                      <p className="font-medium">{profile.drug_license_number || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Contact Person</Label>
                      <p className="font-medium">{profile.contact_person}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="font-medium">
                        {profile.business_address}, {profile.business_city}, {profile.business_state} - {profile.business_pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WholesaleDashboard;
