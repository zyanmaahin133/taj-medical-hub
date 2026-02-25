
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const UserPrescriptions = () => {
  const { user } = useAuth();
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ["user-prescriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <div>Loading your prescriptions...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Prescriptions</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions && prescriptions.length > 0 ? (
          prescriptions.map(p => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>Prescription #{p.id}</CardTitle>
                <CardDescription>Uploaded on {new Date(p.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={p.image_url} alt={`Prescription ${p.id}`} className="rounded-md" />
              </CardContent>
            </Card>
          ))
        ) : (
          <p>You haven't uploaded any prescriptions yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserPrescriptions;
