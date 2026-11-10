'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { Facebook, Mail, ArrowUpRight, CheckCircle } from 'lucide-react';
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
    let mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      init();
    };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        ctx.fill();
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas!.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particles = [];
      const numberOfParticles = (canvas!.width * canvas!.height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 1;
        const x = Math.random() * canvas!.width;
        const y = Math.random() * canvas!.height;
        particles.push(new Particle(x, y, Math.random() - 0.5, Math.random() - 0.5, size));
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach(p => p.update());
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
    return () => window.removeEventListener('resize', resize);
  }, [rgb.r, rgb.g, rgb.b]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
}

export default function Footer() {
  const { user } = useAuth();
  const [particleColor, setParticleColor] = useState("#00808d");
  
  useEffect(() => {
    async function loadStyles() {
      const color = await getStorefrontSetting('footer_particle_color');
      if (color) setParticleColor(color);
    }
    loadStyles();
  }, []);

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: <Facebook className="h-5 w-5" />, color: "text-blue-600" },
    { name: 'TikTok', href: 'https://tiktok.com', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={20} height={20} />, color: "" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground border-t relative group/footer">
      <div className="relative overflow-hidden">
        <InteractiveSpiderWeb color={particleColor} />
        <div className="container mx-auto px-4 pt-20 relative z-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                  <Link href="/" className="flex items-center gap-3 group">
                      <div className="relative h-14 w-14 bg-white rounded-2xl p-2 shadow-xl border border-primary/5 transition-transform group-hover:scale-110">
                          <Image src="/logo Alpha.png" alt="Alpha" fill className="object-contain p-1.5" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-xl font-black font-headline text-accent tracking-tighter uppercase leading-none">ALPHA</span>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Ecosystem v4.3.0</span>
                      </div>
                  </Link>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] font-medium">
                      Premium destination for industrial electrical fittings and smart plumbing infrastructure.
                  </p>
              </div>
              <NewsletterForm />
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40">Company</h3>
                <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                    <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    <li><Link href="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
                </ul>
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40">Legal</h3>
                <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                    <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                </ul>
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40">Support</h3>
                <div className="p-5 rounded-3xl bg-muted/30 border border-dashed border-accent/10">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={14} className="text-primary" />
                        <h4 className="text-[10px] font-black uppercase text-accent tracking-widest">Alpha Hub Eldoret</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed opacity-80">
                        Nandi Arcade • Office 204<br/>Mon - Sat: 08:00 - 18:00
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-20 relative z-10">
        <div className="mt-20 pt-10 border-t border-accent/5">
          <div className="flex flex-col items-center justify-center gap-2 text-center w-full">
            <p className="text-xs font-bold text-muted-foreground opacity-60">
              © 2026 Alpha Electricals & Plumbing Ltd. v4.3.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
