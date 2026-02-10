
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminSettings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for application settings. More features will be added soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
