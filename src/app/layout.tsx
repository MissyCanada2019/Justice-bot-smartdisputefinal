
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import FloatingLeaves from '@/components/floating-leaves';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JusticeBot.AI | AI-Powered Legal Tools for Canada',
  description:
    'Navigate the Canadian legal system with confidence. AI-powered document analysis, form generation, and case guidance for self-represented litigants.',
  metadataBase: new URL('https://justicebotai.com'), // Replace with your actual domain
  openGraph: {
    title: 'JusticeBot.AI',
    description: 'AI-Powered Legal Tools for Canada',
    images: [
      {
        url: '/og-image.png', // Make sure to add an og-image.png to your public folder
        width: 1200,
        height: 630,
        alt: 'JusticeBot.AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JusticeBot.AI',
    description: 'AI-Powered Legal Tools for Canada',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#D8282D',
  initialScale: 1,
  width: 'device-width',
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <script src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} async defer></script>
      </head>
      <body className={`${inter.className} font-body bg-background text-foreground`}>
        <AuthProvider>
          <FloatingLeaves />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
