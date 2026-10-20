"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { CLUB_INFO } from "@/lib/constants";
import { Menu, X, Waves, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Program & Harga", href: "/program" },
    { label: "Formulir Pendaftaran", href: "/daftar" },
    { label: "Kontak", href: "/kontak" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Banner Kontak & Info Cepat */}
      <div className="bg-brand-950 text-slate-300 text-xs py-2 px-4 border-b border-brand-800/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <Waves className="w-3.5 h-3.5 text-cyan-400" /> Klub & Les Renang Bougenville
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">
              Jadwal Sesi via Appointment Bersama Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={CLUB_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors"
            >
              Instagram: {CLUB_INFO.instagramHandle}
            </a>
            <span className="text-slate-500">•</span>
            <a
              href={CLUB_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              WhatsApp Admin: {CLUB_INFO.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors duration-200 py-1 border-b-2 ${
                      active
                        ? "text-brand-600 border-brand-600"
                        : "text-slate-600 hover:text-brand-600 border-transparent"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-semibold py-2 px-3 rounded-lg transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/daftar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold shadow-md text-center"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
