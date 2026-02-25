
import { useEffect } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AlertCircle, FileText, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

import WholesaleRegisterForm from "./WholesaleRegister";
import WholesaleProducts from "./WholesaleProducts";
import WholesaleQuotes from "./WholesaleQuotes";
import WholesaleProfile from "./WholesaleProfile";

// ✅ THE FIX: A real, professional dashboard component
const DashboardStats = ({ user, profile }) => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["wholesale-dashboard-stats", user.id],
    queryFn: async () => {
      const { count: total, error: totalError } = await supabase.from("quote_requests").select("id", { count: "exact" }).eq("user_id", user.id);
      if (totalError) throw totalError;

      const { count: approved, error: approvedError } = await supabase.from("quote_requests").select("id", { count: "exact" }).eq("user_id", user.id).eq("status", "accepted");
      if (approvedError) throw approvedError;

      const { count: pending, error: pendingError } = await supabase.from("quote_requests").select("id", { count: "exact" }).eq("user_id", user.id).eq("status", "pending");
      if (pendingError) throw pendingError;

      return { total, approved, pending };
    }
  });

  const { data: recentQuotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ["wholesale-recent-quotes", user.id],
    queryFn: async () => {
        const { data, error } = await supabase.from("quote_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
        if (error) throw error;
        return data;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {profile.business_name}</h1>
        <p className="text-muted-foreground">Here is a summary of your quote requests.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Requests</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.total ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Approved Quotes</CardTitle><CheckCircle className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.approved ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Requests</CardTitle><Clock className="h-4 w-4 text-yellow-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.pending ?? 0}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
            <div><CardTitle>Recent Quote Requests</CardTitle><CardDescription>Your 5 most recent requests.</CardDescription></div>
            <Button asChild variant="outline" size="sm"><Link to="/wholesale/dashboard?tab=quotes">View All <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Items</TableHead></TableRow></TableHeader>
                <TableBody>
                    {quotesLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
                    {!quotesLoading && recentQuotes.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24">No quote requests found.</TableCell></TableRow>}
                    {!quotesLoading && recentQuotes.map(quote => (
                        <TableRow key={quote.id}>
                            <TableCell className="font-medium">{format(new Date(quote.created_at), "PPP")}</TableCell>
                            <TableCell><Badge>{quote.status}</Badge></TableCell>
                            <TableCell className="text-right">{quote.items.length}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const WholesaleDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "dashboard";

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["wholesale-profile", user?.id],
    queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from("wholesale_profiles").select("*").eq("user_id", user.id).maybeSingle(); if (error) { console.error("Error fetching wholesale dashboard profile:", error); return null; } return data; },
    enabled: !!user,
  });

  useEffect(() => { if (!user) return; const channel = supabase.channel(`wholesale_profile_${user.id}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wholesale_profiles', filter: `user_id=eq.${user.id}` }, (payload) => { queryClient.invalidateQueries({ queryKey: ["wholesale-profile", user.id] }); }).subscribe(); return () => { supabase.removeChannel(channel); }; }, [user, queryClient]);

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
        <Card className="border-yellow-500 bg-yellow-50"><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="h-5 w-5 text-yellow-600" /><div><p className="font-medium text-yellow-800">Verification Pending</p><p className="text-sm text-yellow-700">Your account is under review. You will be notified once it is approved.</p></div></CardContent></Card>
      )}
      {profile.is_verified ? (
        <Tabs value={activeTab} onValueChange={(tab) => navigate(`${location.pathname}?tab=${tab}`)} className="w-full">
          <TabsContent value="dashboard"><DashboardStats user={user} profile={profile} /></TabsContent>
          <TabsContent value="products"><WholesaleProducts /></TabsContent>
          <TabsContent value="quotes"><WholesaleQuotes /></TabsContent>
          <TabsContent value="profile"><WholesaleProfile /></TabsContent>
        </Tabs>
      ) : (
        <p className="text-center text-muted-foreground">Please wait for admin approval to access dashboard features.</p>
      )}
    </div>
  );
};

export default WholesaleDashboard;
