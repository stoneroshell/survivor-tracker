import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const baseUrl =
  process.env.VERCEL_URL != null
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Survivor 50 Tracker",
  description: "Strategy Companion Board for Survivor Season 50",
  icons: {
    icon: "/favicon-v1.ico",
  },
  openGraph: {
    title: "Survivor 50 Tracker",
    description: "Strategy Companion Board for Survivor Season 50",
    type: "website",
    siteName: "Survivor 50 Tracker",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Survivor 50 Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Survivor 50 Tracker",
    description: "Strategy Companion Board for Survivor Season 50",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} relative min-h-screen antialiased`}
      >
        <div className="bg-firelight" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
