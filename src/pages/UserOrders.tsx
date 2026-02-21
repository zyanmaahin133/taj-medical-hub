
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UserOrders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items:order_items(*, products:product_id(name, image_url))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <div>Loading your orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Order #{order.id.slice(0,8)}</CardTitle>
                  <CardDescription>Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                </div>
                <Badge>{order.status}</Badge>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Total: ₹{order.total_amount}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>You haven't placed any orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
