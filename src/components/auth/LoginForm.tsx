'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Loader2, Gift, Check } from 'lucide-react';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import ReCAPTCHA from 'react-google-recaptcha';
import { verifyRecaptcha } from '@/app/actions/verify-recaptcha';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Valid email required.'),
  password: z.string().min(1, 'Password required.'),
});

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name required.'),
  lastName: z.string().min(2, 'Last name required.'),
  email: z.string().email('Valid email required.'),
  password: z.string().min(8, '8 chars min.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { 
  message: "Passwords do not match.", 
  path: ["confirmPassword"] 
});

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7.02-3.15-7.02-7.02s3.15-7.02 7.02-7.02c2.21 0 3.66.86 4.5 1.69l2.5-2.5C18.16 3.15 15.66 2 12.48 2 6.94 2 2.53 6.4 2.53 12s4.41 10 9.95 10c2.82 0 5.16-1 6.9-2.72 1.83-1.83 2.36-4.49 2.36-6.52 0-.6-.05-1.15-.15-1.7H12.48z"/></svg>
);

const AppleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.82-.78.897-1.454 2.337-1.273 3.713 1.337.104 2.714-.69 3.56-1.703z"/></svg>
);

const GithubIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.082.814-.26.814-.577 0-.285-.021-1.04-.032-2.037-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.517-1.305.96-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);

