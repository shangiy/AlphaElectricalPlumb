import type { Metadata, Viewport } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
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

export const viewport: Viewport = {
  themeColor: '#1a3a32',
};

export const metadata: Metadata = {
  title: 'AlphaElectricalPlumb',
  description: 'Premium plumbing, electrical, lighting, and home décor solutions in Eldoret, Kenya.',
  metadataBase: new URL('https://alpha-electrical-plumb-git-main-shangiys-projects.vercel.app'), // Must be a valid URL base
  verification: {
    google: 'X32RvS3QP_uktu5eR2tmD8IErRhM-vOsw-OIE_kYEF4', // Your verification code goes here
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo Alpha.png' },
      { url: '/logo Alpha.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/logo Alpha.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AlphaElectricalPlumb',
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
        <meta name="application-name" content="Alpha" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Alpha" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1a3a32" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          poppins.variable,
          ptSans.variable
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
