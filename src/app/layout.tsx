import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bougenville Swimming Club | Les & Pembinaan Renang Profesional",
    template: "%s | Bougenville Swimming Club",
  },
  description:
    "Klub renang Bougenville Swimming Club menghadirkan program latihan renang berjenjang, kelas reguler & private dengan pendekatan ramah, adaptif, dan mengutamakan water safety.",
  keywords: [
    "Bougenville Swimming Club",
    "les renang",
    "kursus renang anak",
    "pelatih renang privat",
    "klub renang",
    "belajar renang dewasa",
    "water safety",
  ],
  authors: [{ name: "Bougenville Swimming Club" }],
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "Bougenville Swimming Club | Les & Pembinaan Renang",
    description:
      "Program latihan renang terstruktur, ramah pemula, dan kelas privat intensif bersama Bougenville Swimming Club.",
    url: "https://bougenville-sc.web.app",
    siteName: "Bougenville Swimming Club",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
