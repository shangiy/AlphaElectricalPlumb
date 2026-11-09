'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TopBanner from '@/components/common/TopBanner';
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

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          {/* Main Wrapper: Standard Vertical Flex Column in normal document flow */}
          <div className="w-full flex flex-col min-h-screen">
            {!isAdminRoute && (
              <>
                {/* 1. Top Announcement Banner: Normal Flow, scrolls away naturally */}
                <TopBanner />
                {/* 2. Navigation Header: Sticky top-0, stays glued after scroll */}
                <Header />
              </>
            )}
            
            <main className="w-full flex-1 flex flex-col">
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
                    className="h-auto rounded-full bg-primary px-4 py-2 text-base font-semibold text-white shadow-lg hover:bg-primary/90"
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
