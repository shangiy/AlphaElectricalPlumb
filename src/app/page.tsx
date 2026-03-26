
'use client';

import Hero from '@/components/common/Hero';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import ConnectWithUs from '@/components/common/ConnectWithUs';
import ImpactSection from '@/components/common/ImpactSection';
import CategoryCarousel from '@/components/common/CategoryCarousel';
import HomepageAbout from '@/components/common/HomepageAbout';
import DeliveryServices from '@/components/common/DeliveryServices';
import CustomerReviews from '@/components/common/CustomerReviews';

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
