
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Facebook } from 'lucide-react';
import Image from 'next/image';
import NewsletterForm from '@/components/common/NewsletterForm';


export default function ContactPage() {
  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-6 w-6" /> },
    { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={24} height={24} /> },
    { name: 'WhatsApp', href: 'https://wa.me/254117484887', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={24} height={24} /> },
  ];

  return (
    <>
      <section 
        className="relative h-[50vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/elegant_background.jpg')" }}
        data-ai-hint="elegant abstract background"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="container px-4">
            <h1 className="text-4xl font-bold font-headline md:text-5xl">Contact Us</h1>
            <p className="mt-2 text-lg max-w-2xl mx-auto">
              Come for a site visit or get in touch with.
            </p>
            <p className="mt-2 text-lg max-w-2xl mx-auto">
              You can pay us a visit at our offices located at:
            </p>
          </div>
        </div>
      </section>

      <div className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get in Touch</CardTitle>
              <CardDescription className="text-center">
                  We'd love to hear from you. Pay us a visit or send us a message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-4">
                <div className="flex flex-col items-center">
                  <Mail className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Email</h3>
                  <a href="mailto:Alphaltd21@gmail.com" className="text-muted-foreground hover:text-primary">
                    Alphaltd21@gmail.com
                  </a>
                </div>
                <div className="flex flex-col items-center">
                  <Phone className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <a href="tel:+254117484887" className="text-muted-foreground hover:text-primary">
                    0117 484887
                  </a>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Open Hours</h3>
                  <p className="text-muted-foreground">Mon - Sat: 8:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="space-y-8 pt-8 border-t">
                  <h3 className="text-2xl font-bold font-headline text-center">Our Locations</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Nandi Arcade, Eldoret</h4>
                          <div className="aspect-video overflow-hidden rounded-lg border">
                            <iframe
                                  src="https://maps.google.com/maps?q=nandi%20arcade%20eldoret&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                  className="w-full h-full"
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
                          </div>
                      </div>
                      <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Kisumu Ndogo (Opp. Naivas)</h4>
                          <div className="aspect-video overflow-hidden rounded-lg border">
                              <iframe
                                  src="https://maps.google.com/maps?q=Elgon%20View%20Mall%20Eldoret&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                  className="w-full h-full"
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
                          </div>
                      </div>
                  </div>
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-4xl mx-auto mt-12 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join Our Community</CardTitle>
              <CardDescription>
                Stay updated with the latest trends, special offers, and new arrivals.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold mb-4">Follow Us on Social Media</h3>
                  <div className="flex justify-center md:justify-start gap-4">
                    {socialLinks.map((social) => (
                      <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full border hover:bg-accent" aria-label={social.name}>
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-center md:text-left">Subscribe to our Newsletter</h3>
                  <NewsletterForm />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
