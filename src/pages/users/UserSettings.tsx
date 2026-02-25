
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UserSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) {
          toast.error("Could not fetch profile.");
        } else {
          setProfile(data);
        }
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    if (error) toast.error("Failed to update profile.");
    else toast.success("Profile updated successfully!");
  };

  if (isLoading) return <div>Loading settings...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile?.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserSettings;
