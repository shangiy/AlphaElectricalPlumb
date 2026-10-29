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
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { verifyRecaptcha } from '@/app/actions/verify-recaptcha';

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

const AppleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.702z"/>
    </svg>
);

const GithubIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
);

const PasswordInput = ({ field, ...props }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <Input type={showPassword ? "text" : "password"} {...props} {...field} />
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
        signInWithGoogle, 
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
            
            // Redirect admins/staff to the admin dashboard by default
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
            toast({ title: "Login Successful!", description: "Welcome back to Alpha Electricals." });
        } catch (error: any) {
            setIsProcessing(false);
            const message = error.message?.includes('Invalid login credentials') 
                ? "Invalid email or password. If you don't have an account, please use the Sign Up tab." 
                : (error.message || "An unexpected error occurred.");
            toast({ variant: "destructive", title: "Login Failed", description: message });
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
            toast({ title: "Account Created!", description: "Welcome! Your account is ready." });
        } catch (error: any) {
            setIsProcessing(false);
            toast({ variant: "destructive", title: "Sign-Up Failed", description: error.message });
        }
    }

    const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple' | 'github') => {
        setSocialLoading(provider);
        try {
            let signInMethod;
            switch(provider) {
                case 'google': signInMethod = signInWithGoogle; break;
                case 'facebook': signInMethod = signInWithFacebook; break;
                case 'apple': signInMethod = signInWithApple; break;
                case 'github': signInMethod = signInWithGithub; break;
            }
            await signInMethod();
        } catch (error: any) {
            console.error("Social login error:", error);
            toast({ 
              variant: "destructive", 
              title: "Social Login Failed", 
              description: "Redirect blocked by browser. Please open the site in a NEW TAB to continue." 
            });
        } finally {
            setSocialLoading(null);
        }
    }

    const redirectUrl = searchParams.get('redirect') || '/';
    const redirectQuery = redirectUrl !== '/' ? `&redirect=${encodeURIComponent(redirectUrl)}` : '';
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const SocialLoginBlock = () => (
        <div className="space-y-4 pt-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span>
                </div>
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
                <Button variant="outline" type="button" onClick={() => handleSocialSignIn('apple')} disabled={!!socialLoading} className="h-11 rounded-xl">
                    {socialLoading === 'apple' ? <Loader2 className="animate-spin h-4 w-4" /> : <AppleIcon/>} 
                    <span className="ml-2 font-bold">Apple</span>
                </Button>
                <Button variant="outline" type="button" onClick={() => handleSocialSignIn('github')} disabled={!!socialLoading} className="h-11 rounded-xl">
                    {socialLoading === 'github' ? <Loader2 className="animate-spin h-4 w-4" /> : <GithubIcon/>} 
                    <span className="ml-2 font-bold">GitHub</span>
                </Button>
            </div>
        </div>
    );

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
                        <CardDescription className="font-medium">Enter your credentials to access your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                       <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="example@email.com" {...field} autoComplete="email" className="h-12 rounded-xl" />
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
                                                <PasswordInput field={field} placeholder="••••••••" autoComplete="current-password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-wider text-sm shadow-lg" disabled={isProcessing}>
                                    {isProcessing && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                    Log In
                                </Button>
                                
                                <SocialLoginBlock />

                                <p className="text-center text-xs font-bold text-muted-foreground mt-8">
                                    Don't have an account?{' '}
                                    <Link href={`/auth/login?tab=signup${redirectQuery}`} scroll={false} className="text-primary hover:underline">Sign up now</Link>
                                </p>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="signup">
                 <Card className="rounded-[2rem] shadow-xl border-primary/5 overflow-hidden">
                    <CardHeader className="bg-muted/10 pb-8">
                        <CardTitle className="text-2xl font-black font-headline text-accent">Join Alpha</CardTitle>
                        <CardDescription className="font-medium">Create your professional account today.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <Form {...signUpForm}>
                            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                                 <FormField control={signUpForm.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                                            <FormControl><Input placeholder="John Doe" {...field} className="h-11 rounded-xl" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signUpForm.control} name="username" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Username</FormLabel>
                                            <FormControl><Input placeholder="johndoe99" {...field} className="h-11 rounded-xl" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signUpForm.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                                            <FormControl><Input type="email" placeholder="you@example.com" {...field} className="h-11 rounded-xl" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signUpForm.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">New Password</FormLabel>
                                            <FormControl><PasswordInput field={field} placeholder="••••••••" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={signUpForm.control} name="confirmPassword" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Confirm Password</FormLabel>
                                            <FormControl><PasswordInput field={field} placeholder="••••••••" /></FormControl>
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

                                <SocialLoginBlock />
                                
                                <p className="text-center text-xs font-bold text-muted-foreground mt-8">
                                    Already have an account?{' '}
                                    <Link href={`/auth/login?tab=login${redirectQuery}`} scroll={false} className="text-primary hover:underline">Login here</Link>
                                </p>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
