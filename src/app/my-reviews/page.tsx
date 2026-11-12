
'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareQuote, Star } from 'lucide-react';

function MyReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">My Contributions</h1>
          <p className="text-muted-foreground font-medium mt-2">A timeline of your Product reviews and Storefront System feedback.</p>
        </div>

        <Card className="rounded-[2.5rem] border-2 border-dashed bg-muted/10 py-24 text-center">
           <MessageSquareQuote className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
           <p className="font-bold text-muted-foreground uppercase tracking-[0.2em] text-xs">No Reviews Found</p>
           <p className="text-muted-foreground text-[10px] mt-1">Your professional feedback helps the community grow.</p>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthGuard>
      <MyReviewsPage />
    </AuthGuard>
  );
}
