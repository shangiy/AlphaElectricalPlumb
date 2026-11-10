'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Database, CheckCircle, Star, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { useProducts } from "@/context/ProductProvider";
import { Badge } from "@/components/ui/badge";

export default function AdminWelcome() {
    const { user } = useAuth();
    const { products } = useProducts();
    
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight text-accent">Command Center</h1>
                    <p className="text-muted-foreground mt-2">Welcome back, <span className="text-primary font-bold">{user?.name || 'Admin'}</span>.</p>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full font-bold">
                    <Database className="mr-2 h-3 w-3" /> Alpha Ecosystem v4.3.0
                </Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl shadow-sm"><CardHeader className="pb-2 text-xs font-black uppercase text-muted-foreground">Active Catalog</CardHeader><CardContent><div className="text-4xl font-black">{products.length}</div></CardContent></Card>
                <Card className="rounded-2xl shadow-sm bg-green-50/20 border-green-200"><CardHeader className="pb-2 text-xs font-black uppercase text-green-600">System State</CardHeader><CardContent><div className="text-4xl font-black text-green-700">Healthy</div></CardContent></Card>
            </div>

            <Card className="overflow-hidden rounded-3xl border-none shadow-xl relative aspect-[21/9]">
                <Image src="/elegant_background.jpg" alt="Ecosystem" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8">
                    <Badge className="mb-4 bg-primary">Alpha Pro v4.3.0</Badge>
                    <h2 className="text-4xl font-bold text-white font-headline">Enterprise Dashboard</h2>
                </div>
            </Card>
        </div>
    );
}
