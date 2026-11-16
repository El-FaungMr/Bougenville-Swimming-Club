"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { COACH_INFO } from "@/lib/constants";
import {
  Award,
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  Waves,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";

interface CoachProfileProps {
  showCta?: boolean;
}

export default function CoachProfile({ showCta = true }: CoachProfileProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Kepemimpinan & Metodologi Resmi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kenali Pelatih & Metodologi Kami
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Belajar renang bukan sekadar menggerakkan tangan dan kaki. Di Bougenville SC, setiap sesi dipandu dengan pendekatan pedagogis ilmiah, ramah psikologis anak, dan berfokus pada keselamatan air.
          </p>
        </div>

        {/* Profile Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Column / Photo */}
            <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 via-brand-950 to-slate-900 p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
              {/* Ambient Glow */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Badge Status */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-cyan-300 text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{COACH_INFO.role}</span>
                </div>

                {/* Foto Profil Pelatih atau Fallback UI */}
                <div className="relative w-full aspect-[4/5] max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-800">
                  {!imgError ? (
                    <Image
                      src={COACH_INFO.image}
                      alt={COACH_INFO.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover object-top transition-transform duration-500 hover:scale-105"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    // Fallback UI yang profesional dan atletis jika file lokal belum diisi
                    <div className="w-full h-full bg-gradient-to-br from-brand-800 via-slate-900 to-cyan-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-brand-600/30 border-2 border-brand-400 flex items-center justify-center text-brand-300 shadow-inner">
                        <User className="w-12 h-12 text-cyan-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-lg text-white tracking-wide">
                          {COACH_INFO.name}
                        </p>
                        <p className="text-xs text-cyan-300 font-semibold">
                          Head Coach & Founder
                        </p>
                        <p className="text-[11px] text-slate-300 max-w-[220px]">
                          Pendidikan Jasmani Kesehatan & Rekreasi (PJKR)
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] text-emerald-300 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Pelatih Resmi Terverifikasi</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Highlight Singkat di bawah foto */}
                <div className="pt-2 text-center lg:text-left space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {COACH_INFO.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-300 font-semibold">
                    {COACH_INFO.education}
                  </p>
                  <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                    {COACH_INFO.experienceSummary}
                  </p>
                </div>
              </div>

              {/* Tagline footer card */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Bougenville Swimming Club</span>
                <span className="text-cyan-300 font-semibold">Karawang, Jawa Barat</span>
              </div>
            </div>

            {/* Content Column / Bio & Methodology */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                    Profil Profesional
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Dedikasi Penuh Pada Pedagogi Renang Ramah Anak
                  </h3>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {COACH_INFO.bio}
                </p>

                {/* 4 Pilar Metodologi Latihan */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Waves className="w-4 h-4 text-brand-600" />
                    <span>4 Pilar Metodologi Latihan Bougenville:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pilar 1 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-brand-200 transition">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <HeartHandshake className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span>Pendekatan Ramah Anak</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Metode empati tanpa paksaan, efektif membantu anak mengatasi rasa takut air (<em>water phobia</em>) hingga nyaman dan gembira.
                      </p>
                    </div>

                    {/* Pilar 2 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-brand-200 transition">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Water Safety Prioritas</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Menanamkan keahlian bertahan (<em>survival floating</em>) dan kontrol pernapasan tenang sebelum melangkah ke teknik gaya renang.
                      </p>
                    </div>

                    {/* Pilar 3 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-brand-200 transition">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <GraduationCap className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>Pedagogi Ilmiah (PJKR)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Latihan dirancang berdasarkan kaidah motorik anak dan biomekanika kayuhan agar efisien serta mencegah cedera otot.
                      </p>
                    </div>

                    {/* Pilar 4 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-brand-200 transition">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <span>Evaluasi & Komunikasi Terbuka</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Orang tua menerima pembaruan berkala mengenai tahapan perkembangan kemampuan renang anak secara jujur dan transparan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kredensial Resmi List */}
                <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 space-y-2">
                  <p className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                    Jaminan Kualitas Kepelatihan:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-950">
                    {COACH_INFO.credentials.map((cred, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span>{cred}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link jika showCta = true */}
              {showCta && (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 text-center sm:text-left">
                    <p className="font-semibold text-slate-700">Ingin berkonsultasi langsung mengenai program anak?</p>
                    <p>Coach Fahd dan tim admin siap membantu mencocokkan program yang tepat.</p>
                  </div>
                  <Link
                    href="/daftar"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <span>Daftar Latihan Bersama Coach</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
