
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Facebook, Twitter } from 'lucide-react';

const teamMembers = [
    {
      name: 'Richard Kinyungu',
      role: 'Sales Manager',
      bio: 'Richard leads our sales team, driving business growth and ensuring customer satisfaction with his extensive experience.',
      image: '/richard-kinyungu.jpg',
      dataAiHint: 'professional businessman',
      socials: [
        { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-5 w-5" /> },
        { name: 'WhatsApp', href: 'https://wa.me/254117484887', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={20} height={20} /> },
        { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={20} height={20} /> },
      ]
    },
    {
      name: 'Peter Karanja',
      role: 'Operations Head',
      bio: 'Peter oversees all operational aspects, ensuring efficiency and excellence in our service delivery from start to finish.',
      image: '/peter-karanja.jpg',
      dataAiHint: 'operations manager',
      socials: [
        { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-5 w-5" /> },
        { name: 'WhatsApp', href: 'https://wa.me/254727751718', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={20} height={20} /> },
        { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={20} height={20} /> },
      ]
    },
    {
      name: 'Miriam Njeri',
      role: 'Customer Support +',
      bio: 'Miriam is the friendly voice of our company, dedicated to providing exceptional support and resolving customer inquiries.',
      image: '/miriam-njeri.jpg',
      dataAiHint: 'customer support professional',
      socials: [
        { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-5 w-5" /> },
        { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={20} height={20} /> },
        { name: 'WhatsApp', href: 'https://wa.me/254117484887', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={20} height={20} /> },
      ]
    },
    {
      name: 'Val',
      role: 'Social Media Manager',
      bio: 'Val masterfully manages our online presence, engaging with our community across all social platforms.',
      image: '/val.jpg',
      dataAiHint: 'social media manager',
      socials: [
        { name: 'Facebook', href: 'https://www.facebook.com/Alphaelectricalsandplumbing', icon: <Facebook className="h-5 w-5" /> },
        { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={20} height={20} /> },
        { name: 'WhatsApp', href: 'https://wa.me/254713920922', icon: <Image src="/whatsapp--v1.png" alt="WhatsApp" width={20} height={20} /> },
      ]
    },
    {
      name: 'Shangi',
      role: 'Website Developer',
      bio: 'Shangi is the technical wizard behind our website, ensuring a smooth and seamless online experience for our customers.',
      image: '/shangi.jpg',
      dataAiHint: 'software developer',
      socials: [
        { name: 'Twitter', href: 'https://www.x.com/@patrickshangst1', icon: <Twitter className="h-5 w-5" /> },
        { name: 'TikTok', href: 'https://www.tiktok.com/@AlphaElectricalsandplumb', icon: <Image src="/tiktok-V1.png" alt="TikTok" width={20} height={20} /> },
      ]
    },
];

export default function TeamPage() {
  return (
    <>
        <section 
            className="relative h-[50vh] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/connect-bg.jpg')" }}
            data-ai-hint="team background"
        >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
                <div className="container px-4">
                    <h1 className="text-4xl font-bold font-headline md:text-5xl">Here Is Our Very Able Team</h1>
                    <p className="mt-2 text-lg max-w-2xl mx-auto">
                        Meet the dedicated individuals behind the thriving Alpha Electricals & Plumbing Ltd.
                    </p>
                </div>
            </div>
        </section>

        <section 
            className="relative py-16 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/elegant_background.jpg')" }}
            data-ai-hint="elegant abstract background"
        >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                    <Card key={member.name} className="text-center overflow-hidden hover:shadow-xl transition-shadow bg-card">
                    <div className="aspect-square bg-muted">
                        <Image
                            src={member.image}
                            alt={`Portrait of ${member.name}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                            data-ai-hint={member.dataAiHint}
                        />
                    </div>
                    <CardHeader>
                        <CardTitle>{member.name}</CardTitle>
                        <p className="text-primary font-semibold">{member.role}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                        <div className="flex justify-center items-center gap-4">
                        {member.socials.map((social) => (
                            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            {social.icon}
                            </a>
                        ))}
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
        </section>
    </>
  );
}
