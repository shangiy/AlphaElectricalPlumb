
'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Zap } from 'lucide-react';

function CouponsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">Coupons Center</h1>
          <p className="text-muted-foreground font-medium mt-2">Active discounts and seasonal promotional offers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-[2rem] border-2 border-dashed p-10 text-center flex flex-col items-center justify-center opacity-40">
             <Ticket className="h-10 w-10 mb-4" />
             <p className="font-bold uppercase tracking-widest text-xs">No Active Coupons</p>
          </Card>
          <Card className="rounded-[2rem] bg-primary/5 border border-primary/10 p-10 flex flex-col items-center justify-center text-center">
             <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Zap size={24} />
             </div>
             <p className="font-black text-primary uppercase tracking-tighter">Coming Soon</p>
             <p className="text-[10px] font-bold text-muted-foreground mt-1">Seasonal Black Friday Offers</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthGuard>
      <CouponsPage />
    </AuthGuard>
  );
}
