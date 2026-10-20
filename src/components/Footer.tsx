import Link from "next/link";
import Logo from "./Logo";
import { CLUB_INFO, PROGRAMS } from "@/lib/constants";
import { Mail, Phone, Instagram, Shield, HeartHandshake, Lock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Kolom 1: Profil Singkat Klub */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
              Klub renang yang mengedepankan pendekatan adaptif, kenyamanan, teknik terarah, dan keselamatan air (*water safety*) untuk membangun kepercayaan diri serta kebugaran setiap atlet.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={CLUB_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram Bougenville Swimming Club"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={CLUB_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp Admin Bougenville Swimming Club"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${CLUB_INFO.email}`}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Email Bougenville Swimming Club"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Program & Harga */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Program Latihan</h4>
            <ul className="space-y-2 text-sm">
              {PROGRAMS.map((prog) => (
                <li key={prog.id}>
                  <Link
                    href={`/program#${prog.id}`}
                    className="hover:text-cyan-300 transition-colors flex items-center justify-between group"
                  >
                    <span>{prog.title}</span>
                    <span className="text-xs text-slate-400 group-hover:text-cyan-200">
                      {prog.priceDisplay}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-2 text-xs text-slate-400">
                * Jadwal fleksibel melalui appointment dengan admin.
              </li>
            </ul>
          </div>

          {/* Kolom 3: Navigasi Cepat & Kebijakan */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-cyan-300 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/program" className="hover:text-cyan-300 transition-colors">
                  Program & Biaya
                </Link>
              </li>
              <li>
                <Link href="/daftar" className="hover:text-cyan-300 transition-colors">
                  Daftar Atlet Baru
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-cyan-300 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-xs text-slate-400 pt-1"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak Resmi */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Kontak Resmi</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <a
                  href={CLUB_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300"
                >
                  {CLUB_INFO.whatsappDisplay} (WA)
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${CLUB_INFO.email}`} className="hover:text-cyan-300 break-all">
                  {CLUB_INFO.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                <a
                  href={CLUB_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-300"
                >
                  {CLUB_INFO.instagramHandle}
                </a>
              </div>
            </div>
            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60"
              >
                <Lock className="w-3.5 h-3.5" /> Portal Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta & Perlindungan Privasi */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} {CLUB_INFO.name}. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <HeartHandshake className="w-3.5 h-3.5 text-brand-400" /> Melatih Dengan Hati & Dedikasi
            </span>
            <span>•</span>
            <Link href="/kebijakan-privasi" className="hover:text-slate-300 underline">
              Privasi & Perlindungan Data Anak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
