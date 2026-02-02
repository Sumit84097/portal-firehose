import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../providers/PrivyProvider"; // Your Privy wrapper

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Project I | Identity Sovereignty",
    template: "%s | Project I",
  },
  description: "Own your digital identity and content graph. Powered by Project I.",
  keywords: ["decentralized identity", "content ownership", "project i", "sovereignty", "web3"],
  authors: [{ name: "Project I Team" }],
  openGraph: {
    title: "Project I | Identity Sovereignty",
    description: "Own your digital identity and content graph.",
    url: "https://yourdomain.com", // ← replace with your real domain later
    siteName: "Project I",
    images: [
      {
        url: "/og-image.png", // ← add this image to /public later
        width: 1200,
        height: 630,
        alt: "Project I - Identity Sovereignty",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project I | Identity Sovereignty",
    description: "Own your digital identity and content graph.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png", // ← optional: add to /public
  },
  manifest: "/site.webmanifest", // ← optional
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Viewport for proper mobile scaling */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-black text-white min-h-screen`}
        suppressHydrationWarning // Prevents hydration mismatch warnings with Privy/client components
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}