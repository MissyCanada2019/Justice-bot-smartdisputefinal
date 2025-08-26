
'use client';

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import FloatingLeaves from '@/components/floating-leaves';
import '@/app/globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import Script from 'next/script';

const metadata: Metadata = {
  metadataBase: new URL('https://justice-bot.com'),
  title: 'JusticeBot.AI - Your Partner in Canadian Law',
  description:
    'AI-powered legal analysis, document summaries, and argument generation based on Canadian law. Specializing in Family, Criminal, and LTB matters with a focus on the Charter of Rights and Freedoms.',
};


declare global {
    interface Window {
        grecaptcha: any;
        google: any; // For Google Identity Services (GSI)
        gapi: any; // For Google API Client Library
    }
}

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
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
        <Script
          src="https://apis.google.com/js/api.js"
          strategy="lazyOnload"
        ></Script>
      </head>
      <body className="font-body antialiased min-h-screen">
        <AuthProvider>
          <FloatingLeaves />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
