'use client';
import { useAuth } from '@/context/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoaderCircle, ShieldAlert } from 'lucide-react';

export default function AuthGuard({ children, allowedRoles }: { children: ReactNode, allowedRoles?: ('admin' | 'staff' | 'user')[] }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/auth/login?redirect=${pathname}`);
        }
    }, [user, loading, router, pathname]);

    if (loading || !user) {
        return (
             <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                 <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                    <p>Verifying access...</p>
                 </div>
             </div>
        );
    }
    
    if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
         return (
             <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                 <Card className="w-full max-w-md text-center">
                     <CardHeader>
                         <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                            <ShieldAlert className="h-10 w-10 text-destructive" />
                         </div>
                         <CardTitle className="mt-4">Permission Denied</CardTitle>
                         <CardDescription>
                            You do not have the necessary permissions to access this page.
                         </CardDescription>
                     </CardHeader>
                     <CardContent>
                         <Button onClick={() => router.push('/')}>Go to Homepage</Button>
                     </CardContent>
                 </Card>
             </div>
        );
    }
    
    return <>{children}</>;
}
