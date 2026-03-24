
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera } from 'lucide-react';

interface UserSelfie {
    id: string;
    imageUrl: string;
    createdAt: Timestamp;
}

export default function AdminSelfiesPage() {
    const [selfies, setSelfies] = useState<UserSelfie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "userSelfies"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const selfieList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as UserSelfie));
                setSelfies(selfieList);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching selfies:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const formatDateTime = (timestamp: Timestamp) => {
        if (!timestamp) return 'No date';
        const date = timestamp.toDate();
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Selfies</CardTitle>
                <CardDescription>Images captured by users via the visual search feature. ({selfies.length} images)</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : selfies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selfies.map(selfie => (
                            <div key={selfie.id} className="group relative">
                                <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                                    <Image 
                                        src={selfie.imageUrl}
                                        alt={`User selfie ${selfie.id}`}
                                        width={400}
                                        height={400}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
                                    <p className="text-xs text-white font-medium">{formatDateTime(selfie.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
                        <Camera className="h-16 w-16 text-muted-foreground" />
                        <h3 className="mt-4 text-2xl font-headline font-semibold">No Selfies Found</h3>
                        <p className="mt-2 text-muted-foreground">
                            No images have been captured by users yet.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
