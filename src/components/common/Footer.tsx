import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { User, Facebook, Instagram, Youtube, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Footer() {
  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-6 w-6" />, color: "text-blue-600" },
    { name: 'Instagram', href: '#', icon: <Instagram className="h-6 w-6" />, color: "text-pink-600" },
    { name: 'Youtube', href: '#', icon: <Youtube className="h-6 w-6" />, color: "text-red-600" },
    { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={24} height={24} />, color: "" },
    { name: 'WhatsApp', href: 'https://wa.me/254117484887', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={24} height={24} />, color: "text-green-500" },
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
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
      ],
    },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo Alpha.png" alt="Alpha Electricals & Plumbing Ltd Logo" width={72} height={72} />
              <span className="text-xl font-bold font-headline text-primary">Alpha Electricals & Plumbing Ltd</span>
            </Link>
            <p className="text-sm text-muted-foreground">Your partner for electrical and plumbing supplies.</p>
            <div className="mt-4">
              <h3 className="font-semibold font-headline mb-2">Subscribe to our newsletter</h3>
              <NewsletterForm />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold font-headline mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.find(s => s.title === 'Company')?.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <h3 className="font-semibold font-headline mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link 
                    key={social.name} 
                    href={social.href} 
                    className={`p-2 rounded-full bg-background/50 hover:bg-background transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold font-headline mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.find(s => s.title === 'Support')?.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
             <div className="mt-8">
              <h3 className="font-semibold font-headline mb-4">Open Hours</h3>
              <div className="text-sm text-muted-foreground">
                  <p>Open Days: Mon - Sat</p>
                  <p>Hours: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold font-headline mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.find(s => s.title === 'Legal')?.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom Section */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-[#1a1a1a] font-medium">
          <div className="flex flex-col md:flex-row items-center justify-center gap-1">
            <span>&copy; 2026 Alpha Electricals & Plumbing Ltd. </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="https://mushangi-s-vision.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative group/credit inline-flex items-center gap-1 transition-all hover:text-sky-600"
                  >
                    <span>Developed by </span>
                    <span className="font-bold text-sky-400">Coder+</span>.
                    
                    {/* Animated Hover Particles */}
                    <div className="absolute -top-12 left-0 w-full h-12 pointer-events-none overflow-visible opacity-0 group-hover/credit:opacity-100 transition-opacity">
                      <span className="absolute animate-float-up-fade left-[5%] text-lg" style={{ animationDelay: '0s' }}>🎈</span>
                      <span className="absolute animate-float-up-fade left-[25%]" style={{ animationDelay: '0.3s' }}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </span>
                      <span className="absolute animate-float-up-fade left-[50%] text-lg" style={{ animationDelay: '0.1s' }}>🎈</span>
                      <span className="absolute animate-float-up-fade left-[75%]" style={{ animationDelay: '0.5s' }}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </span>
                      <span className="absolute animate-float-up-fade left-[95%] text-lg" style={{ animationDelay: '0.2s' }}>🎈</span>
                    </div>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Portfolio website of the Coder+ WebDeveloper</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
