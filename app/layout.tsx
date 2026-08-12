import type { Metadata } from "next";
import { playfair, inter, cormorant } from "@/lib/fonts";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { Grain } from "@/components/common/Grain";
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
      <body className="bg-ink font-body text-gesso antialiased">
        <LenisProvider>{children}</LenisProvider>
        <Grain />
      </body>
    </html>
  );
}
