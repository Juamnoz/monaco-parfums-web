import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { QuickViewProvider } from "@/context/quick-view-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { QuickViewModal } from "@/components/quick-view-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileNav } from "@/components/mobile-nav";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Monaco Parfums — El lujo de oler diferente",
  description:
    "Perfumería árabe y de nicho en Colombia. Fragancias originales de las mejores casas árabes y ILMIN Parfums.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-24 md:pb-0">
        <CartProvider>
          <QuickViewProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <WhatsappFloat />
            <QuickViewModal />
            <CartDrawer />
            <MobileNav />
          </QuickViewProvider>
        </CartProvider>
      </body>
    </html>
  );
}
