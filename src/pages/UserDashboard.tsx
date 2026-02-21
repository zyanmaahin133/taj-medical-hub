
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const UserDashboard = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["user-dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { count: orderCount } = await supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: prescriptionCount } = await supabase.from("prescriptions").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      const { data: recentOrders } = await supabase.from("orders").select("id, created_at, total_amount, status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
      return { orderCount, prescriptionCount, recentOrders };
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Total Orders</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{dashboardData?.orderCount ?? 0}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Prescriptions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{dashboardData?.prescriptionCount ?? 0}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Appointments</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/upload-prescription"><Button className="w-full h-20 text-lg"><Upload className="mr-2 h-5 w-5"/> Upload Prescription</Button></Link>
        <Link to="/lab-tests"><Button variant="secondary" className="w-full h-20 text-lg"><PlusCircle className="mr-2 h-5 w-5"/> Book a Test</Button></Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <p>Loading...</p> : dashboardData?.recentOrders?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold">₹{order.total_amount}</p>
                </div>
              ))}
            </div>
          ) : <p>No recent orders.</p>}
          <Button asChild variant="link" className="mt-4 px-0"><Link to="/orders">View All</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
