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
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { getUserByEmail } from '@/lib/data';
import { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Force dynamic rendering to bypass static generation requirements for useSearchParams
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
  recaptcha: z.boolean().refine((val) => val === true, {
    message: 'Please confirm you are not a robot.',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7.02-3.15-7.02-7.02s3.15-7.02 7.02-7.02c2.21 0 3.66.86 4.5 1.69l2.5-2.5C18.16 3.15 15.66 2 12.48 2 6.94 2 2.53 6.4 2.53 12s4.41 10 9.95 10c2.82 0 5.16-1 6.9-2.72 1.83-1.83 2.36-4.49 2.36-6.52 0-.6-.05-1.15-.15-1.7H12.48z"/></svg>
);

const FacebookIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Facebook</title><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.29h-3.128v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
);

const PasswordInput = ({ field, ...props }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <Input type={showPassword ? "text" : "password"} {...props} {...field} />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(prev => !prev)}
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
        </div>
    );
};

function LoginFormContent() {
    const { login, signUp, signInWithGoogle, signInWithFacebook } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const redirectUrl = searchParams.get('redirect') || '/';
    const [socialLoading, setSocialLoading] = useState<null | 'google' | 'facebook'>(null);
    
    const activeTab = searchParams.get('tab') || 'login';

    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signUpForm = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "", recaptcha: false },
    });
    
    const handleTabChange = (tab: string) => {
        router.push(`/auth/login?tab=${tab}`, { scroll: false });
    };

    async function onLogin(data: LoginFormValues) {
        const existingUser = await getUserByEmail(data.email);

        if (!existingUser || existingUser.password !== data.password) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
            });
            return;
        }
        
        login({ name: existingUser.name, username: existingUser.username, email: data.email, role: existingUser.role });
        toast({ title: "Login Successful!", description: `Welcome back, ${existingUser.username}!` });
        router.push(redirectUrl);
    }

    async function onSignUp(data: SignUpFormValues) {
        try {
            await signUp(data);
            toast({ title: "Account Created!", description: "Welcome! You are now logged in." });
            router.push(redirectUrl);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Sign-Up Failed",
                description: error.message || "An error occurred. Please try again.",
            });
        }
    }

    const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
        setSocialLoading(provider);
        try {
            const signInMethod = provider === 'google' ? signInWithGoogle : signInWithFacebook;
            const user = await signInMethod();
            if (user) {
                toast({ title: "Login Successful!", description: `Welcome, ${user.name}!` });
                router.push(redirectUrl);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Social Login Failed",
                description: error.message || "Could not sign in. Please try again.",
            });
        } finally {
            setSocialLoading(null);
        }
    }

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome Back</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="you@example.com" {...field} />
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput field={field} placeholder="••••••••" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>Log In</Button>
                                
                                <div className="text-sm">
                                    <Link href="#" className="font-medium text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                     <Button variant="outline" type="button" onClick={() => handleSocialSignIn('google')} disabled={!!socialLoading}>
                                        {socialLoading === 'google' ? <Loader2 className="animate-spin" /> : <GoogleIcon/>}
                                        Google
                                     </Button>
                                     <Button variant="outline" type="button" onClick={() => handleSocialSignIn('facebook')} disabled={!!socialLoading} className="text-[#1877F2] hover:text-[#1877F2]">
                                        {socialLoading === 'facebook' ? <Loader2 className="animate-spin" /> : <FacebookIcon/>}
                                        Facebook
                                     </Button>
                                </div>

                                <p className="text-center text-sm text-muted-foreground">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                      href="/auth/login?tab=signup"
                                      scroll={false}
                                      className="font-medium text-primary hover:underline"
                                    >
                                      Sign up
                                    </Link>
                                </p>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="signup">
                 <Card>
                    <CardHeader>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                           Enter your details below to create your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...signUpForm}>
                            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
                                 <FormField
                                    control={signUpForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={signUpForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="johndoe99" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signUpForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="you@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signUpForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput field={field} placeholder="••••••••" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signUpForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                 <PasswordInput field={field} placeholder="••••••••" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signUpForm.control}
                                    name="recaptcha"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>I am not a robot</FormLabel>
                                            <FormMessage />
                                        </div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={signUpForm.formState.isSubmitting}>Create Account</Button>
                                
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                     <Button variant="outline" type="button" onClick={() => handleSocialSignIn('google')} disabled={!!socialLoading}>
                                        {socialLoading === 'google' ? <Loader2 className="animate-spin" /> : <GoogleIcon/>}
                                        Google
                                     </Button>
                                     <Button variant="outline" type="button" onClick={() => handleSocialSignIn('facebook')} disabled={!!socialLoading} className="text-[#1877F2] hover:text-[#1877F2]">
                                        {socialLoading === 'facebook' ? <Loader2 className="animate-spin" /> : <FacebookIcon/>}
                                        Facebook
                                     </Button>
                                </div>

                                 <p className="text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link
                                      href="/auth/login?tab=login"
                                      scroll={false}
                                      className="font-medium text-primary hover:underline"
                                    >
                                      Login
                                    </Link>
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

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto flex min-h-[80vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <LoginFormContent />
        </Suspense>
    );
}
