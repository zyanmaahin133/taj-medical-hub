import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, Users, Stethoscope, TestTube, TrendingUp, 
  TrendingDown, DollarSign, Package, Calendar, Clock, FileText,
  Store, Megaphone
} from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  // Fetch real stats
  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total, created_at, status");
      if (error) throw error;
      return data;
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ["admin-appointments-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id, status, appointment_date, appointment_time, doctor_id, doctors(name)")
        .order("appointment_date", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: wholesaleData } = useQuery({
    queryKey: ["admin-wholesale-pending"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("wholesale_profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_verified", false);
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: quoteRequests } = useQuery({
    queryKey: ["admin-quotes-pending"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count || 0;
    },
  });

  const totalOrders = ordersData?.length || 0;
  const totalRevenue = ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
  const recentOrders = ordersData?.slice(0, 5) || [];

  const stats = [
    { title: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart, color: "bg-blue-500" },
    { title: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-500" },
    { title: "Registered Users", value: (usersData || 0).toLocaleString(), icon: Users, color: "bg-purple-500" },
    { title: "Pending Wholesale", value: (wholesaleData || 0).toString(), icon: Store, color: "bg-orange-500" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500";
      case "shipped": return "bg-blue-500";
      case "processing": return "bg-orange-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {((wholesaleData || 0) > 0 || (quoteRequests || 0) > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {(wholesaleData || 0) > 0 && (
            <Link to="/admin/wholesale">
              <Card className="border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Store className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">{wholesaleData} Wholesale Partner{wholesaleData > 1 ? 's' : ''} Pending Verification</p>
                    <p className="text-sm text-orange-700">Click to review</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          {(quoteRequests || 0) > 0 && (
            <Link to="/admin/wholesale">
              <Card className="border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">{quoteRequests} Quote Request{quoteRequests > 1 ? 's' : ''} Pending</p>
                    <p className="text-sm text-blue-700">Click to respond</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), "PP")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total}</p>
                      <Badge className={`${getStatusColor(order.status)} text-xs`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Link to="/admin/doctors" className="text-sm text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {!appointmentsData || appointmentsData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {appointmentsData.map((apt: any) => (
                  <div key={apt.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{(apt.doctors as any)?.name || "Doctor"}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(apt.appointment_date), "PP")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{apt.appointment_time}</span>
                      </div>
                      <Badge variant="outline">{apt.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link to="/admin/products" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Add Product</p>
            </Link>
            <Link to="/admin/doctors" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <Stethoscope className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <p className="text-sm font-medium">Add Doctor</p>
            </Link>
            <Link to="/admin/lab-tests" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <TestTube className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Add Lab Test</p>
            </Link>
            <Link to="/admin/advertisements" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <Megaphone className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-sm font-medium">Manage Ads</p>
            </Link>
            <Link to="/admin/wholesale" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <Store className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Wholesale</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
