'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { Facebook, Mail, ArrowUpRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';

/**
 * Premium Footer v2.5.0:
 * Features a "Mini-App" Style Support Node and dynamic identity handshake.
 */
export default function Footer() {
  const { user } = useAuth();
  
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

  const supportEmail = "info@alphaelectricalplumbingltd.com";
  
  // Intelligent Mailto: Pre-fills user info if logged in
  const mailtoLink = user 
    ? `mailto:${supportEmail}?subject=Support Inquiry: ${user.name}&body=Hello Alpha Support Engine,%0D%0A%0D%0A[Sent via Authenticated Account: ${user.email}]%0D%0A%0D%0AEnter your message below:%0D%0A`
    : `mailto:${supportEmail}`;

  return (
    <footer className="bg-secondary text-secondary-foreground border-t relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand & Support Node Column */}
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

            {/* The "Mini-App" Style Support Node */}
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
                    
                    <p className="text-sm font-bold text-accent truncate mb-1">{supportEmail}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                        Enquire about any Product or Service <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                </a>
            </div>
          </div>
          
          {/* Navigation Matrix */}
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
        
        {/* Advanced Footer Infrastructure Node */}
        <div className="mt-20 pt-10 border-t border-accent/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center lg:items-start gap-2 text-center lg:text-left">
              <p className="text-xs font-bold text-muted-foreground opacity-60">© 2026 Alpha Electricals & Plumbing Ltd. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-4">
               {/* Verified Badge with CSS Tooltip */}
               <div className="group relative flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-2xl border border-primary/10 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-help">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-accent">Verified Cloud Ecosystem</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-accent text-white text-[9px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap uppercase tracking-widest shadow-2xl scale-95 group-hover:scale-100 border border-white/10 z-50">
                    Encrypted via Supabase & Vercel Edge
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-accent" />
                  </div>
               </div>

               {/* Coder+ Credit with CSS Tooltip */}
               <div className="group relative flex items-center gap-2.5 px-5 py-2.5 bg-accent text-white rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-help">
                  <div className="h-5 w-5 bg-white rounded-md flex items-center justify-center text-accent text-[10px] font-black shadow-inner">C+</div>
                  <span className="text-[10px] font-black uppercase tracking-tight">Infrastructure by <span className="text-primary">Coder+ Web-Dev</span></span>
                  <span className="text-base">✨🎈✨🎈</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-primary text-white text-[9px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap uppercase tracking-widest shadow-2xl scale-95 group-hover:scale-100 border border-white/10 z-50">
                    Alpha Core Deployment v2.5.0
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-primary" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Structural Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />
    </footer>
  );
}
