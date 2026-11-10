'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/context/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn as nextAuthSignIn } from 'next-auth/react';

const loginSchema = z.object({
  email: z.string().email('Valid email required.'),
  password: z.string().min(1, 'Password required.'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name required.'),
  username: z.string().min(3, 'Username required.'),
  email: z.string().email('Valid email required.'),
  password: z.string().min(8, '8 chars min.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { message: "Mismatch", path: ["confirmPassword"] });

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7.02-3.15-7.02-7.02s3.15-7.02 7.02-7.02c2.21 0 3.66.86 4.5 1.69l2.5-2.5C18.16 3.15 15.66 2 12.48 2 6.94 2 2.53 6.4 2.53 12s4.41 10 9.95 10c2.82 0 5.16-1 6.9-2.72 1.83-1.83 2.36-4.49 2.36-6.52 0-.6-.05-1.15-.15-1.7H12.48z"/></svg>
);

export default function LoginForm() {
    const { user, login, signUp, signInWithFacebook } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [processing, setProcessing] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const activeTab = searchParams.get('tab') || 'login';

    useEffect(() => {
        if (user) {
            const redir = searchParams.get('redirect') || (user.role === 'user' ? '/' : '/admin');
            router.push(redir);
        }
    }, [user, router, searchParams]);

    const lForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
    const sForm = useForm<z.infer<typeof signUpSchema>>({ resolver: zodResolver(signUpSchema), defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "" } });

    const handleSocial = async (p: string) => {
        setProcessing(true);
        try { if (p === 'google') await nextAuthSignIn('google'); else if (p === 'facebook') await signInWithFacebook(); }
        catch (e: any) { toast({ variant: 'destructive', description: e.message }); }
        finally { setProcessing(false); }
    };

    return (
        <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
            <Tabs value={activeTab} onValueChange={(t) => router.push(`/auth/login?tab=${t}`)} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 rounded-2xl">
                    <TabsTrigger value="login" className="rounded-xl font-bold">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-xl font-bold">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card className="rounded-[2rem] shadow-xl overflow-hidden">
                        <CardHeader className="bg-muted/10 pb-8">
                            <CardTitle className="text-2xl font-black uppercase text-accent">Welcome Back</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <Form {...lForm}>
                                <form onSubmit={lForm.handleSubmit(async d => { setProcessing(true); try { await login(d.email, d.password); } catch(e:any) { toast({ variant: 'destructive', description: e.message }); } finally { setProcessing(false); } })} className="space-y-5">
                                    <FormField control={lForm.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                                            <FormControl><Input placeholder="you@email.com" {...field} autoComplete="nope" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} className="h-12 rounded-xl" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={lForm.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                                            <div className="relative">
                                                <Input type={showPass ? "text" : "password"} {...field} autoComplete="new-password" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} className="h-12 rounded-xl" />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg" disabled={processing}>{processing ? <Loader2 className="animate-spin h-4 w-4" /> : "Log In"}</Button>
                                    <div className="relative pt-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-card px-2 text-muted-foreground">Or Synchronize</span></div></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" type="button" onClick={() => handleSocial('google')} className="h-11 rounded-xl font-bold"><GoogleIcon /><span className="ml-2">Google</span></Button>
                                        <Button variant="outline" type="button" onClick={() => handleSocial('facebook')} className="h-11 rounded-xl font-bold"><span className="ml-2">Facebook</span></Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card className="rounded-[2rem] shadow-xl overflow-hidden">
                        <CardHeader className="bg-muted/10 pb-8"><CardTitle className="text-2xl font-black uppercase text-accent">Join Alpha</CardTitle></CardHeader>
                        <CardContent className="pt-8">
                            <Form {...sForm}>
                                <form onSubmit={sForm.handleSubmit(async d => { setProcessing(true); try { await signUp(d); } catch(e:any) { toast({ variant: 'destructive', description: e.message }); } finally { setProcessing(false); } })} className="space-y-4">
                                    <FormField control={sForm.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} className="h-11 rounded-xl" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={sForm.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Email</FormLabel><FormControl><Input placeholder="you@email.com" {...field} autoComplete="nope" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} className="h-11 rounded-xl" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={sForm.control} name="password" render={({ field }) => (
                                        <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Password</FormLabel><FormControl><Input type="password" placeholder="8+ chars" {...field} autoComplete="new-password" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} className="h-11 rounded-xl" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg mt-4" disabled={processing}>{processing ? <Loader2 className="animate-spin h-4 w-4" /> : "Create Account"}</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
