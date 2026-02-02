// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Providers from "../providers/PrivyProvider"; // Import your PrivyProvider

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Project I | Identity Sovereignty",
//   description: "Own your digital identity and content graph.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Providers> {/* Wrap your children with the PrivyProvider */}
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }



import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../providers/PrivyProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aether | Project I",
    template: "%s | Aether",
  },
  description: "Own your digital identity and content graph. Powered by Project I.",
  keywords: ["decentralized identity", "content ownership", "project i", "sovereignty", "web3"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0f1c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0f1c]`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}