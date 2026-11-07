'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { Facebook, Mail, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

/**
 * Utility to convert hex to rgba components
 */
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 128, b: 141 }; // Default Teal
}

/**
 * Interactive Spider Web Background Component
 * Renders a particle network that follows the mouse and connects nodes.
 * Now supports dynamic colors from CMS.
 */
function InteractiveSpiderWeb({ color = "#00808d" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rgb = hexToRgb(color);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
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
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas!.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
        ctx!.shadowBlur = 0; 
      }
    }

    function init() {
      particles = [];
      const numberOfParticles = (canvas!.width * canvas!.height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 1;
        const x = (Math.random() * ((canvas!.width - size * 2) - (size * 2)) + size * 2);
        const y = (Math.random() * ((canvas!.height - size * 2) - (size * 2)) + size * 2);
        const directionX = (Math.random() * 1) - 0.5;
        const directionY = (Math.random() * 1) - 0.5;

        particles.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = (dx * dx) + (dy * dy);

          if (distance < (canvas!.width / 7) * (canvas!.height / 7)) {
            opacityValue = 1 - (distance / 20000);
            ctx!.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue * 0.2})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dxMouse = particles[a].x - mouse.x;
          const dyMouse = particles[a].y - mouse.y;
          const distanceMouse = (dxMouse * dxMouse) + (dyMouse * dyMouse);
          
          if (distanceMouse < mouse.radius * mouse.radius) {
            opacityValue = 1 - (distanceMouse / (mouse.radius * mouse.radius));
            ctx!.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue * 0.5})`;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [color, rgb.r, rgb.g, rgb.b]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none opacity-40 z-0"
      style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
    />
  );
}

/**
 * Premium Footer v2.5.2:
 * Features cursor-reactive Spider Web Particle Background with CMS Color control.
 */
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
    { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-5 w-5" />, color: "text-blue-600" },
    { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={20} height={20} />, color: "" },
    { name: 'WhatsApp', href: 'https://wa.me/254117484887', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={20} height={20} />, color: "text-green-500" },
  ];

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Team', href: '/team' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping & Returns', href: '/returns' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
        { name: 'Data Deletion', href: '/data-deletion' },
      ],
    },
  ];

  const primaryEmail = "alphaltd21@gmail.com";
  const professionalEmail = "info@alphaelectricalplumbingltd.com";
  const combinedEmails = `${primaryEmail},${professionalEmail}`;
  
  const mailtoLink = user 
    ? `mailto:${combinedEmails}?subject=Support Inquiry: ${user.name}&body=Hello Alpha Support Engine,%0D%0A%0D%0A[Sent via Authenticated Account: ${user.email}]%0D%0A%0D%0AEnter your message below:%0D%0A`
    : `mailto:${combinedEmails}`;

  return (
    <footer className="bg-secondary text-secondary-foreground border-t relative overflow-hidden group/footer">
      {/* Spider Web Layer */}
      <InteractiveSpiderWeb color={particleColor} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-14 w-14 bg-white rounded-2xl p-2 shadow-xl border border-primary/5 transition-transform group-hover:scale-110">
                        <Image src="/logo Alpha.png" alt="Alpha" fill className="object-contain p-1.5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black font-headline text-accent tracking-tighter uppercase leading-none">ALPHA</span>
                        <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Ecosystem v2.5.0</span>
                    </div>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] font-medium">
                    East Africa's premium destination for industrial electrical fittings and smart plumbing infrastructure.
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Global Newsletter</h3>
                <NewsletterForm />
            </div>

            <div className="pt-2">
                <a 
                    href={mailtoLink}
                    className="group relative flex flex-col p-6 bg-white rounded-[2.5rem] border shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden active:scale-95"
                >
                    <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                            <Mail size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase text-accent tracking-tight">Support Node</span>
                            <span className="text-[9px] text-green-600 font-black uppercase flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                Synchronized
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-0.5 mb-1 overflow-hidden">
                        <p className="text-[13px] font-bold text-accent truncate">{primaryEmail}</p>
                        <p className="text-[13px] font-bold text-accent truncate">{professionalEmail}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                        Enquire about any Product or Service <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                </a>
            </div>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-8">
              <h3 className="text-[10px] font-black font-headline uppercase tracking-[0.4em] text-accent/40">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-bold text-muted-foreground hover:text-primary hover:pl-2 transition-all inline-flex items-center gap-2 group">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {section.title === 'Company' && (
                <div className="mt-2 space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40">Social Channels</h3>
                   <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <Link 
                        key={social.name} 
                        href={social.href} 
                        className={cn(
                            "h-11 w-11 rounded-2xl bg-white border shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:-rotate-6 hover:shadow-xl",
                            social.color
                        )}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {section.title === 'Support' && (
                  <div className="mt-2 p-5 rounded-3xl bg-muted/30 border border-dashed border-accent/10">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={14} className="text-primary" />
                        <h4 className="text-[10px] font-black uppercase text-accent tracking-widest">Alpha Hub Eldoret</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed opacity-80">
                          Nandi Arcade • Office 204<br/>
                          Mon - Sat: 08:00 - 18:00
                      </p>
                  </div>
              )}
            </div>
          ))}

        </div>
        
        <div className="mt-20 pt-10 border-t border-accent/5">
          <div className="flex flex-col items-center justify-center gap-2 text-center w-full">
            <p className="text-xs font-bold text-muted-foreground opacity-60">
              © 2026 Alpha Electricals & Plumbing Ltd. Developed by{" "}
              <span className="relative group inline-block">
                <span className="group-hover:text-blue-500 transition-colors duration-300 cursor-default">
                  Coder+
                </span>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500">
                  <span className="animate-float-up-fade inline-block" style={{ animationDelay: '0s' }}>✨</span>
                  <span className="animate-float-up-fade inline-block" style={{ animationDelay: '0.3s' }}>🎈</span>
                  <span className="animate-float-up-fade inline-block" style={{ animationDelay: '0.6s' }}>✨</span>
                </span>
              </span>
              {" "} . All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />
    </footer>
  );
}

