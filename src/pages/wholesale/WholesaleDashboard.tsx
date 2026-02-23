
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

import WholesaleRegisterForm from "./WholesaleRegister";
import WholesaleProducts from "./WholesaleProducts";
import WholesaleQuotes from "./WholesaleQuotes";
import WholesaleProfile from "./WholesaleProfile";

const DashboardStats = () => (
    <Card><CardContent className="p-6"><h2>Welcome to your Wholesale Dashboard</h2></CardContent></Card>
);

const WholesaleDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "dashboard";

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      // ✅ YOUR FIX: Using .maybeSingle() instead of .single()
      const { data, error } = await supabase.from("wholesale_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (error) {
        console.error("Error fetching wholesale dashboard profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

  // ... (rest of the component is correct) ...
  if (authLoading || profileLoading) {
    return <div>Loading Wholesale Dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return <WholesaleRegisterForm />;
  }

  return (
    <div className="space-y-6">
      {!profile.is_verified && (
        <Card className="border-yellow-500 bg-yellow-50"><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="h-5 w-5 text-yellow-600" /><div><p>Verification Pending</p></div></CardContent></Card>
      )}

      <Tabs value={activeTab} onValueChange={(tab) => navigate(`${location.pathname}?tab=${tab}`)} className="w-full">
        <TabsContent value="dashboard"><DashboardStats /></TabsContent>
        <TabsContent value="products"><WholesaleProducts /></TabsContent>
        <TabsContent value="quotes"><WholesaleQuotes /></TabsContent>
        <TabsContent value="profile"><WholesaleProfile /></TabsContent>
      </Tabs>
    </div>
  );
};

export default WholesaleDashboard;
