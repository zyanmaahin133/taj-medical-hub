
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Camera, User, Mail, Lock, MapPin, Heart, Shield, Pill, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error && error.code !== 'PGRST116') throw error;
        setProfile(data);
      } catch (error) {
        toast.error('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || !profile) return;
    setUpdating(true);
    const { error } = await supabase.from('profiles').update({
        full_name: profile.full_name,
        age: profile.age,
        gender: profile.gender,
        location: profile.location,
        medical_history: profile.medical_history,
        current_medications: profile.current_medications,
        allergies: profile.allergies,
    }).eq('id', user.id);

    if (error) {
      toast.error('Update failed', { description: error.message });
    } else {
      toast.success('Profile updated successfully!');
    }
    setUpdating(false);
  };

  const handleInputChange = (field, value) => {
    setProfile(p => ({...p, [field]: value}))
  }

  async function uploadAvatar(event) {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const newAvatarUrl = data.publicUrl;
      await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user.id);
      setProfile(p => ({...p, avatar_url: newAvatarUrl}));
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Error uploading avatar', { description: error.message });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center gap-6">
            <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary"><AvatarImage src={profile?.avatar_url} /><AvatarFallback className="text-3xl">{profile?.full_name?.charAt(0)}</AvatarFallback></Avatar>
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 cursor-pointer p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading}/>
                </label>
            </div>
            <div>
                <h1 className="text-3xl font-bold">{profile?.full_name || 'My Profile'}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
            </div>
        </div>

        <form onSubmit={handleUpdateProfile}>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader><CardTitle>Personal & Contact Details</CardTitle></CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1"><Label>Full Name</Label><Input value={profile?.full_name || ''} onChange={e => handleInputChange('full_name', e.target.value)} /></div>
                            <div className="space-y-1"><Label>Email</Label><Input value={user?.email || ''} disabled /></div>
                            <div className="space-y-1"><Label>Age</Label><Input type="number" value={profile?.age || ''} onChange={e => handleInputChange('age', e.target.value)} /></div>
                            <div className="space-y-1"><Label>Gender</Label><Input value={profile?.gender || ''} onChange={e => handleInputChange('gender', e.target.value)} /></div>
                            <div className="sm:col-span-2 space-y-1"><Label>Location</Label><Input value={profile?.location || ''} onChange={e => handleInputChange('location', e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1"><Label>Medical History (e.g., Hypertension, Diabetes)</Label><Textarea value={profile?.medical_history || ''} onChange={e => handleInputChange('medical_history', e.target.value)} /></div>
                            <div className="space-y-1"><Label>Current Medications</Label><Textarea value={profile?.current_medications || ''} onChange={e => handleInputChange('current_medications', e.target.value)} /></div>
                            <div className="space-y-1"><Label>Allergies</Label><Textarea value={profile?.allergies || ''} onChange={e => handleInputChange('allergies', e.target.value)} /></div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>Account Security</CardTitle></CardHeader>
                        <CardContent>
                             <Button variant="outline" className="w-full" onClick={() => navigate('/auth')}>Change Password</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <Button type="submit" size="lg" disabled={updating || uploading}>
                    {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save All Changes</>}
                </Button>
            </div>
        </form>
    </div>
  );
};

export default Profile;
