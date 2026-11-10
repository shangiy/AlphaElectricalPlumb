'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/context/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { verifyRecaptcha } from '@/app/actions/verify-recaptcha';
import { signIn as nextAuthSignIn } from 'next-auth/react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7.02-3.15-7.02-7.02s3.15-7.02 7.02-7.02c2.21 0 3.66.86 4.5 1.69l2.5-2.5C18.16 3.15 15.66 2 12.48 2 6.94 2 2.53 6.4 2.53 12s4.41 10 9.95 10c2.82 0 5.16-1 6.9-2.72 1.83-1.83 2.36-4.49 2.36-6.52 0-.6-.05-1.15-.15-1.7H12.48z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.29h-3.128v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
    </svg>
);

const PasswordInput = ({ field, ...props }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <Input 
                type={showPassword ? "text" : "password"} 
                {...props} 
                {...field} 
                readOnly={true}
                onFocus={(e) => e.target.removeAttribute('readonly')}
            />
            <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowPassword(prev => !prev)}
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
};

export default function LoginForm() {
    const { 
        user, 
        login, 
        signUp, 
        signInWithFacebook, 
        signInWithApple, 
        signInWithGithub 
    } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [socialLoading, setSocialLoading] = useState<null | 'google' | 'facebook' | 'apple' | 'github'>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    
    const activeTab = searchParams.get('tab') || 'login';

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && user) {
            const redirectUrl = searchParams.get('redirect');
            if (!redirectUrl || redirectUrl === '/') {
                if (user.role === 'admin' || user.role === 'staff') {
                    router.push('/admin');
                    return;
                }
            }
            router.push(redirectUrl || '/');
        }
    }, [isMounted, user, router, searchParams]);

    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signUpForm = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "" },
    });
    
    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`/auth/login?${params.toString()}`, { scroll: false });
    };

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    async function onLogin(data: LoginFormValues) {
        setIsProcessing(true);
        try {
            await login(data.email, data.password);
            toast({ title: "Login Successful!", description: "Welcome back." });
        } catch (error: any) {
            setIsProcessing(false);
            toast({ variant: "destructive", title: "Login Failed", description: error.message });
        }
    }

    async function onSignUp(data: SignUpFormValues) {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (siteKey && !recaptchaToken) {
            toast({ variant: "destructive", title: "Verification Required", description: "Please complete reCAPTCHA." });
            return;
        }

        setIsProcessing(true);
        try {
            if (siteKey && recaptchaToken) {
                const verification = await verifyRecaptcha(recaptchaToken);
                if (!verification.success) throw new Error(verification.message);
            }
            await signUp(data);
            toast({ title: "Account Created!", description: "Welcome to the ecosystem." });
        } catch (error: any) {
            setIsProcessing(false);
            toast({ variant: "destructive", title: "Sign-Up Failed", description: error.message });
        }
    }

    const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple' | 'github') => {
        setSocialLoading(provider);
        try {
            if (provider === 'google') {
                // NextAuth bridge to eliminate .supabase.co branding
                await nextAuthSignIn('google');
            } else {
                let signInMethod;
                switch(provider) {
                    case 'facebook': signInMethod = signInWithFacebook; break;
                    case 'apple': signInMethod = signInWithApple; break;
                    case 'github': signInMethod = signInWithGithub; break;
                }
                if (signInMethod) await signInMethod();
            }
        } catch (error: any) {
            console.error("Social login error:", error);
            toast({ 
              variant: "destructive", 
              title: "Authentication Failed", 
              description: "Could not complete social sign-in. Please try again or use email." 
            });
        } finally {
            setSocialLoading(null);
        }
    }

    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 p-1 rounded-2xl">
                <TabsTrigger value="login" className="rounded-xl font-bold">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl font-bold">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card className="rounded-[2rem] shadow-xl border-primary/5 overflow-hidden">
                    <CardHeader className="bg-muted/10 pb-8">
                        <CardTitle className="text-2xl font-black font-headline text-accent">Welcome Back</CardTitle>
                        <CardDescription className="font-medium">Enter your credentials below.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                       <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5" autoComplete="off">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email" 
                                                    placeholder="example@email.com" 
                                                    {...field} 
                                                    autoComplete="nope" 
                                                    readOnly={true}
                                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                                    className="h-12 rounded-xl" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput 
                                                    field={field} 
                                                    placeholder="••••••••" 
                                                    autoComplete="new-password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg" disabled={isProcessing}>
                                    {isProcessing && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                    Log In
                                </Button>
                                
                                <div className="space-y-4 pt-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-bold">Or</span></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" type="button" onClick={() => handleSocialSignIn('google')} disabled={!!socialLoading} className="h-11 rounded-xl">
                                            {socialLoading === 'google' ? <Loader2 className="animate-spin h-4 w-4" /> : <GoogleIcon/>} 
                                            <span className="ml-2 font-bold">Google</span>
                                        </Button>
                                        <Button variant="outline" type="button" onClick={() => handleSocialSignIn('facebook')} disabled={!!socialLoading} className="h-11 rounded-xl">
                                            {socialLoading === 'facebook' ? <Loader2 className="animate-spin h-4 w-4" /> : <FacebookIcon/>} 
                                            <span className="ml-2 font-bold">Facebook</span>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="signup">
                 <Card className="rounded-[2rem] shadow-xl border-primary/5 overflow-hidden">
                    <CardHeader className="bg-muted/10 pb-8">
                        <CardTitle className="text-2xl font-black font-headline text-accent">Join Alpha</CardTitle>
                        <CardDescription className="font-medium">Create your professional account.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <Form {...signUpForm}>
                            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4" autoComplete="off">
                                 <FormField control={signUpForm.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                                            <FormControl><Input placeholder="John Doe" {...field} className="h-11 rounded-xl" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signUpForm.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email" 
                                                    placeholder="you@email.com" 
                                                    {...field} 
                                                    autoComplete="nope"
                                                    readOnly={true}
                                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                                    className="h-11 rounded-xl" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signUpForm.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput field={field} placeholder="••••••••" autoComplete="new-password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signUpForm.control} name="confirmPassword" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Confirm</FormLabel>
                                            <FormControl>
                                                <PasswordInput field={field} placeholder="••••••••" autoComplete="new-password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {isMounted && recaptchaSiteKey && activeTab === 'signup' && (
                                    <div className="flex justify-center p-2">
                                        <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} onChange={handleRecaptchaChange} />
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg mt-4" disabled={isProcessing}>
                                    {isProcessing && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                    Create Account
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
