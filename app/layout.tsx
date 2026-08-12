import type { Metadata } from "next";
import { playfair, inter, cormorant } from "@/lib/fonts";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { Grain } from "@/components/common/Grain";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pronlart — Original Art & Painting Gallery",
    template: "%s · Pronlart",
  },
  description:
    "A curated marketplace for original paintings, sculpture and bronze — browse by movement, buy or enquire, and explore the archive.",
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
      </body>
    </html>
  );
}
