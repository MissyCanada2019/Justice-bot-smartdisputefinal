import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JusticeBot.AI - AI-Powered Legal Assistant for Canadian Law",
    template: "%s | JusticeBot.AI"
  },
  description: "Get instant legal guidance, document analysis, and dispute resolution help with Canada's leading AI legal platform. Serving all provinces with expert legal AI assistance.",
  keywords: [
    "AI legal assistant Canada",
    "legal document analysis",
    "dispute resolution AI",
    "Canadian legal guidance",
    "legal help online",
    "AI lawyer Canada",
    "legal technology",
    "document review AI",
    "legal advice AI",
    "Canadian law assistance"
  ],
  authors: [{ name: "JusticeBot.AI Team" }],
  creator: "JusticeBot.AI",
  publisher: "JusticeBot.AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://justicebotai.com",
    siteName: "JusticeBot.AI",
    title: "JusticeBot.AI - AI-Powered Legal Assistant for Canadian Law",
    description: "Get instant legal guidance, document analysis, and dispute resolution help with Canada's leading AI legal platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JusticeBot.AI - AI Legal Assistant"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JusticeBot.AI - AI Legal Assistant",
    description: "Get instant legal guidance with Canada's leading AI legal platform.",
    images: ["/og-image.jpg"],
    creator: "@JusticeBotAI",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-site-verification-code", // Add your verification code
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "Legal Technology",
  classification: "Business",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "JusticeBot.AI",
  description: "AI-powered legal assistance platform for Canadian law",
  url: "https://justicebotai.com",
  logo: "https://justicebotai.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    areaServed: "CA",
    availableLanguage: ["English", "French"]
  },
  serviceType: "Legal Technology",
  areaServed: {
    "@type": "Country",
    name: "Canada"
  },
  offers: {
    "@type": "Offer",
    description: "AI-powered legal document analysis and guidance"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1250"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href="https://justicebotai.com" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
