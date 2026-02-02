import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../providers/PrivyProvider"; // Import your PrivyProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project I | Identity Sovereignty",
  description: "Own your digital identity and content graph.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* Wrap your children with the PrivyProvider */}
          {children}
        </Providers>
      </body>
    </html>
  );
}