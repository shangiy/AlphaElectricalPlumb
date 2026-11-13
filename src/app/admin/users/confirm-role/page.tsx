'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { promoteUserAdmin } from '@/app/actions/user-actions';
import { useState, Suspense } from 'react';
import { Loader2, ShieldCheck, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

function ConfirmRoleContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    const userId = searchParams.get('id');
    const email = searchParams.get('email');
    const role = searchParams.get('role') as 'admin' | 'staff' | 'user';
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!userId || !email || !role) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Invalid Request</h1>
                <p className="mt-4">Missing parameters for role confirmation.</p>
                <Button asChild className="mt-6"><Link href="/admin/users">Return to Directory</Link></Button>
            </div>
        );
    }

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await promoteUserAdmin(email, role);
            setIsSuccess(true);
            toast({
                title: "Credential Sync Complete",
                description: `User ${email} has been provisioned as ${role}.`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Sync Failed",
                description: error.message || "Could not synchronize user credentials.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden">
                <CardHeader className="bg-accent text-white p-10 text-center">
                    <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-6">
                        <ShieldCheck className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Security Authorization</CardTitle>
                    <CardDescription className="text-white/60 font-medium">
                        You are about to modify administrative credentials for a team member.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                    {!isSuccess ? (
                        <>
                            <div className="space-y-6">
                                <div className="p-6 rounded-3xl bg-muted/30 border border-dashed flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Identity</span>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <span className="text-xl font-bold text-accent">{email}</span>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Provisioned Access Level</span>
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xl font-black uppercase text-primary tracking-tight">{role} STATUS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground leading-relaxed italic">
                                Note: Confirming this will synchronize the user's email credentials with the Alpha administrative node. The user will receive an automated verification of their new clearance level.
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={handleConfirm} 
                                    disabled={isProcessing}
                                    className="w-full h-16 rounded-full font-black uppercase tracking-widest text-lg bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl text-white"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin mr-3 h-6 w-6" /> : null}
                                    {isProcessing ? 'SYNCHRONIZING...' : 'CONFIRM & SYNC CREDENTIALS'}
                                </Button>
                                <Button asChild variant="ghost" className="rounded-full h-12">
                                    <Link href="/admin/users">Cancel Operation</Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 space-y-8">
                            <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-600">
                                <CheckCircle size={64} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-accent uppercase tracking-tighter">Credentials Synchronized</h3>
                                <p className="text-muted-foreground font-medium mt-2">
                                    Clearance updated to <span className="text-primary font-bold uppercase">{role}</span> for {email}.
                                </p>
                            </div>
                            <Button asChild className="rounded-full h-14 px-10 font-black uppercase bg-primary text-white">
                                <Link href="/admin/users">Return to Directory</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ConfirmRolePage() {
    return (
        <AuthGuard allowedRoles={['admin']}>
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="font-black text-muted-foreground uppercase tracking-widest">Loading Authorization Node...</p>
                </div>
            }>
                <ConfirmRoleContent />
            </Suspense>
        </AuthGuard>
    );
}
