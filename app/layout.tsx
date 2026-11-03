import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";
import Toaster from "@/components/Toaster";
import LevelUp from "@/components/LevelUp";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Bailout Club",
  description: "For you, it's pocket change. For them, it's breathing room.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body className="antialiased">
        <StoreProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-5 pb-28 pt-8 md:pb-16">{children}</main>
          <Toaster />
          <LevelUp />
        </StoreProvider>
      </body>
    </html>
  );
}