export default function LoginForm() {
    const { user, login, signUp, signInWithFacebook, signInWithApple, signInWithGithub } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    const [processing, setProcessing] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const activeTab = searchParams.get('tab') || 'login';

    useEffect(() => {
        if (user) {
            const redirectParam = searchParams.get('redirect');
            let target = redirectParam;

            if (!target) {
                if (user.role === 'staff') {
                    target = '/admin/products'; 
                } else if (user.role === 'admin') {
                    target = '/admin'; 
                } else {
                    target = '/#featured-products'; 
                }
            }

            router.push(target);
        }
    }, [user, router, searchParams]);

    const lForm = useForm<z.infer<typeof loginSchema>>({ 
      resolver: zodResolver(loginSchema), 
      defaultValues: { email: "", password: "" } 
    });

    const sForm = useForm<z.infer<typeof signUpSchema>>({ 
      resolver: zodResolver(signUpSchema), 
      defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" } 
    });

    const handleSocial = async (p: string) => {
        setProcessing(true);
        try { 
          if (p === 'google') await nextAuthSignIn('google'); 
          else if (p === 'facebook') await signInWithFacebook(); 
          else if (p === 'apple') await signInWithApple();
          else if (p === 'github') await signInWithGithub();
        }
        catch (e: any) { 
          toast({ 
            variant: 'destructive', 
            title: "OAuth Link Failure",
            description: e.message || "Could not establish connection with provider." 
          }); 
        }
        finally { setProcessing(false); }
    };

    const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
      setProcessing(true);
      try {
        await login(data.email, data.password);
        toast({
          title: "Access Granted",
          description: "Syncing your professional dashboard..."
        });
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: "Access Denied",
          description: e.message || "Invalid credentials. Please verify your password."
        });
      } finally {
        setProcessing(false);
      }
    };

    const onSignUpSubmit = async (data: z.infer<typeof signUpSchema>) => {
      if (!captchaToken) {
        toast({
          variant: "destructive",
          title: "Bot Protection",
          description: "Please complete the reCAPTCHA verification to proceed."
        });
        return;
      }

      setProcessing(true);
      try {
        const verification = await verifyRecaptcha(captchaToken);
        if (!verification.success) {
            throw new Error(verification.message || "Security verification failed.");
        }

        await signUp({
          name: `${data.firstName} ${data.lastName}`,
          username: data.email.split('@')[0],
          email: data.email,
          password: data.password
        });
        
        toast({
          title: "Identity Synchronized",
          description: "Welcome to Alpha Electricals & Plumbing Ltd! Redirecting..."
        });
      } catch (e: any) {
        toast({ 
          variant: 'destructive', 
          title: "Provisioning Error", 
          description: e.message || "Cloud handshake failed. Please refresh and try again." 
        });
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } finally {
        setProcessing(false);
      }
    };

    const sectionLabel = "text-[13px] font-black text-accent mb-4 block border-b pb-2 border-muted";
    const inputLabel = "text-[11px] font-bold text-slate-700 mb-1 flex items-center";

    return (
        <div className="container mx-auto flex min-h-[90vh] items-center justify-center px-4 py-12">
            <Tabs value={activeTab} onValueChange={(t) => router.push(`/auth/login?tab=${t}`)} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/30 p-1.5 rounded-[1.5rem] mb-6">
                    <TabsTrigger value="login" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <Card className="rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border-none overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <CardHeader className="bg-muted/5 border-b border-muted/20 pb-8 pt-10">
                            <CardTitle className="text-2xl font-black uppercase text-accent tracking-tighter text-center">Welcome Back</CardTitle>
                            <CardDescription className="text-center font-medium mt-1">Enter your credentials to access your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-10 space-y-6">
                            <Form {...lForm}>
                                <form 
                                    autoComplete="off"
                                    onSubmit={lForm.handleSubmit(onLoginSubmit)} 
                                    className="space-y-5"
                                >
                                    <FormField control={lForm.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credential Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="you@email.com" 
                                                    {...field} 
                                                    className="h-14 rounded-2xl border-muted-foreground/10 bg-secondary/5 focus:bg-white transition-all text-base font-medium" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={lForm.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                                            <div className="relative">
                                                <Input 
                                                    type={showPass ? "text" : "password"} 
                                                    {...field} 
                                                    className="h-14 rounded-2xl border-muted-foreground/10 bg-secondary/5 focus:bg-white transition-all text-base font-medium pr-12" 
                                                />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl bg-accent text-white hover:scale-[1.02] active:scale-95 transition-all text-sm mt-4" disabled={processing}>
                                      {processing ? <Loader2 className="animate-spin h-5 w-5" /> : "Initiate Login"}
                                    </Button>

                                    <div className="text-right">
                                      <button 
                                        type="button" 
                                        className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                                        onClick={() => toast({ title: "Account Recovery", description: "Password reset functionality will be enabled soon. Contact admin for manual reset." })}
                                      >
                                        Forgot password?
                                      </button>
                                    </div>

                                    <div className="relative py-6">
                                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted/40" /></div>
                                      <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-white px-4 text-muted-foreground tracking-[0.2em]">Social Handshake</span></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" type="button" onClick={() => handleSocial('google')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                          <GoogleIcon /><span className="ml-2">Google</span>
                                        </Button>
                                        <Button variant="outline" type="button" onClick={() => handleSocial('facebook')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                          <span className="ml-2">Facebook</span>
                                        </Button>
                                        <Button variant="outline" type="button" onClick={() => handleSocial('apple')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                          <AppleIcon /><span className="ml-2">Apple</span>
                                        </Button>
                                        <Button variant="outline" type="button" onClick={() => handleSocial('github')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                          <GithubIcon /><span className="ml-2">GitHub</span>
                                        </Button>
                                    </div>

                                    <div className="text-center pt-6 border-t border-muted/40 mt-6">
                                      <p className="text-xs font-bold text-muted-foreground">
                                        Don't have an account? {' '}
                                        <button 
                                          type="button" 
                                          onClick={() => router.push('/auth/login?tab=signup')}
                                          className="text-primary hover:underline font-black uppercase tracking-tighter"
                                        >
                                          Sign Up
                                        </button>
                                      </p>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="signup">
                    <Card className="rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border-none overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-emerald-50 py-3 text-center border-b border-emerald-100 flex items-center justify-center gap-2">
                          <Gift className="h-4 w-4 text-emerald-600" />
                          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                            Register & Subscribe for <span className="text-emerald-500">200 Points</span> Bonus!
                          </p>
                        </div>

                        <CardHeader className="bg-muted/5 pb-8 pt-10 text-center">
                            <CardTitle className="text-2xl font-black text-accent tracking-tighter uppercase">Create Your Alpha Account</CardTitle>
                        </CardHeader>
                        
                        <CardContent className="pt-2 space-y-8">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <Button variant="outline" type="button" onClick={() => handleSocial('google')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                    <GoogleIcon /><span className="ml-2">Google</span>
                                  </Button>
                                  <Button variant="outline" type="button" onClick={() => handleSocial('facebook')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                    <span className="ml-2">Facebook</span>
                                  </Button>
                                  <Button variant="outline" type="button" onClick={() => handleSocial('apple')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                    <AppleIcon /><span className="ml-2">Apple</span>
                                  </Button>
                                  <Button variant="outline" type="button" onClick={() => handleSocial('github')} className="h-12 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted/20">
                                    <GithubIcon /><span className="ml-2">GitHub</span>
                                  </Button>
                              </div>

                              <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted/40" /></div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black">
                                  <span className="bg-white px-4 text-muted-foreground tracking-[0.2em]">Or</span>
                                </div>
                              </div>
                            </div>

                            <Form {...sForm}>
                                <form 
                                    autoComplete="off"
                                    onSubmit={sForm.handleSubmit(onSignUpSubmit)} 
                                    className="space-y-8"
                                >
                                    <div className="space-y-5">
                                      <span className={sectionLabel}>Personal Information</span>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField control={sForm.control} name="firstName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={inputLabel}>First Name<span className="text-red-500 ml-0.5">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="First Name" {...field} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={sForm.control} name="lastName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={inputLabel}>Last Name<span className="text-red-500 ml-0.5">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Last Name" {...field} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                      </div>

                                      <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-dashed">
                                        <div className="h-5 w-5 rounded border border-slate-300 flex items-center justify-center bg-white cursor-pointer">
                                          <Check className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100" />
                                        </div>
                                        <p className="text-[11px] font-medium text-slate-600">Subscribe now and earn <span className="text-emerald-500 font-bold">100 points</span>!</p>
                                      </div>
                                    </div>

                                    <div className="space-y-5">
                                      <span className={sectionLabel}>Sign-in Information</span>
                                      
                                      <FormField control={sForm.control} name="email" render={({ field }) => (
                                          <FormItem>
                                              <FormLabel className={inputLabel}>Email Address<span className="text-red-500 ml-0.5">*</span></FormLabel>
                                              <FormControl>
                                                  <Input placeholder="you@example.com" {...field} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium" />
                                              </FormControl>
                                              <FormMessage />
                                          </FormItem>
                                      )} />
                                      
                                      <div className="grid grid-cols-1 gap-5">
                                        <FormField control={sForm.control} name="password" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={inputLabel}>Password<span className="text-red-500 ml-0.5">*</span></FormLabel>
                                                <div className="relative">
                                                    <Input type={showPass ? "text" : "password"} placeholder="••••••••" {...field} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium pr-12" />
                                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={sForm.control} name="confirmPassword" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={inputLabel}>Confirm Password<span className="text-red-500 ml-0.5">*</span></FormLabel>
                                                <div className="relative">
                                                    <Input type={showConfirmPass ? "text" : "password"} placeholder="••••••••" {...field} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium pr-12" />
                                                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                      </div>
                                    </div>

                                    <div className="pt-2 flex justify-center scale-90 origin-center">
                                      <div className="rounded-xl overflow-hidden border border-muted shadow-sm min-h-[78px]">
                                        <ReCAPTCHA
                                          ref={recaptchaRef}
                                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                                          onChange={setCaptchaToken}
                                        />
                                      </div>
                                    </div>

                                    <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl bg-primary text-white hover:scale-[1.02] active:scale-95 transition-all text-sm" disabled={processing}>
                                      {processing ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
                                    </Button>

                                    <div className="text-center pb-6 border-t border-muted/40 pt-6">
                                      <p className="text-xs font-bold text-muted-foreground">
                                        Already have an account? {' '}
                                        <button 
                                          type="button" 
                                          onClick={() => router.push('/auth/login?tab=login')}
                                          className="text-primary hover:underline font-black uppercase tracking-tighter"
                                        >
                                          Login
                                        </button>
                                      </p>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
