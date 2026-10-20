import type { Metadata } from "next";
import Link from "next/link";
import { CLUB_INFO } from "@/lib/constants";
import { Shield, Lock, EyeOff, UserCheck, Trash2, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi & Perlindungan Data Anak",
  description:
    "Kebijakan privasi Bougenville Swimming Club mengenai pengumpulan, perlindungan data pribadi atlet & anak, serta hak penghapusan data orang tua/wali.",
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-100/70 px-3.5 py-1.5 rounded-full border border-brand-200">
            <Shield className="w-4 h-4 text-brand-600" />
            <span>Perlindungan Data Pribadi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Privasi & Perlindungan Data Atlet
          </h1>
          <p className="text-sm text-slate-500">
            Terakhir diperbarui: Oktober 2026 • Berlaku untuk seluruh pendaftar {CLUB_INFO.name}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Bagian 1: Komitmen Kami */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-brand-700 font-bold text-lg">
              <Lock className="w-5 h-5 flex-shrink-0" />
              <h2>1. Komitmen Privasi & Keamanan Data</h2>
            </div>
            <p>
              <strong>{CLUB_INFO.name}</strong> sangat menghargai privasi para atlet, orang tua, dan wali murid. Kami berkomitmen penuh untuk melindungi data pribadi yang Anda berikan melalui situs web ini sesuai dengan prinsip perlindungan data pribadi dan kehati-hatian tertinggi.
            </p>
          </section>

          {/* Bagian 2: Data yang Dikumpulkan */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-brand-700 font-bold text-lg">
              <UserCheck className="w-5 h-5 flex-shrink-0" />
              <h2>2. Data Pribadi yang Kami Kumpulkan</h2>
            </div>
            <p>
              Kami hanya mengumpulkan data yang esensial untuk kebutuhan administrasi latihan renang, yaitu:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 ml-2">
              <li><strong>Nama lengkap calon atlet</strong> (untuk identifikasi peserta di kolam renang).</li>
              <li><strong>Tanggal lahir dan usia atlet</strong> (untuk penyesuaian kurikulum dan evaluasi program).</li>
              <li><strong>Nama orang tua / wali</strong> (sebagai penanggung jawab resmi atlet).</li>
              <li><strong>Nomor WhatsApp orang tua / wali</strong> (untuk konfirmasi jadwal appointment dan komunikasi penting).</li>
              <li><strong>Pilihan program dan tingkat kemampuan berenang</strong> (pemula, menengah, atau mahir).</li>
              <li><strong>Preferensi hari/jam dan catatan khusus</strong> (seperti riwayat adaptasi air atau kondisi kesehatan tertentu yang perlu diketahui pelatih).</li>
            </ul>
          </section>

          {/* Bagian 3: Perlindungan Khusus Data Anak */}
          <section className="space-y-3 p-6 rounded-2xl bg-brand-50/70 border border-brand-100">
            <div className="flex items-center gap-2.5 text-brand-900 font-bold text-lg">
              <EyeOff className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <h2>3. Perlindungan Khusus Terhadap Data Anak</h2>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              Sebagian besar atlet di klub kami merupakan anak-anak di bawah umur. Oleh karena itu:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm ml-2">
              <li>Setiap pendaftaran atlet wajib mendapatkan izin dan diisi langsung oleh orang tua atau wali yang sah.</li>
              <li><strong>Kami tidak pernah mempublikasikan daftar nama atlet, nomor kontak orang tua, atau tanggal lahir anak di halaman publik mana pun.</strong></li>
              <li>Data atlet tidak diperjualbelikan, disewakan, atau dibagikan kepada pihak pengiklan mana pun.</li>
            </ul>
          </section>

          {/* Bagian 4: Siapa yang Mengakses Data */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-brand-700 font-bold text-lg">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <h2>4. Akses Terbatas Pengelola (Admin)</h2>
            </div>
            <p>
              Akses terhadap data pendaftaran dibatasi secara ketat hanya untuk <strong>dua (2) orang pengelola resmi</strong> {CLUB_INFO.name}. Setiap akses dilindungi dengan mekanisme autentikasi terenkripsi (*Cloud Firestore Security Rules* & *Firebase Authentication*) yang diverifikasi di level backend (role allowlist), bukan sekadar menyembunyikan tombol di antarmuka.
            </p>
          </section>

          {/* Bagian 5: Hak Anda & Penghapusan Data */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-brand-700 font-bold text-lg">
              <Trash2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <h2>5. Hak Mengubah & Menghapus Data (Right to Deletion)</h2>
            </div>
            <p>
              Sebagai orang tua atau wali atlet, Anda berhak kapan saja untuk:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 ml-2">
              <li>Mengetahui rincian data anak Anda yang tersimpan di sistem kami.</li>
              <li>Memperbarui atau memperbaiki data jika terdapat kesalahan.</li>
              <li><strong>Meminta penghapusan permanen</strong> atas seluruh catatan pendaftaran dan nomor kontak dari basis data kami.</li>
            </ul>
            <p className="pt-2">
              Untuk mengajukan permohonan penghapusan atau revisi data, silakan hubungi kami melalui saluran resmi berikut:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href={CLUB_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition flex items-center gap-3 text-slate-800 text-sm font-semibold"
              >
                <Phone className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp: {CLUB_INFO.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${CLUB_INFO.email}`}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-300 transition flex items-center gap-3 text-slate-800 text-sm font-semibold"
              >
                <Mail className="w-5 h-5 text-brand-600" />
                <span>Email: {CLUB_INFO.email}</span>
              </a>
            </div>
          </section>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-bold text-brand-600 hover:text-brand-800 transition underline"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
