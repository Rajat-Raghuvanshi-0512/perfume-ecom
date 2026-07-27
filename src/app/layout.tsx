import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const ibmPlexSansHeading = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://parfumatelier.com"),
  title: {
    default: "PARFUM ATELIER | Haute Parfumerie & Artisanal Extraits",
    template: "%s | PARFUM ATELIER",
  },
  description:
    "Discover handcrafted extraits de parfum, rare Cambodian oud wood accords, and nocturnal rose botanicals distilled in Grasse, France. Explore our luxury fragrance collection and interactive scent finder.",
  keywords: [
    "perfume",
    "haute parfumerie",
    "extrait de parfum",
    "oud wood",
    "artisanal fragrance",
    "scent finder",
    "niche perfume",
    "luxury fragrance",
    "Grasse perfume",
    "perfume ecommerce",
  ],
  authors: [{ name: "PARFUM ATELIER Paris" }],
  creator: "PARFUM ATELIER",
  publisher: "PARFUM ATELIER",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PARFUM ATELIER | Haute Parfumerie & Artisanal Extraits",
    description:
      "Handcrafted extraits de parfum distilled in Grasse, France. Explore rare Cambodian oud, midnight Damask rose, and luxury discovery sets.",
    url: "https://parfumatelier.com",
    siteName: "PARFUM ATELIER",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "PARFUM ATELIER Haute Parfumerie Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PARFUM ATELIER | Haute Parfumerie",
    description: "Handcrafted extraits de parfum distilled in Grasse, France.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured JSON-LD schema for SEO rich snippet
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "PARFUM ATELIER",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
    description:
      "Haute Parfumerie & Artisanal Fragrances distilled in Grasse, France.",
    priceRange: "₹₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Credit Card, UPI, NetBanking",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Grasse",
      addressCountry: "FR",
    },
  };

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        outfit.variable,
        ibmPlexSansHeading.variable,
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
