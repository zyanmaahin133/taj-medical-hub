
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const queryClient = useQueryClient();

  // Fetch settings from the database
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_settings").select("*").single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found, which is fine on first load
      return data || {};
    },
  });

  // State to manage local form changes
  const [localSettings, setLocalSettings] = useState(null);

  // Update local state when settings are fetched
  useState(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Mutation to update settings
  const { mutate: updateSettings, isLoading: isSaving } = useMutation({
    mutationFn: async (newSettings) => {
      // Use upsert with a fixed ID (e.g., 1) for the single settings row
      const { error } = await supabase.from("admin_settings").upsert({ id: 1, ...newSettings });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved successfully!");
      queryClient.invalidateQueries(["admin-settings"]);
    },
    onError: (error) => {
      toast.error(`Error saving settings: ${error.message}`);
    },
  });

  const handleSave = () => {
    updateSettings(localSettings);
  };

  if (isLoading || !localSettings) return <div>Loading settings...</div>;

  const handleInputChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings, integrations, and preferences.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Basic information about your store.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input value={localSettings.store_name || ""} onChange={e => handleInputChange("store_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input type="email" value={localSettings.support_email || ""} onChange={e => handleInputChange("support_email", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payment Gateway</CardTitle><CardDescription>Connect your Razorpay account.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label>Razorpay Key ID</Label>
            <Input placeholder="rzp_live_..." value={localSettings.razorpay_key_id || ""} onChange={e => handleInputChange("razorpay_key_id", e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label>Razorpay Key Secret</Label>
            <Input type="password" placeholder="••••••••••••••••" value={localSettings.razorpay_key_secret || ""} onChange={e => handleInputChange("razorpay_key_secret", e.target.value)}/>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save All Settings"}</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
