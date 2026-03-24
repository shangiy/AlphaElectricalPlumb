'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Script from 'next/script';

export default function ConnectWithUs() {
  return (
    <>
      <section className="group relative h-auto w-full overflow-hidden py-16 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: "url('/connect-bg.jpg')" }}
          data-ai-hint="team background"
        ></div>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-4xl font-bold font-headline">Connect with us!</h2>
          <p className="mt-2 text-lg">As You Enquire or make purchases</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-[76px] sm:flex-row">
            <div style={{
              width: '227px',
              height: '378px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden'
            }}>
              <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}>
                <blockquote
                  className="tiktok-embed"
                  cite="https://www.tiktok.com/@alphaelectricalsandplumb/video/7506475821771640070"
                  data-video-id="7506475821771640070"
                  style={{ width: '325px', minWidth: '325px' }}
                >
                  <section>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.tiktok.com/@alphaelectricalsandplumb"
                    >
                      @alphaelectricalsandplumb
                    </a>
                  </section>
                </blockquote>
              </div>
            </div>
            
            <div style={{
              width: '227px',
              height: '378px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden'
            }}>
              <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}>
                <blockquote
                  className="tiktok-embed"
                  cite="https://www.tiktok.com/@alphaelectricalsandplumb/video/7496094826002222342"
                  data-video-id="7496094826002222342"
                  style={{ width: '325px', minWidth: '325px' }}
                >
                  <section>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.tiktok.com/@alphaelectricalsandplumb"
                    >
                      @alphaelectricalsandplumb
                    </a>
                  </section>
                </blockquote>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-[#00f2ea] text-black hover:bg-[#00f2ea]/80">
              <Link href="https://www.tiktok.com/@AlphaElectricalsandplumb" target="_blank">
                FOLLOW US ON TIKTOK →
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-[#1877f2] hover:bg-[#1877f2]/80">
              <Link href="https://www.facebook.com/Alphaelectricalsandplumbing" target="_blank">
                LIKE US ON FACEBOOK →
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Script async src="https://www.tiktok.com/embed.js" />
    </>
  );
}
