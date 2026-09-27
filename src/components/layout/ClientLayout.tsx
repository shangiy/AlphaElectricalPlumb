
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
import TopBanner from '@/components/common/TopBanner';

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
        document.body.style.overflow = 'auto';
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
            <TopBanner />
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            {!isAdminRoute && <Footer />}
          </div>
          
          {!isAdminRoute && (
            <>
              <Chatbot isOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} />
              
              <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
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
