
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DoctorSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings management features coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSettings;
