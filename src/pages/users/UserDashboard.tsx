
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, Upload, PlusCircle, Stethoscope, TestTube, Badge } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { format } from "date-fns";

const UserDashboard = () => {
  const { user } = useAuth();
  const { isWholesale, isAdmin, isDoctor } = useUserRole();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["user-dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { count: orderCount } = await supabase.from("orders").select("id", { count: "exact" }).eq("user_id", user.id);
      const { count: prescriptionCount } = await supabase.from("prescriptions").select("id", { count: "exact" }).eq("user_id", user.id);
      const { data: upcomingAppointment } = await supabase.from("appointments").select("*, doctors(name,specialty)").eq("user_id", user.id).gte("appointment_date", new Date().toISOString()).order("appointment_date").limit(1).single();
      const { data: recentOrders } = await supabase.from("orders").select("id, created_at, total, status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
      return { orderCount, prescriptionCount, upcomingAppointment, recentOrders };
    },
    enabled: !!user && !isAdmin && !isWholesale && !isDoctor,
  });

  if (isAdmin || isWholesale || isDoctor) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.full_name || 'Valued Customer'}!</h1>
        <p className="text-muted-foreground">Your personal health and wellness dashboard.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/doctors"><Button variant="outline" className="w-full h-24 text-lg flex-col gap-2"><Stethoscope className="h-6 w-6"/> Book Appointment</Button></Link>
        <Link to="/shop"><Button variant="outline" className="w-full h-24 text-lg flex-col gap-2"><ShoppingCart className="h-6 w-6"/> Order Medicines</Button></Link>
        <Link to="/upload-prescription"><Button variant="outline" className="w-full h-24 text-lg flex-col gap-2"><Upload className="mr-2 h-6 w-6"/> Upload Prescription</Button></Link>
        <Link to="/lab-tests"><Button variant="outline" className="w-full h-24 text-lg flex-col gap-2"><TestTube className="h-6 w-6"/> Book a Lab Test</Button></Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Upcoming Appointment</CardTitle><CardDescription>Your next scheduled consultation.</CardDescription></CardHeader>
          <CardContent>
            {isLoading ? <p>Loading...</p> : dashboardData?.upcomingAppointment ? (
              <div className="space-y-2">
                <p className="font-semibold text-lg">Dr. {dashboardData.upcomingAppointment.doctors.name}</p>
                <p className="text-sm text-muted-foreground">{dashboardData.upcomingAppointment.doctors.specialty}</p>
                <p className="font-medium">{format(new Date(dashboardData.upcomingAppointment.appointment_date), "EEEE, MMMM d, yyyy 'at' p")}</p>
              </div>
            ) : <p className="text-muted-foreground py-4 text-center">No upcoming appointments.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle><CardDescription>Your last 3 medicine orders.</CardDescription></CardHeader>
          <CardContent>
            {/* ✅ THE FIX: Corrected the closing parenthesis */}
            {isLoading ? <p>Loading...</p> : dashboardData?.recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(order.created_at), "PPP")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total?.toFixed(2)}</p>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-center">No recent orders.</p>
            )}
            <Button asChild variant="link" className="mt-4 px-0"><Link to="/orders">View All Orders</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
