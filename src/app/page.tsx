'use client';

import Hero from '@/components/common/Hero';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import ConnectWithUs from '@/components/common/ConnectWithUs';
import ImpactSection from '@/components/common/ImpactSection';
import CategoryCarousel from '@/components/common/CategoryCarousel';
import HomepageAbout from '@/components/common/HomepageAbout';

export default function Home() {
  return (
    <div className="relative w-full">
      <Hero />
      <CategoryCarousel />
      <FeaturedProducts />
      <ImpactSection />
      <HomepageAbout />
      <ConnectWithUs />
    </div>
  );
}
