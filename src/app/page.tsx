import dynamic from 'next/dynamic';
import Hero from '@/components/common/Hero';
import HomepageAbout from '@/components/common/HomepageAbout';

// Dynamically import heavy sections to split bundles and prevent ChunkLoadErrors
const CategoryCarousel = dynamic(() => import('@/components/common/CategoryCarousel'), {
  loading: () => <div className="h-80 bg-muted/10 animate-pulse rounded-2xl mx-4 my-16" />
});
const FeaturedProducts = dynamic(() => import('@/components/products/FeaturedProducts'), {
  loading: () => <div className="h-96 bg-muted/10 animate-pulse rounded-2xl mx-4 my-16" />
});
const DeliveryServices = dynamic(() => import('@/components/common/DeliveryServices'));
const ImpactSection = dynamic(() => import('@/components/common/ImpactSection'));
const CustomerReviews = dynamic(() => import('@/components/common/CustomerReviews'));
const ConnectWithUs = dynamic(() => import('@/components/common/ConnectWithUs'));

/**
 * Home Page - Server Component.
 * Optimized with Dynamic Imports to prevent ChunkLoadError timeouts
 * by splitting the client-side JavaScript into smaller, independent bundles.
 */
export default function Home() {
  return (
    <div className="relative w-full">
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
