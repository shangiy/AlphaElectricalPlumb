'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { CartProvider } from '@/context/CartProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { ProductProvider } from '@/context/ProductProvider';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import heavy interactive components
const Chatbot = dynamic(() => import('@/components/common/Chatbot'), {
  ssr: false,
});
const WhatsAppButton = dynamic(() => import('@/components/common/WhatsAppButton'), {
  ssr: false,
});
const ScrollToTopButton = dynamic(() => import('@/components/common/ScrollToTopButton'), {
  ssr: false,
});
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), {
  ssr: false,
});

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const unlockUI = () => {
      try {
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.body.overflow = 'auto';
        document.body.removeAttribute('data-pointer-events-none');
        document.body.removeAttribute('data-scroll-locked');
      } catch (e) {}
    };

    unlockUI();
    const timer = setTimeout(unlockUI, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <div className="relative flex flex-col min-h-screen">
            {/* 1. FIXED WRAPPER CONTAINER: Pins both the banner and header to the top */}
            {!isAdminRoute && (
              <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col shadow-md">
                {/* Top Announcement Bar */}
                <div className="text-white py-1.5 lg:py-4 px-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x text-xs lg:text-base font-medium border-b border-white/5">
                  <div className="container mx-auto flex justify-between items-center h-6 lg:h-10 overflow-hidden">
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                      <span className="opacity-80">Mon - Sat: 8:00 AM – 6:00 PM</span>
                    </div>

                    <div className="flex-1 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
                      <ul className="flex-1 font-black text-center flex items-center justify-center md:justify-start [&_li]:mx-12 animate-scroll">
                        <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ EASTER HOLIDAY OFFER! BEST PRICES GUARANTEED</li>
                        <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ SHOP WITH US @BEST PRICES IN ELDORET</li>
                        <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ EASTER HOLIDAY OFFER! BEST PRICES GUARANTEED</li>
                        <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ SHOP WITH US @BEST PRICES IN ELDORET</li>
                      </ul>
                    </div>

                    <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
                      <a 
                        href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline font-black uppercase tracking-tighter"
                      >
                        TikTok @AlphaElectricals
                      </a>
                    </div>
                  </div>
                </div>

                <Header />
              </div>
            )}
            
            {/* 2. PAGE CONTENT CONTAINER: Uses pt so content starts BELOW the fixed header */}
            <main className={cn(
              "w-full min-h-screen flex flex-col",
              !isAdminRoute ? "pt-[110px] sm:pt-[125px] lg:pt-[200px]" : "pt-0"
            )}>
              {children}
              {!isAdminRoute && <Footer />}
            </main>
          </div>
          
          {!isAdminRoute && (
            <>
              <Chatbot isOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} />
              
              <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
                {!isChatbotOpen && (
                  <Button 
                    onClick={() => setIsChatbotOpen(true)}
                    className="h-auto rounded-full bg-[#007bff] px-4 py-2 text-base font-semibold text-white shadow-lg hover:bg-[#0056b3]"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Alpha AI
                  </Button>
                )}
                <ScrollToTopButton />
              </div>

              <WhatsAppButton />
            </>
          )}
          <Toaster />
          <Analytics />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
