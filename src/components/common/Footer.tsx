'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { Facebook, Instagram, Youtube, Mail, ArrowUpRight, CheckCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 128, b: 141 };
}

function InteractiveSpiderWeb({ color = "#00808d" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rgb = hexToRgb(color);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      init();
    };

    class Particle {
      x: number; y: number; dx: number; dy: number; size: number;
      constructor(x: number, y: number, dx: number, dy: number, size: number) {
        this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`; ctx.fill();
      }
      update() {
        if (this.x > canvas!.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas!.height || this.y < 0) this.dy = -this.dy;
        this.x += this.dx; this.y += this.dy; this.draw();
      }
    }

    function init() {
      particles = [];
      const num = (canvas!.width * canvas!.height) / 10000;
      for (let i = 0; i < num; i++) {
        particles.push(new Particle(Math.random() * canvas!.width, Math.random() * canvas!.height, Math.random() - 0.5, Math.random() - 0.5, (Math.random() * 2) + 1));
      }
    }

    function animate() { requestAnimationFrame(animate); ctx!.clearRect(0, 0, canvas!.width, canvas!.height); particles.forEach(p => p.update()); }
    window.addEventListener('resize', resize); resize(); animate();
    return () => window.removeEventListener('resize', resize);
  }, [rgb.r, rgb.g, rgb.b]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
}

export default function Footer() {
  const [particleColor, setParticleColor] = useState("#00808d");
  const [isHoveredCoder, setIsHoveredCoder] = useState(false);
  
  useEffect(() => { 
    getStorefrontSetting('footer_particle_color').then(c => { 
      if (c) setParticleColor(c); 
    }); 
  }, []);

  const socialIcons = [
    { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-5 w-5 text-[#1877f2]" /> },
    { name: 'Instagram', href: 'https://www.instagram.com', icon: <Instagram className="h-5 w-5 text-[#e4405f]" /> },
    { name: 'Youtube', href: 'https://www.youtube.com', icon: <Youtube className="h-5 w-5 text-[#ff0000]" /> },
    { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: (
      <svg className="h-5 w-5 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.43-.23-3.41.37-.71.41-1.2 1.13-1.35 1.93-.11.53-.1 1.08.01 1.61.16.59.52 1.13.98 1.51.58.45 1.3.66 2.03.63 1.15-.02 2.21-.62 2.79-1.6.21-.34.34-.73.38-1.13.11-1.36.03-2.73.05-4.09V.02Z"/>
      </svg>
    ) },
    { name: 'WhatsApp', href: 'https://wa.me/254117484887', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={20} height={20} /> },
  ];

  const columnTitle = "text-lg font-black uppercase tracking-tight text-accent mb-6";
  const linkStyle = "hover:text-primary transition-colors";

  // Emojis for the rising celebration animation
  const celebrationEmojis = ['⭐', '✅', '🎈', '⭐', '✅', '🎈'];

  return (
    <footer className="bg-secondary text-secondary-foreground border-t relative overflow-hidden">
      <InteractiveSpiderWeb color={particleColor} />
      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-14 w-14 bg-white rounded-2xl p-2 shadow-xl border border-primary/5 transition-transform group-hover:scale-110">
                <Image src="/logo Alpha.png" alt="Alpha" fill className="object-contain p-1.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-headline text-primary tracking-tighter uppercase leading-none">Alpha Electricals & <br/> Plumbing Ltd</span>
              </div>
            </Link>
            <p className="text-base text-muted-foreground font-medium max-w-[280px]">Your partner for electrical and plumbing supplies.</p>
            <div className="space-y-4">
              <h3 className="text-lg font-black text-accent uppercase tracking-tight">Subscribe to our newsletter</h3>
              <NewsletterForm />
            </div>
          </div>

          {/* Column 2: Company & Socials */}
          <div className="flex flex-col">
            <h3 className={columnTitle}>Company</h3>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground mb-10">
              <li><Link href="/about" className={linkStyle}>About Us</Link></li>
              <li><Link href="/team" className={linkStyle}>Team</Link></li>
            </ul>
            
            <h3 className={columnTitle}>Follow Us</h3>
            <div className="flex items-center gap-3">
              {socialIcons.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-muted transition-all hover:scale-110 hover:shadow-lg"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Support & Hours */}
          <div className="flex flex-col">
            <h3 className={columnTitle}>Support</h3>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground mb-10">
              <li><Link href="/contact" className={linkStyle}>Contact Us</Link></li>
              <li><Link href="/faq" className={linkStyle}>FAQ</Link></li>
              <li><Link href="/returns" className={linkStyle}>Shipping & Returns</Link></li>
            </ul>
            
            <h3 className={columnTitle}>Open Hours</h3>
            <div className="space-y-2 text-sm font-bold text-muted-foreground opacity-80">
              <p>Open Days: Mon - Sat</p>
              <p>Hours: 8:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col">
            <h3 className={columnTitle}>Legal</h3>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
              <li><Link href="/terms" className={linkStyle}>Terms of Service</Link></li>
              <li><Link href="/privacy" className={linkStyle}>Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className={linkStyle}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Attribution Bar */}
        <div className="mt-20 pt-10 border-t border-accent/5 text-center pb-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-xs font-bold text-muted-foreground opacity-60">
            <span>© 2026 Alpha Electricals & Plumbing Ltd.</span>
            <div 
              className="relative inline-block group"
              onMouseEnter={() => setIsHoveredCoder(true)}
              onMouseLeave={() => setIsHoveredCoder(false)}
            >
              <span className="mx-1">Developed by</span>
              <a 
                href="https://mushangi-s-vision.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-black text-blue-600 hover:text-blue-500 transition-colors relative"
              >
                Coder+
              </a>
              
              {/* Emerging Celebration Emojis Animation */}
              {isHoveredCoder && (
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {celebrationEmojis.map((emoji, i) => (
                    <span 
                      key={i} 
                      className="absolute animate-float-up-fade text-sm"
                      style={{ 
                        left: `${(i * 18)}%`, 
                        animationDelay: `${i * 0.15}s`,
                        bottom: '100%',
                        opacity: 0
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span>. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
