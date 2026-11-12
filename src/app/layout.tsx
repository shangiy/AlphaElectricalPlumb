import type { Metadata, Viewport } from 'next';
import { Poppins, PT_Sans, Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ClientLayout } from '@/components/layout/ClientLayout';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '600', '700'],
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
  weight: ['400', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '900'],
});

export const viewport: Viewport = {
  themeColor: '#1a3a32',
};

export const metadata: Metadata = {
  title: 'AlphaElectricalPlumb',
  description: 'Premium plumbing, electrical, lighting, and home décor solutions in Eldoret, Kenya.',
  metadataBase: new URL('https://alpha-electrical-plumb-git-main-shangiys-projects.vercel.app'),
  verification: {
    google: 'X32RvS3QP_uktu5eR2tmD8IErRhM-vOsw-OIE_kYEF4',
  },
  icons: {
    icon: [
      { url: '/logo Alpha.png' },
      { url: '/logo Alpha.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/logo Alpha.png' },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased selection:bg-primary selection:text-white',
          poppins.variable,
          ptSans.variable,
          montserrat.variable
        )}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
