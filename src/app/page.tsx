import Link from "next/link";
import Image from "next/image";
import { PROGRAMS, CLUB_INFO } from "@/lib/constants";
import {
  Waves,
  ShieldCheck,
  Users,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-brand-50 via-white to-slate-50 border-b border-slate-100">
        {/* Glow ambient background effects */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Teks Hero */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                <span>Pendaftaran Atlet Baru Terbuka</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Bangun Percaya Diri & Teknik di Setiap{" "}
                <span className="bg-gradient-to-r from-brand-600 via-cyan-600 to-brand-800 bg-clip-text text-transparent">
                  Kayuhan Renang
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Selamat datang di <strong>Bougenville Swimming Club</strong>. Kami
                membimbing anak-anak, remaja, hingga dewasa dengan kurikulum bertahap,
                pendekatan yang sabar dan menyenangkan, serta mengutamakan keselamatan air (*water safety*).
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/daftar"
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
                >
                  <Waves className="w-5 h-5" />
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/program"
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-200 hover:border-slate-300 shadow-sm transition duration-200 flex items-center justify-center gap-2"
                >
                  <span>Lihat Program & Biaya</span>
                </Link>
              </div>

              {/* Point Highlights */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-brand-700">Terarah</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">Teknik Bertahap</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-brand-700">Aman</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">Water Safety 1st</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-brand-700">Fleksibel</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">Jadwal Appointment</p>
                </div>
              </div>
            </div>

            {/* Visual Card Hero */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-100">
                  <div className="relative w-full h-[400px]">
                    <Image
                      src="https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80"
                      alt="Anak berlatih renang di Bougenville Swimming Club"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      Lingkungan Latihan Positif
                    </div>
                    <h3 className="text-xl font-bold leading-snug">Metode Belajar Terukur & Sabar</h3>
                    <p className="text-xs text-slate-200 mt-1">
                      Membantu setiap atlet mengatasi keraguan, menguasai teknik bernapas, dan meluncur percaya diri.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Nilai & Keunggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Mengapa Berlatih Bersama Bougenville?
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Kami percaya proses belajar renang yang efektif lahir dari rasa aman, bimbingan yang konsisten, dan komunikasi yang terbuka dengan orang tua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Keunggulan 1 */}
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Water Safety First</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Menanamkan insting keselamatan air, teknik mengapung bertahan, dan pernapasan yang tepat sejak pertemuan awal.
              </p>
            </div>

            {/* Keunggulan 2 */}
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pendekatan Ramah Anak</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Melatih dengan kesabaran tinggi, tanpa paksaan, sehingga anak merasa nyaman dan menantikan setiap sesi latihan.
              </p>
            </div>

            {/* Keunggulan 3 */}
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Jadwal Fleksibel</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Jadwal latihan disepakati via appointment langsung bersama admin klub, memudahkan penyesuaian dengan agenda sekolah.
              </p>
            </div>

            {/* Keunggulan 4 */}
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pilihan Reguler & Private</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tersedia kelas grup terarah maupun kelas private 1-on-1 intensif untuk percepatan kemampuan renang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RINGKASAN PROGRAM & HARGA */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-100/60 px-3 py-1 rounded-full">
              Pilihan Program
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Program Latihan & Biaya Resmi
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Biaya transparan tanpa biaya tersembunyi. Jadwal ditentukan berdasarkan appointment dan kesepakatan bersama admin klub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMS.map((program) => (
              <div
                key={program.id}
                className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                  program.badge
                    ? "border-brand-400 shadow-md ring-2 ring-brand-500/10 relative"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {program.badge && (
                  <span className="absolute -top-3 right-6 bg-brand-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {program.badge}
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{program.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{program.description}</p>

                  <div className="mt-6 mb-6 pb-6 border-b border-slate-100">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {program.priceDisplay}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{program.priceNote}</p>
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm text-slate-600 mb-8">
                    {program.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/daftar?program=${program.id}`}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center transition flex items-center justify-center gap-2 ${
                    program.badge
                      ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
                      : "bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700"
                  }`}
                >
                  <span>Daftar {program.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              * Khusus program <strong>Private</strong>, biaya Rp300.000–Rp350.000 merupakan estimasi kisaran dan harga final akan dikonfirmasi oleh admin setelah mengevaluasi usia serta tingkat kemampuan berenang calon atlet.
            </p>
          </div>
        </div>
      </section>

      {/* CARA MENDAFTAR SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Alur Mudah
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              3 Langkah Mudah Memulai Latihan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 mx-auto rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center mb-4 text-lg">
                1
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Isi Formulir Online</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Lengkapi nama atlet, umur, pilihan program, kemampuan renang, dan kontak orang tua/wali melalui formulir di website.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center mb-4 text-lg">
                2
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Konfirmasi via WhatsApp</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Setelah tersimpan di sistem, Anda diarahkan otomatis ke WhatsApp admin untuk menyepakati hari & jam latihan (appointment).
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center mb-4 text-lg">
                3
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Mulai Latihan di Kolam</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Datang ke kolam renang sesuai jadwal appointment dan nikmati sesi latihan renang yang seru, aman, dan mendidik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Siap Memulai Perjalanan Renang Bersama Bougenville?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Daftarkan diri atau putra-putri Anda sekarang. Kami siap membantu Anda belajar renang dari dasar hingga mahir dengan pendampingan terbaik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/daftar"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-brand-900 font-extrabold text-sm shadow-lg transition"
            >
              Isi Formulir Pendaftaran
            </Link>
            <a
              href={CLUB_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tanya Admin via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
