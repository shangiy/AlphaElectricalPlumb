
'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Trophy } from 'lucide-react';

function PointsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">Explorer Points</h1>
          <p className="text-muted-foreground font-medium mt-2">Your loyalty rewards and achievement milestones.</p>
        </div>

        <Card className="rounded-[2.5rem] bg-accent text-white p-10 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Trophy size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Balance Available</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black font-headline">0</span>
              <span className="text-xl font-bold opacity-40 uppercase tracking-widest">Alpha Points</span>
            </div>
            <p className="text-sm font-medium opacity-80 max-w-sm leading-relaxed">
              Earn points with every purchase and technical review. Redeem your balance for coupons or priority shipping.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthGuard>
      <PointsPage />
    </AuthGuard>
  );
}
