
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserSelfie {
    id: string;
    imageUrl: string;
    createdAt: string;
}

export default function SelfieGallery() {
    const [selfies, setSelfies] = useState<UserSelfie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSelfies = async () => {
            if (!supabase) return;
            setError(null);
            try {
                const { data, error: supabaseError } = await supabase
                    .from('user_selfies')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (supabaseError) throw supabaseError;

                setSelfies((data || []).map(s => ({
                    id: s.id,
                    imageUrl: s.image_url,
                    createdAt: s.created_at
                })));
            } catch (err: any) {
                console.error("Error fetching selfies:", err.message || err);
                setError(err.message || "Failed to connect to the selfies database. Ensure the table exists in Supabase.");
            } finally {
                setLoading(false);
            }
        };

        fetchSelfies();
    }, []);

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    return (
        <Card className="rounded-[2.5rem] shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b p-8">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter text-accent">User Selfies</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Images captured by users via the visual search feature. ({selfies.length} images)
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                {error && (
                    <Alert variant="destructive" className="mb-6 rounded-2xl">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Database Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="aspect-square w-full rounded-3xl" />
                                <Skeleton className="h-4 w-2/3 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : selfies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {selfies.map(selfie => (
                            <div key={selfie.id} className="group relative rounded-3xl overflow-hidden shadow-md transition-all hover:shadow-2xl hover:-translate-y-1">
                                <div className="aspect-square w-full overflow-hidden bg-muted">
                                    <Image 
                                        src={selfie.imageUrl}
                                        alt={`User selfie ${selfie.id}`}
                                        width={400}
                                        height={400}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-1">Uploaded On</p>
                                    <p className="text-xs text-white font-bold">{formatDateTime(selfie.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-muted/5 py-32 text-center">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Camera className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-3xl font-black font-headline uppercase tracking-tighter text-muted-foreground/40">No Visual Logs</h3>
                        <p className="mt-2 text-muted-foreground font-medium">
                            No images have been captured by users yet.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
