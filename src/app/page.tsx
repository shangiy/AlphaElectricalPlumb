export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import nextDynamic from 'next/dynamic';
import Hero from '@/components/common/Hero';
import HomepageAbout from '@/components/common/HomepageAbout';
import CategoryCarousel from '@/components/common/CategoryCarousel';
import FeaturedProducts from '@/components/products/FeaturedProducts';

// Keep lower-priority or heavy interactive sections dynamic to maintain performance
const DeliveryServices = nextDynamic(() => import('@/components/common/DeliveryServices'), {
  loading: () => <div className="h-96 bg-muted/10 animate-pulse rounded-2xl mx-4" />
});

const ImpactSection = nextDynamic(() => import('@/components/common/ImpactSection'), {
  loading: () => <div className="h-64 bg-muted/10 animate-pulse rounded-2xl mx-4" />
});

const CustomerReviews = nextDynamic(() => import('@/components/common/CustomerReviews'), {
  loading: () => <div className="h-80 bg-muted/10 animate-pulse rounded-2xl mx-4" />
});

const ConnectWithUs = nextDynamic(() => import('@/components/common/ConnectWithUs'), {
  loading: () => <div className="h-64 bg-muted/10 animate-pulse rounded-2xl mx-4" />
});

function HomeContent() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <CategoryCarousel />
      <FeaturedProducts />
      <DeliveryServices />
      <HomepageAbout />
      <ImpactSection />
      <CustomerReviews />
      <ConnectWithUs />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
