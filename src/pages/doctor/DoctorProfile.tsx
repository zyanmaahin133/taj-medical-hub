
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DoctorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-3xl">{user?.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl">Dr. {user?.user_metadata?.full_name}</CardTitle>
                    <CardDescription className="text-lg">Doctor</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <p>Profile management features coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfile;
