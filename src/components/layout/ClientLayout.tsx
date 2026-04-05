'use client';

import { useState, useEffect } from 'react';
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
import { FirebaseClientProvider } from '@/firebase';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  // Nuclear Option Fix: Ensures the body is always clickable and scrollable on navigation.
  // This prevents cases where Radix UI or reCAPTCHA leaves an invisible lock on the screen.
  useEffect(() => {
    const unlockUI = () => {
      try {
        // Force reset essential UI properties
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        
        // Remove stubborn lock attributes added by Radix UI or ReCAPTCHA
        document.body.removeAttribute('data-pointer-events-none');
        document.body.removeAttribute('data-scroll-locked');
        document.body.style.removeProperty('pointer-events');
        document.body.style.removeProperty('overflow');
        
        // Remove any Radix dialog overlays that might be stuck
        const overlays = document.querySelectorAll('[data-radix-portal], [role="presentation"]');
        overlays.forEach(overlay => {
            // Check if it's an invisible/stuck overlay blocking input
            const style = window.getComputedStyle(overlay);
            if (style.pointerEvents === 'auto' && style.position === 'fixed') {
                (overlay as HTMLElement).style.pointerEvents = 'none';
            }
        });
      } catch (e) {
        console.warn('UI Unlock failed slightly:', e);
      }
    };

    unlockUI();
    
    // Multiple delayed triggers to catch late-running scripts during transitions
    const timer1 = setTimeout(unlockUI, 100);
    const timer2 = setTimeout(unlockUI, 500);
    const timer3 = setTimeout(unlockUI, 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  return (
    <FirebaseClientProvider>
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
    </FirebaseClientProvider>
  );
}
