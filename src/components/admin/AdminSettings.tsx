'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, KeyRound, UserPlus, AlertCircle } from 'lucide-react';
import { promoteUserAdmin } from '@/app/actions/user-actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminSettings() {
  const { toast } = useToast();
  
  // Password Reset State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Promotion State
  const [targetEmail, setTargetEmail] = useState('');
  const [targetRole, setTargetRole] = useState<'admin' | 'staff' | 'user'>('staff');
  const [isPromoting, setIsPromoting] = useState(false);

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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black font-headline text-accent tracking-tighter uppercase">Admin Security</h2>
        <p className="text-muted-foreground text-sm font-medium">Control access and credentials for the Alpha ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PASSWORD RESET CARD */}
        <div className="space-y-4">
          <span className={sectionLabel}>Identity Protection</span>
          <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b p-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <KeyRound className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Change Password</CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground uppercase">Rotate your login credentials</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground/80">New Administrator Password</Label>
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
                  <Label className="text-xs font-black uppercase text-muted-foreground/80">Confirm New Password</Label>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button disabled={isResetting} type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-wider shadow-lg bg-accent text-white">
                  {isResetting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                  Update Credentials
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* TEAM PROMOTION CARD */}
        <div className="space-y-4">
          <span className={sectionLabel}>Access Management</span>
          <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b p-8">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <UserPlus className="text-blue-600 h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Promote Team Member</CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground uppercase">Assign roles via Supabase Admin</CardDescription>
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
                <Button disabled={isPromoting} type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-wider shadow-lg bg-primary text-white">
                  {isPromoting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                  Assign Role
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>

      <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-200 flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
        <div>
          <p className="text-sm font-bold text-amber-900 uppercase tracking-tight">Security Protocol Reminder</p>
          <p className="text-sm text-amber-700 mt-1 leading-relaxed">
            Role modifications and password updates are synchronized instantly across the global cluster. Changes made here bypass standard Row Level Security via the service-role handshake. Use caution when promoting users to Administrator level.
          </p>
        </div>
      </div>
    </div>
  );
}
