
'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, History } from 'lucide-react';

function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">My Order History</h1>
          <p className="text-muted-foreground font-medium mt-2">Track and manage your recent Alpha Electricals purchases.</p>
        </div>

        <Card className="rounded-[2.5rem] border-none bg-muted/20 py-20 text-center flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-6">
            <History className="h-10 w-10 text-muted-foreground opacity-20" />
          </div>
          <h3 className="text-2xl font-black text-accent uppercase tracking-tight">No Orders Recorded</h3>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Your order stream is currently empty. Start exploring our catalog to begin your journey.</p>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthGuard>
      <OrdersPage />
    </AuthGuard>
  );
}
