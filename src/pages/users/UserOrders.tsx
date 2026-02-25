
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const UserOrders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // ✅ THE FIX: Using the new, correct view for order items
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, total, status, order_items_with_products(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Order #{order.id.slice(0, 8)}...</CardTitle>
                  <CardDescription>Placed on {format(new Date(order.created_at), "PPP")}</CardDescription>
                </div>
                <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize text-sm px-3 py-1">{order.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.order_items_with_products.map((item: any) => (
                    <div key={item.product_id} className="flex justify-between text-sm">
                      <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                    </div>
                  ))}
                </div>
                <p className="text-lg font-semibold text-right">Total: ₹{order.total.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
