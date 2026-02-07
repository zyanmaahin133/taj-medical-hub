import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building, FileText, MapPin, Phone, Mail, User, Store, Shield } from "lucide-react";

const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.enum(["pharmacy", "clinic", "hospital", "retail_shop", "distributor"]),
  gstNumber: z.string().optional(),
  drugLicenseNumber: z.string().optional(),
  panNumber: z.string().optional(),
  businessAddress: z.string().min(10, "Complete address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().min(2, "State is required"),
  businessPincode: z.string().min(6, "Valid pincode is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z.string().min(10, "Valid phone is required"),
  email: z.string().email("Valid email is required"),
});

const WholesaleRegister = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "" as "" | "pharmacy" | "clinic" | "hospital" | "retail_shop" | "distributor",
    gstNumber: "",
    drugLicenseNumber: "",
    panNumber: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessPincode: "",
    contactPerson: "",
    phone: "",
    email: "",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ tab: "signup", accountType: "wholesale" }} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = businessSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create wholesale profile
      const { error: profileError } = await supabase
        .from("wholesale_profiles")
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          business_type: formData.businessType,
          gst_number: formData.gstNumber || null,
          drug_license_number: formData.drugLicenseNumber || null,
          pan_number: formData.panNumber || null,
          business_address: formData.businessAddress,
          business_city: formData.businessCity,
          business_state: formData.businessState,
          business_pincode: formData.businessPincode,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
        });

      if (profileError) throw profileError;

      toast.success("Business profile submitted for verification!");
      navigate("/wholesale");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to submit profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Wholesale Partner Registration</CardTitle>
              <CardDescription>
                Register your business to access wholesale pricing and bulk orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <Building className="h-5 w-5" />
                    Business Details
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Your Business Name"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                      {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value: any) => setFormData({ ...formData, businessType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="clinic">Clinic</SelectItem>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="retail_shop">Retail Shop</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.businessType && <p className="text-sm text-destructive">{errors.businessType}</p>}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    Business Documents (Optional)
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        placeholder="22XXXXX1234X1Z5"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="drugLicenseNumber">Drug License Number</Label>
                      <Input
                        id="drugLicenseNumber"
                        placeholder="XX-XXXXX"
                        value={formData.drugLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, drugLicenseNumber: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        id="panNumber"
                        placeholder="XXXXX0000X"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    Business Address
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Complete Address *</Label>
                    <Textarea
                      id="businessAddress"
                      placeholder="Shop/Building name, Street, Landmark..."
                      value={formData.businessAddress}
                      onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    />
                    {errors.businessAddress && <p className="text-sm text-destructive">{errors.businessAddress}</p>}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessCity">City *</Label>
                      <Input
                        id="businessCity"
                        placeholder="City"
                        value={formData.businessCity}
                        onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
                      />
                      {errors.businessCity && <p className="text-sm text-destructive">{errors.businessCity}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessState">State *</Label>
                      <Input
                        id="businessState"
                        placeholder="State"
                        value={formData.businessState}
                        onChange={(e) => setFormData({ ...formData, businessState: e.target.value })}
                      />
                      {errors.businessState && <p className="text-sm text-destructive">{errors.businessState}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessPincode">Pincode *</Label>
                      <Input
                        id="businessPincode"
                        placeholder="000000"
                        value={formData.businessPincode}
                        onChange={(e) => setFormData({ ...formData, businessPincode: e.target.value })}
                      />
                      {errors.businessPincode && <p className="text-sm text-destructive">{errors.businessPincode}</p>}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <User className="h-5 w-5" />
                    Contact Information
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        placeholder="Full Name"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      />
                      {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="business@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Wholesale Partner Benefits
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Special wholesale pricing with up to 25% discount</li>
                    <li>• Custom quote requests for bulk orders</li>
                    <li>• Priority delivery and support</li>
                    <li>• Credit facility for verified partners</li>
                    <li>• Monthly invoicing option</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WholesaleRegister;
