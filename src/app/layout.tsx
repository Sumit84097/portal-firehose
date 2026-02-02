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



import type { Metadata } from "next";
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
    default: "Project I | Identity Sovereignty",
    template: "%s | Project I",
  },
  description: "Own your digital identity and content graph. Powered by Project I.",
  // ... rest of your metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-gradient-to-b from-black via-indigo-950 to-purple-950 text-white min-h-screen`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}