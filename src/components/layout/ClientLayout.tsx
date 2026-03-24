'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { CartProvider } from '@/context/CartProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { ProductProvider } from '@/context/ProductProvider';
import Chatbot from '@/components/common/Chatbot';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import TopBanner from '@/components/common/TopBanner';
import { Analytics } from '@vercel/analytics/react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

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
                    className="h-auto rounded-full bg-[#007bff] px-4 py-2 text-base font-semibold text-white shadow-lg hover:bg-[#0056b3] animate-in fade-in zoom-in-95"
                    aria-label="Toggle Chatbot"
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
