'use client';

import Hero from '@/components/common/Hero';
import WanjikuSection from '@/components/common/WanjikuSection';
import HomeBlogSection from '@/components/products/HomeBlogSection';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import ConnectWithUs from '@/components/common/ConnectWithUs';
import ImpactSection from '@/components/common/ImpactSection';
import CategoryCarousel from '@/components/common/CategoryCarousel';

export default function Home() {
  return (
    <div className="relative w-full">
      <Hero />
      <WanjikuSection />
      <HomeBlogSection />
      <CategoryCarousel />
      <FeaturedProducts />
      <ImpactSection />
      <ConnectWithUs />
    </div>
  );
}