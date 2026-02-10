
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Search, Home, Clock, FileText, 
  CheckCircle2, Star, Beaker, Heart, 
  Activity, ShieldCheck, Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLabTests, useHealthPackages } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

// Fallback data remains the same

interface BookingItem {
  id: string;
  name: string;
  price: number;
  type: 'test' | 'package';
}

const LabTests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");
  const [collectionType, setCollectionType] = useState("home");
  const [address, setAddress] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: dbTests = [] } = useLabTests();
  const { data: dbPackages = [] } = useHealthPackages();
  
  const tests = dbTests.length > 0 ? dbTests : [];
  const packages = dbPackages.length > 0 ? dbPackages : [];

  const filteredTests = tests.filter((test: any) => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (test.category && test.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  const getMrp = (price: number, discount: number) => {
    if (!discount || discount === 0) return null;
    return Math.round(price / (1 - discount / 100));
  };

  const handleBookTest = (item: BookingItem) => {
    if (!user) {
      toast.error("Please login to book a test");
      navigate("/auth");
      return;
    }
    setBookingItem(item);
    setBookingDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleConfirmBooking = async () => {
    // ... (booking logic remains the same)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-16">
        <section className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-primary/10 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Badge className="mb-3 sm:mb-4 bg-secondary">Trusted by 50,000+ customers</Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Book Lab Tests at Home
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Get up to 60% off on all lab tests. Free home sample collection. Reports in 6-24 hours.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for tests, health packages..."
                  className="pl-10 h-11 sm:h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
              {/* ... Features Cards ... */}
          </div>

          <Tabs defaultValue="packages" className="mb-8 sm:mb-12">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto mb-4 sm:mb-6">
              <TabsTrigger value="packages">Health Packages</TabsTrigger>
              <TabsTrigger value="tests">Individual Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="packages">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {packages.map((pkg: any) => {
                  const discount = pkg.original_price 
                    ? Math.round(((pkg.original_price - pkg.discounted_price) / pkg.original_price) * 100)
                    : 0;
                  return (
                    <Card key={pkg.id} className="relative overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                       {/* ... Package Card Content ... */}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="tests">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredTests.map((test: any) => {
                  const mrp = getMrp(test.price, test.discount_percent || 0);
                  return (
                    <Card key={test.id} className="hover:shadow-lg transition-shadow flex flex-col">
                       {/* ... Test Card Content ... */}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* ... Why Choose Us section ... */}
        </div>
      </main>

      <Footer />

      {/* ... Booking Dialog ... */}
    </div>
  );
};

export default LabTests;
