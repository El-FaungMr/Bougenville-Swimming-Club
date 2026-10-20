import type { Metadata } from "next";
import { CLUB_INFO } from "@/lib/constants";
import { Phone, Mail, Instagram, MessageCircle, Clock, ShieldCheck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak Resmi",
  description:
    "Hubungi Bougenville Swimming Club melalui WhatsApp 6285135630305, Instagram @bougenville.sc, atau email bougenville.sc@gmail.co.",
};

export default function KontakPage() {
  return (
    <main className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-100/70 px-3.5 py-1.5 rounded-full border border-brand-200">
            Pusat Informasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Hubungi <span className="text-brand-600">Bougenville SC</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Punya pertanyaan mengenai program renang, penyesuaian jadwal latihan, atau pendaftaran atlet baru? Admin kami siap membantu Anda.
          </p>
        </div>

        {/* 3 Main Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-200/80 shadow-sm hover:shadow-xl transition-all space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Respon Paling Cepat
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">WhatsApp Admin</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Saluran utama untuk konsultasi jadwal appointment, konfirmasi pendaftaran, dan informasi seputar kelas renang.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-lg font-bold text-slate-900">{CLUB_INFO.whatsappDisplay}</p>
              <a
                href={CLUB_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Admin</span>
              </a>
            </div>
          </div>

          {/* Instagram Card */}
          <div className="bg-white rounded-3xl p-8 border border-pink-200/80 shadow-sm hover:shadow-xl transition-all space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Instagram className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                Media Sosial Resmi
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Instagram</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Ikuti info terkini seputar aktivitas latihan, tips renang, dan dokumentasi suasana kolam renang kami.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-lg font-bold text-slate-900">{CLUB_INFO.instagramHandle}</p>
              <a
                href={CLUB_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-sm shadow-md transition"
              >
                <Instagram className="w-4 h-4" />
                <span>Kunjungi Instagram</span>
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-3xl p-8 border border-cyan-200/80 shadow-sm hover:shadow-xl transition-all space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                Korespondensi Tertulis
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Email Resmi</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Untuk pertanyaan kerjasama, administrasi formal, atau permintaan pengelolaan data pribadi atlet.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-sm font-bold text-slate-900 break-all">{CLUB_INFO.email}</p>
              <a
                href={`mailto:${CLUB_INFO.email}`}
                className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition"
              >
                <Mail className="w-4 h-4" />
                <span>Kirim Pesan Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Info Tambahan Pelayanan */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Waktu Pelayanan & Appointment</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Jadwal Konsultasi & Konfirmasi
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Admin kami melayani pesan dan pendaftaran setiap hari. Konfirmasi jadwal latihan di kolam dilakukan berdasarkan appointment yang disepakati secara fleksibel antara pengelola dan orang tua/wali.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Privasi data nomor kontak Anda dijamin aman dan tidak dibagikan ke pihak ketiga.</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 text-xs text-slate-600">
            <h4 className="font-bold text-sm text-slate-900">Informasi Lokasi Latihan:</h4>
            <p className="leading-relaxed">
              Latihan diselenggarakan di kolam renang mitra terpilih dengan standar kebersihan sirkulasi air yang teruji dan kedalaman bertahap yang aman bagi anak-anak.
            </p>
            <p className="leading-relaxed">
              Untuk mengetahui lokasi kolam renang yang paling dekat dengan tempat tinggal Anda, silakan hubungi admin via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
