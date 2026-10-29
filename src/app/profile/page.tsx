'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthProvider';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User as UserIcon } from 'lucide-react';
import AvatarSelectionDialog from '@/components/auth/AvatarSelectionDialog';
import { supabase } from '@/lib/supabase';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileContent() {
    const { toast } = useToast();
    const { user, updateUser } = useAuth();
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            avatarUrl: '',
        },
    });
    
    const avatarUrl = form.watch('avatarUrl');

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                avatarUrl: user.avatarUrl || '',
            });
        }
    }, [user, form]);
    
    const handleAvatarSelect = (url: string) => {
        form.setValue('avatarUrl', url, { shouldValidate: true, shouldDirty: true });
        toast({
            title: 'Avatar Updated!',
            description: 'Your new profile picture is ready. Click "Save Changes" to confirm.',
        });
    };


    async function onSubmit(data: ProfileFormValues) {
        if (!user || !supabase) return;
        setIsSaving(true);

        try {
            // Update Supabase profile
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: data.name,
                    username: data.username,
                    avatar_url: data.avatarUrl,
                })
                .eq('id', user.id);

            if (error) throw error;

            // Update local context state
            updateUser({ 
                name: data.name,
                username: data.username,
                avatarUrl: data.avatarUrl
            });

            toast({
                title: "Profile Updated!",
                description: "Your changes have been saved to your account.",
            });
            
            form.reset(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not save your profile changes. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <AvatarSelectionDialog 
                isOpen={isAvatarDialogOpen}
                onClose={() => setIsAvatarDialogOpen(false)}
                onSelect={handleAvatarSelect}
            />
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-3xl mx-auto shadow-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-primary">My Profile</CardTitle>
                        <CardDescription>
                            View and update your personal information here. Changes are saved to your account permanently in Supabase.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="avatarUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Picture</FormLabel>
                                            <div className="flex items-center gap-6">
                                                <Avatar className="h-24 w-24 border-2 border-primary/10">
                                                    <AvatarImage src={avatarUrl} alt={user?.name} className="object-cover" />
                                                    <AvatarFallback className="bg-muted">
                                                        <UserIcon size={40} className="text-muted-foreground" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Button type="button" variant="outline" onClick={() => setIsAvatarDialogOpen(true)}>
                                                    Change Avatar
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your full name" {...field} />
                                                </FormControl>
                                                <FormDescription>This is your public display name.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="your_username" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is the name that will be displayed in the header.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="you@example.com" {...field} disabled />
                                            </FormControl>
                                            <FormDescription>
                                                This is your login email and cannot be changed here.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button 
                                    type="submit" 
                                    disabled={!form.formState.isDirty || isSaving}
                                    className="w-full sm:w-auto min-w-[150px]"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default function ProfilePage() {
    return (
        <AuthGuard>
            <ProfileContent />
        </AuthGuard>
    )
}
