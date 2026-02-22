
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Briefcase } from "lucide-react";

const doctorSchema = z.object({ /* your schema is correct */ });

// ✅ RENAMED to DoctorRegisterForm to reflect its new purpose
const DoctorRegisterForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ /* your form data is correct */ });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error: profileError } = await supabase.from("doctor_profiles").upsert({ user_id: user.id, ...formData }, { onConflict: "user_id" });
      if (profileError) throw profileError;
      const { error: roleError } = await supabase.from("user_roles").upsert({ user_id: user.id, role: "doctor" }, { onConflict: "user_id" });
      if (roleError) throw roleError;
      toast.success("Doctor registration submitted!");
      await queryClient.invalidateQueries({ queryKey: ["doctor-profile", user.id] });
      await queryClient.invalidateQueries({ queryKey: ["user-role", user.id] });
    } catch (error) {
      toast.error("Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ THE FIX: The component now returns ONLY the form card, not a full page layout.
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Briefcase/> Doctor Registration</CardTitle>
        <CardDescription>Submit your professional details for verification.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... all your form inputs from the original file ... */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorRegisterForm;
