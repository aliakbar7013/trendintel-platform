import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReferralTracker from "@/components/ReferralTracker";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08090d",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://trendintel.blog"),
  title: {
    default: "TrendIntel | Frontier AI, Crypto, Global Finance & Startup Intelligence",
    template: "%s | TrendIntel",
  },
  description:
    "Continuous real-time news intelligence and analytical synthesis covering frontier artificial intelligence, digital assets, central bank monetary trends, and venture deal flows.",
  keywords: [
    "artificial intelligence news",
    "crypto intelligence",
    "global finance trends",
    "startup venture capital",
    "macro economics analysis",
    "TrendIntel blog",
  ],
  authors: [{ name: "TrendIntel Editorial Bureau" }],
  creator: "TrendIntel",
  publisher: "TrendIntel.blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trendintel.blog",
    siteName: "TrendIntel",
    title: "TrendIntel | Real-Time News & Trend Intelligence",
    description:
      "Authoritative editorial intelligence syntheses covering artificial intelligence, cryptocurrencies, global markets, and venture startups.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "TrendIntel Editorial Bureau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendIntel | Real-Time News & Trend Intelligence",
    description:
      "Authoritative editorial intelligence syntheses covering AI, cryptocurrencies, global markets, and startups.",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://trendintel.blog",
    types: {
      "application/rss+xml": "https://trendintel.blog/feed.xml",
      "application/feed+json": "https://trendintel.blog/feed.json",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "TrendIntel",
    url: "https://trendintel.blog",
    logo: "https://trendintel.blog/icon.png",
    publishingPrinciples: "https://trendintel.blog/editorial-policy",
    sameAs: ["https://twitter.com/trendintel"],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="TrendIntel RSS Feed"
          href="https://trendintel.blog/feed.xml"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          title="TrendIntel JSON Feed"
          href="https://trendintel.blog/feed.json"
        />
        <link
          rel="webmention"
          href="https://webmention.io/trendintel.blog/webmention"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-[#08090d] text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-black`}
      >
        <ReferralTracker />
        <Navbar />
        <main className="flex-1 flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
