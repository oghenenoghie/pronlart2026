import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { playfair, inter, cormorant } from "@/lib/fonts";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { Grain } from "@/components/common/Grain";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESCRIPTION =
  "A curated marketplace for original paintings, sculpture and bronze — browse by movement, buy or enquire, and explore the archive.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pronlart — Original Art & Painting Gallery",
    template: "%s · Pronlart",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Pronlart",
    title: "Pronlart — Original Art & Painting Gallery",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Pronlart — Original Art & Painting Gallery",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink font-body text-gesso antialiased">
        <LenisProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </LenisProvider>
        <Grain />
        <Analytics />
      </body>
    </html>
  );
}
