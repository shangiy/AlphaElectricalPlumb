'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, KeyRound, UserPlus, AlertCircle, User as UserIcon, Camera, Save } from 'lucide-react';
import { promoteUserAdmin } from '@/app/actions/user-actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AvatarSelectionDialog from '@/components/auth/AvatarSelectionDialog';

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  // Profile Management State
  const [profileName, setProfileName] = useState('');
  const [profileUsername, setProfileUsername] = useState('');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  // Password Reset State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Promotion State
  const [targetEmail, setTargetEmail] = useState('');
  const [targetRole, setTargetRole] = useState<'admin' | 'staff' | 'user'>('staff');
  const [isPromoting, setIsPromoting] = useState(false);

  // Initialize profile state from user context
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileUsername(user.username || '');
      setProfileAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;

    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileName,
          username: profileUsername,
          avatar_url: profileAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local context
      updateUser({
        name: profileName,
        username: profileUsername,
        avatarUrl: profileAvatarUrl
      });

      toast({ 
        title: 'Profile Synchronized', 
        description: 'Your professional identity has been updated across the ecosystem.' 
      });
    } catch (err: any) {
      console.error("Admin Profile Update Error:", err);
      toast({ 
        variant: 'destructive', 
        title: 'Update Failed', 
        description: err.message || "Could not save profile changes." 
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarSelect = (url: string) => {
    setProfileAvatarUrl(url);
    toast({
        title: 'Avatar Staged',
        description: 'New profile picture selected. Click "Save Identity" to apply changes.',
    });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Mismatch', description: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ variant: 'destructive', title: 'Weak Password', description: 'Minimum 8 characters required.' });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: 'Success', description: 'Your administrator password has been updated.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Reset Failed', description: err.message });
    } finally {
      setIsResetting(false);
    }
  };

  const handlePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail) return;

    setIsPromoting(true);
    try {
      const result = await promoteUserAdmin(targetEmail, targetRole);
      toast({ 
        title: 'Role Updated', 
        description: `User "${result.name}" is now assigned as ${targetRole}.` 
      });
      setTargetEmail('');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Promotion Error', description: err.message });
    } finally {
      setIsPromoting(false);
    }
  };

  const sectionLabel = "text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-4 block";

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <AvatarSelectionDialog 
        isOpen={isAvatarDialogOpen}
        onClose={() => setIsAvatarDialogOpen(false)}
        onSelect={handleAvatarSelect}
      />

      <div>
        <h2 className="text-4xl font-black font-headline text-accent tracking-tighter uppercase">Command Center Settings</h2>
        <p className="text-muted-foreground text-sm font-medium">Manage your professional persona and platform governance.</p>
      </div>

      {/* PERSONAL PROFILE SECTION */}
      <div className="space-y-4">
        <span className={sectionLabel}>Identity Portfolio</span>
        <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
          <CardHeader className="bg-primary/5 border-b p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-accent">Personal Profile</CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Update your public-facing administrator details</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="relative group shrink-0">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-1 ring-primary/20">
                    <AvatarImage src={profileAvatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-accent text-white">
                      <UserIcon size={48} />
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={() => setIsAvatarDialogOpen(true)}
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-2xl bg-primary shadow-xl hover:scale-110 transition-transform"
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest">Full Display Name</Label>
                    <Input 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      placeholder="e.g., Richard Kinyungu" 
                      className="h-12 rounded-xl bg-muted/20 border-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest">Admin Username</Label>
                    <Input 
                      value={profileUsername} 
                      onChange={(e) => setProfileUsername(e.target.value)} 
                      placeholder="richard_admin" 
                      className="h-12 rounded-xl bg-muted/20 border-none font-bold"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-dashed">
                <Button 
                  disabled={isSavingProfile} 
                  type="submit" 
                  className="rounded-full h-14 px-12 font-black uppercase tracking-widest shadow-xl bg-primary text-white hover:scale-105 active:scale-95 transition-all"
                >
                  {isSavingProfile ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Save className="h-5 w-5 mr-3" />}
                  Save Identity
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* PASSWORD RESET CARD */}
        <div className="space-y-4">
          <span className={sectionLabel}>System Credential</span>
          <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden h-full">
            <CardHeader className="bg-muted/30 border-b p-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <KeyRound className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Change Password</CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground uppercase">Rotate your secure login credentials</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground/80">New Password</Label>
                  <Input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground/80">Confirm Password</Label>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button disabled={isResetting} type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-wider shadow-lg bg-accent text-white mt-4">
                  {isResetting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                  Update Key
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* TEAM PROMOTION CARD */}
        <div className="space-y-4">
          <span className={sectionLabel}>Access Management</span>
          <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden h-full">
            <CardHeader className="bg-muted/30 border-b p-8">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <UserPlus className="text-blue-600 h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Promote Team Member</CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground uppercase">Assign roles via Supabase Handshake</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handlePromotion} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground/80">User Email Address</Label>
                  <Input 
                    type="email" 
                    value={targetEmail} 
                    onChange={(e) => setTargetEmail(e.target.value)} 
                    placeholder="colleague@alpha.com" 
                    required 
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground/80">Target Permission Level</Label>
                  <Select value={targetRole} onValueChange={(val: any) => setTargetRole(val)}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                      <SelectItem value="staff">Staff (Limited Management)</SelectItem>
                      <SelectItem value="user">User (Customer Level)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button disabled={isPromoting} type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-wider shadow-lg bg-primary text-white mt-4">
                  {isPromoting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                  Provision Role
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>

      <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-200 flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
        <div>
          <p className="text-sm font-bold text-amber-900 uppercase tracking-tight">Security Governance Reminder</p>
          <p className="text-sm text-amber-700 mt-1 leading-relaxed">
            Personal identity modifications and security credential updates are synchronized instantly across the Alpha global node cluster. Changes made in this portal bypass standard RLS constraints via the administrative service-role handshake.
          </p>
        </div>
      </div>
    </div>
  );
}
