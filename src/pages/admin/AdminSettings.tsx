
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences.</p>
      </div>

      <Separator />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="font-semibold">General Settings</h2>
          <p className="text-sm text-muted-foreground">Basic information about your store.</p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" defaultValue="Taj Medical Store" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">Support Email</Label>
                <Input id="store-email" type="email" defaultValue="support@tajmedical.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="font-semibold">Appearance</h2>
          <p className="text-sm text-muted-foreground">Customize the look and feel of your store.</p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Enable Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Allow users to switch to a dark theme.</p>
                </div>
                <Switch id="dark-mode" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme-color">Primary Theme Color</Label>
                <Input id="theme-color" type="color" defaultValue="#2563eb" className="w-24" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">Connect with third-party services.</p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input id="google-analytics" placeholder="UA-12345678-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                <Input id="facebook-pixel" placeholder="1234567890123456" />
              </div>
              <Button>Save Integrations</Button>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default AdminSettings;
