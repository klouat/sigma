import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SIGMA-Sholat",
  description:
    "Platform pembelajaran sholat inklusif berbasis visual dan BISINDO untuk siswa tunarungu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body className={`${spaceGrotesk.variable} ${plusJakartaSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
