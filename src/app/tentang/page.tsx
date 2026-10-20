import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CLUB_INFO } from "@/lib/constants";
import { ShieldCheck, Heart, Target, Compass, ArrowRight, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Profil, tujuan latihan, dan nilai-nilai klub renang Bougenville Swimming Club. Pendekatan latihan yang humanis, terarah, dan mengutamakan keselamatan air.",
};

export default function TentangPage() {
  return (
    <main className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-100/70 px-3.5 py-1.5 rounded-full border border-brand-200">
            Mengenal Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tentang <span className="text-brand-600">Bougenville Swimming Club</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Wadah pembelajaran dan pembinaan olahraga renang yang berakar pada komitmen menjaga keselamatan, menumbuhkan rasa percaya diri, dan melatih teknik renang secara tepat dan berkelanjutan.
          </p>
        </div>

        {/* Profil Klub & Foto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-md">
            <div className="relative w-full h-[360px] sm:h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=800&q=80"
                alt="Suasana latihan renang di Bougenville Swimming Club"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-md">
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Profil Klub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Belajar Renang Dengan Nyaman, Aman, dan Terbimbing
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <strong>Bougenville Swimming Club</strong> hadir untuk menyediakan lingkungan latihan renang yang sehat, suportif, dan terstruktur bagi seluruh kalangan usia—khususnya anak-anak dan remaja yang ingin memulai adaptasi air maupun mengasah kemampuan fisik mereka.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Kami menyadari bahwa setiap peserta didik memiliki latar belakang, kondisi fisik, dan keberanian yang berbeda terhadap air. Oleh karena itu, pendekatan kami mengutamakan kesabaran dan metode pengajaran bertahap, menjamin setiap langkah dilakukan dengan aman tanpa menimbulkan trauma atau paksaan.
            </p>
          </div>
        </div>

        {/* Tujuan Latihan */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Arah & Sasaran</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tujuan Latihan di Bougenville
            </h2>
            <p className="text-sm text-slate-600">
              Fokus utama kami dalam membimbing setiap atlet selama proses latihan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Keselamatan Air (Water Safety)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Menjadikan keahlian bertahan hidup di air (*survival floating*) dan kontrol ketenangan sebagai prioritas mutlak sebelum melangkah ke teknik yang lebih rumit.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Penguasaan Teknik Dasar</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Membangun fondasi kayuhan, pernapasan berirama, dan hidrodinamika tubuh yang benar agar berenang menjadi efisien serta tidak cepat lelah.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Kebugaran Fisik Menyeluruh</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Meningkatkan kapasitas paru-paru, memperkuat otot inti dan tungkai, serta menjaga postur tubuh yang tegak dan sehat.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4. Pembentukan Mental Juara</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Melatih konsistensi, daya juang menghadapi tantangan, sportivitas, serta rasa percaya diri dalam berinteraksi dengan lingkungan sosial.
              </p>
            </div>
          </div>
        </div>

        {/* Nilai-Nilai Klub */}
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Prinsip Kami</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Nilai-Nilai Klub Bougenville</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Prinsip yang kami junjung tinggi dalam setiap sesi latihan dan interaksi dengan atlet maupun orang tua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
              <h4 className="text-base font-bold text-cyan-300">Integritas & Kejujuran</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Kami menyampaikan evaluasi kemampuan renang secara transparan dan jujur apa adanya demi keselamatan serta perkembangan murni atlet.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
              <h4 className="text-base font-bold text-cyan-300">Pendekatan Penuh Kesabaran</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Menghilangkan ketakutan terhadap air memerlukan empati. Kami membimbing anak dengan kehangatan dan motivasi yang membesarkan hati.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
              <h4 className="text-base font-bold text-cyan-300">Komunikasi Terbuka</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Orang tua/wali adalah mitra utama kami. Kesepakatan jadwal latihan dilakukan secara musyawarah demi kenyamanan bersama.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition"
          >
            <span>Daftarkan Atlet Bersama Kami</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
