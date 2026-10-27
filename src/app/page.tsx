export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import nextDynamic from 'next/dynamic';
import Hero from '@/components/common/Hero';
import HomepageAbout from '@/components/common/HomepageAbout';

// Dynamically import heavy sections to split bundles and prevent ChunkLoadErrors
// No 'ssr: false' inside Server Components to avoid build-time crashes.
const CategoryCarousel = nextDynamic(() => import('@/components/common/CategoryCarousel'), {
  loading: () => <div className="h-80 bg-muted/10 animate-pulse rounded-2xl mx-4 my-16" />
});

const FeaturedProducts = nextDynamic(() => import('@/components/products/FeaturedProducts'), {
  loading: () => <div className="h-96 bg-muted/10 animate-pulse rounded-2xl mx-4 my-16" />
});

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
      <ImpactSection />
      <HomepageAbout />
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
