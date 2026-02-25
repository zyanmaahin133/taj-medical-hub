
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UploadCloud, File, X, Loader2 } from "lucide-react";

const UploadPrescription = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !user) {
      toast.error("Please select a file and ensure you are logged in.");
      return;
    }
    setUploading(true);
    try {
      const filePath = `prescriptions/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('prescriptions').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('prescriptions').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('prescriptions').insert({
        user_id: user.id,
        image_url: urlData.publicUrl
      });
      if (dbError) throw dbError;

      toast.success("Prescription uploaded successfully! We will contact you shortly.");
      setFile(null);
    } catch (error: any) {
      toast.error("Upload failed", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Prescription</CardTitle>
          <CardDescription>Upload a clear image of your prescription to get a quote and place your order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="prescription-upload" className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
              {file ? (
                <div className="text-center">
                  <File className="mx-auto h-12 w-12 text-primary" />
                  <p className="mt-2 font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</p>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (MAX. 5MB)</p>
                </div>
              )}
            </label>
            <Input id="prescription-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" />
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
              <span className="font-medium text-sm truncate">{file.name}</span>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!file || uploading} className="w-full" size="lg">
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload & Get Quote"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPrescription;
