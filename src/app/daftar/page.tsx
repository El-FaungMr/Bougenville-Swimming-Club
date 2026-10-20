import type { Metadata } from "next";
import { Suspense } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import { CLUB_INFO } from "@/lib/constants";
import { ShieldCheck, Phone, Waves, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran Atlet Baru",
  description:
    "Formulir pendaftaran atlet renang baru Bougenville Swimming Club. Mudah diisi dari ponsel, aman, dan langsung terhubung dengan konfirmasi WhatsApp admin.",
};

export default function DaftarPage() {
  return (
    <main className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-100/70 px-3.5 py-1.5 rounded-full border border-brand-200">
            <Waves className="w-4 h-4 text-brand-600" />
            <span>Pendaftaran Resmi Online</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Formulir Pendaftaran Atlet Baru
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Lengkapi data di bawah ini untuk memulai latihan di <strong>{CLUB_INFO.name}</strong>. Setelah pendaftaran tersimpan, Anda akan otomatis terhubung ke WhatsApp Admin untuk penyesuaian jadwal.
          </p>
        </div>

        {/* Form Container dengan Suspense */}
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-200 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              <p className="text-sm text-slate-500">Memuat formulir pendaftaran...</p>
            </div>
          }
        >
          <RegistrationForm />
        </Suspense>

        {/* Bantuan Pendaftaran */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Mengalami kesulitan saat mengisi formulir?
              </p>
              <p className="text-xs text-slate-500">
                Admin kami siap membantu mendaftarkan Anda secara langsung melalui chat WhatsApp.
              </p>
            </div>
          </div>
          <a
            href={CLUB_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-xs font-bold text-slate-700 transition flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Hubungi WhatsApp</span>
          </a>
        </div>
      </div>
    </main>
  );
}
