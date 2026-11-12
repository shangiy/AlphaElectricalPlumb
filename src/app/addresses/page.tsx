
'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AddressesPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">Address Hub</h1>
            <p className="text-muted-foreground font-medium mt-2">Manage your primary and secondary delivery locations.</p>
          </div>
          <Button className="rounded-full h-12 px-8 bg-primary font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-transform">
            <Plus size={16} className="mr-2" /> Add Address
          </Button>
        </div>

        <Card className="rounded-[2.5rem] border shadow-xl p-10 flex items-start gap-6 bg-white group hover:border-primary transition-all">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <MapPin size={24} />
          </div>
          <div className="space-y-1">
            <p className="font-black text-accent uppercase tracking-tight">Main Headquarters</p>
            <p className="text-muted-foreground font-medium">Nandi Arcade, Office 204, Eldoret, KE</p>
            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full mt-2 border border-emerald-100">
              Primary Node
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthGuard>
      <AddressesPage />
    </AuthGuard>
  );
}
