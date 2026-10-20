import type { Metadata } from "next";
import Link from "next/link";
import { PROGRAMS, CLUB_INFO } from "@/lib/constants";
import {
  Check,
  Calendar,
  Clock,
  UserCheck,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Program & Harga",
  description:
    "Daftar program latihan renang dan biaya resmi Bougenville Swimming Club. Reguler 3 pertemuan Rp160.000, Reguler 4 pertemuan Rp200.000, dan Kelas Private Rp300.000-Rp350.000.",
};

export default function ProgramPage() {
  return (
    <main className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-100/70 px-3.5 py-1.5 rounded-full border border-brand-200">
            Investasi Kebugaran
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Program Latihan & <span className="text-brand-600">Biaya Kursus</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Pilihan paket latihan renang terjangkau dengan pendampingan intensif. Seluruh penentuan jadwal sesi dilaksanakan melalui kesepakatan appointment bersama admin klub.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROGRAMS.map((program) => (
            <div
              key={program.id}
              id={program.id}
              className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:shadow-2xl scroll-mt-24 ${
                program.badge
                  ? "border-brand-500 shadow-xl ring-2 ring-brand-500/20 relative"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {program.badge && (
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-brand-600 to-cyan-600 text-white text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {program.badge}
                </div>
              )}

              <div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {program.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mt-6 mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      {program.priceDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {program.priceNote}
                  </p>
                </div>

                {/* Info Detail */}
                <div className="space-y-2.5 pb-6 mb-6 border-b border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Jumlah Sesi: <strong>{program.sessions}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Durasi: <strong>{program.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Rasio Kelas: <strong>{program.ratio}</strong></span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Mencakup Layanan:
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/daftar?program=${program.id}`}
                className={`w-full py-4 px-4 rounded-xl font-bold text-sm text-center transition flex items-center justify-center gap-2 shadow-md ${
                  program.badge
                    ? "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 hover:shadow-brand-500/40"
                    : "bg-slate-900 hover:bg-brand-600 text-white"
                }`}
              >
                <span>Pilih {program.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Kotak Catatan Transparansi Kelas Private & Jadwal */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-amber-950">
              <h4 className="font-bold text-base text-amber-900">
                Penting Mengenai Penentuan Jadwal & Kelas Private:
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                <li>
                  <strong>Sistem Penjadwalan:</strong> Tidak ada jadwal baku yang kaku. Seluruh hari dan jam latihan disepakati via appointment bersama admin klub untuk menyesuaikan ketersediaan waktu atlet serta fasilitas kolam.
                </li>
                <li>
                  <strong>Harga Kelas Private (Rp300.000 – Rp350.000):</strong> Ditentukan langsung oleh admin klub setelah berkonsultasi mengenai usia atlet, latar belakang kondisi fisik, dan tingkat penguasaan air saat ini. Kami tidak menggunakan sistem otomatisasi harga tanpa kesepakatan transparan terlebih dahulu.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Singkat Program */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Tanya Jawab Program</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Pertanyaan Seputar Pilihan Program
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">
                Bagaimana jika anak belum pernah masuk kolam dalam sama sekali?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sangat disarankan mengambil paket <strong>Reguler 3 Pertemuan</strong> atau <strong>Private</strong>. Kami akan mendampingi di kolam dangkal terlebih dahulu hingga anak merasa aman dan percaya diri.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">
                Kapan pembayaran kursus dilakukan?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembayaran dilakukan setelah pendaftaran Anda diverifikasi dan jadwal latihan disepakati bersama admin klub melalui WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
