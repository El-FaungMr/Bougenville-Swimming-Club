"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PROGRAMS, SWIMMING_LEVELS, CLUB_INFO } from "@/lib/constants";
import { RegistrationInput, RegistrationRecord } from "@/lib/types";
import { buildRegistrationWhatsAppUrl } from "@/lib/whatsapp";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Shield,
  MessageSquare,
  Sparkles,
  Info,
} from "lucide-react";

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const initialProgram = searchParams.get("program") || "reguler-4";

  // Form state
  const [formData, setFormData] = useState<RegistrationInput>({
    fullName: "",
    birthDate: "",
    age: 7,
    parentName: "",
    parentWhatsapp: "",
    program: (["reguler-3", "reguler-4", "private"].includes(initialProgram)
      ? initialProgram
      : "reguler-4") as "reguler-3" | "reguler-4" | "private",
    swimmingLevel: "pemula",
    preferredSchedule: "",
    notes: "",
    agreePrivacy: false,
  });

  // Honeypot field (anti-spam bot)
  const [honeypot, setHoneypot] = useState("");

  // Status submission
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRecord, setSuccessRecord] = useState<RegistrationRecord | null>(null);

  // Sync program jika query param berubah
  useEffect(() => {
    const p = searchParams.get("program");
    if (p && ["reguler-3", "reguler-4", "private"].includes(p)) {
      setFormData((prev) => ({
        ...prev,
        program: p as "reguler-3" | "reguler-4" | "private",
      }));
    }
  }, [searchParams]);

  // Otomatis hitung umur jika tanggal lahir dipilih
  const handleBirthDateChange = (dateStr: string) => {
    setFormData((prev) => {
      const updated = { ...prev, birthDate: dateStr };
      if (dateStr) {
        const birthYear = new Date(dateStr).getFullYear();
        const currentYear = new Date().getFullYear();
        const calculatedAge = currentYear - birthYear;
        if (calculatedAge >= 3 && calculatedAge <= 80) {
          updated.age = calculatedAge;
        }
      }
      return updated;
    });
  };

  const selectedProgramObj = PROGRAMS.find((p) => p.id === formData.program);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validasi Frontend
    if (!formData.fullName.trim()) {
      setErrorMessage("Silakan masukkan nama lengkap atlet.");
      return;
    }
    if (!formData.age || formData.age < 3 || formData.age > 80) {
      setErrorMessage("Usia atlet harus antara 3 hingga 80 tahun.");
      return;
    }
    if (!formData.parentName.trim()) {
      setErrorMessage("Silakan masukkan nama orang tua atau wali.");
      return;
    }
    const cleanPhone = formData.parentWhatsapp.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 9) {
      setErrorMessage("Nomor WhatsApp orang tua tidak valid (minimal 9 digit).");
      return;
    }
    if (!formData.preferredSchedule.trim()) {
      setErrorMessage("Silakan isi preferensi hari/jam latihan yang diinginkan.");
      return;
    }
    if (!formData.agreePrivacy) {
      setErrorMessage("Anda harus menyetujui kebijakan privasi dan pemrosesan data atlet.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          website_hp: honeypot, // honeypot
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal menyimpan pendaftaran ke sistem.");
      }

      // Berhasil disimpan di database!
      setSuccessRecord(result.data);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(
        err.message ||
          "Terjadi kendala saat menyimpan pendaftaran. Mohon periksa koneksi Anda dan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  // Tampilan Sukses & Konfirmasi WhatsApp
  if (successRecord) {
    const waUrl = buildRegistrationWhatsAppUrl(successRecord);

    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Pendaftaran Tersimpan di Sistem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pendaftaran Berhasil Dikirim!
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Data pendaftaran atlet atas nama <strong>{successRecord.fullName}</strong> telah berhasil dicatat dengan aman di basis data klub.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">ID Registrasi:</span>
              <span className="font-mono font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                {successRecord.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program:</span>
              <span className="font-bold text-slate-900">{successRecord.programTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Biaya:</span>
              <span className="font-bold text-slate-900">{successRecord.priceDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jadwal Diminati:</span>
              <span className="font-medium text-slate-900">{successRecord.preferredSchedule}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Langkah Terakhir:</strong> Silakan klik tombol di bawah ini untuk mengirim pesan konfirmasi otomatis ke WhatsApp Admin agar jadwal appointment latihan segera ditentukan.
            </span>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition duration-200 flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Buka WhatsApp & Konfirmasi ke Admin</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => {
                setSuccessRecord(null);
                setFormData({
                  fullName: "",
                  birthDate: "",
                  age: 7,
                  parentName: "",
                  parentWhatsapp: "",
                  program: "reguler-4",
                  swimmingLevel: "pemula",
                  preferredSchedule: "",
                  notes: "",
                  agreePrivacy: false,
                });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 transition underline pt-2"
            >
              Daftarkan atlet lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field (hidden from real users) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_hp">Leave this empty</label>
          <input
            type="text"
            id="website_hp"
            name="website_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pendaftaran Belum Dapat Disimpan</p>
              <p className="text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Section 1: Data Calon Atlet */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              Data Calon Atlet
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Lengkap Atlet */}
            <div className="sm:col-span-2">
              <label
                htmlFor="fullName"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Nama Lengkap Atlet *
              </label>
              <input
                type="text"
                id="fullName"
                required
                placeholder="Contoh: Muhammad Kevin Pratama"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {/* Tanggal Lahir Atlet */}
            <div>
              <label
                htmlFor="birthDate"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Tanggal Lahir (Opsional)
              </label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {/* Umur Atlet */}
            <div>
              <label
                htmlFor="age"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Usia Atlet (Tahun) *
              </label>
              <input
                type="number"
                id="age"
                required
                min="3"
                max="80"
                placeholder="Contoh: 7"
                value={formData.age || ""}
                onChange={(e) =>
                  setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Data Orang Tua / Wali */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              Data Orang Tua / Wali
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Orang Tua */}
            <div>
              <label
                htmlFor="parentName"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Nama Orang Tua / Wali *
              </label>
              <input
                type="text"
                id="parentName"
                required
                placeholder="Contoh: Bapak Hendra Wijaya"
                value={formData.parentName}
                onChange={(e) =>
                  setFormData({ ...formData, parentName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {/* Nomor WhatsApp */}
            <div>
              <label
                htmlFor="parentWhatsapp"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Nomor WhatsApp Orang Tua *
              </label>
              <input
                type="tel"
                id="parentWhatsapp"
                required
                placeholder="Contoh: 081234567890"
                value={formData.parentWhatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, parentWhatsapp: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Digunakan untuk konfirmasi jadwal latihan dan laporan evaluasi anak.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Pilihan Program & Kemampuan */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              Pilihan Program & Tingkat Kemampuan
            </h3>
          </div>

          {/* Program Selection Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Program Renang *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PROGRAMS.map((prog) => {
                const isSelected = formData.program === prog.id;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, program: prog.id })
                    }
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/70 shadow-sm ring-2 ring-brand-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-slate-900">
                        {prog.title}
                      </span>
                    </div>
                    <p className="text-base font-extrabold text-brand-700">
                      {prog.priceDisplay}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {prog.sessions}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ringkasan & Catatan Program Terpilih */}
          {selectedProgramObj && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                selectedProgramObj.isCustomPrice
                  ? "bg-amber-50/80 border-amber-200 text-amber-900"
                  : "bg-brand-50/60 border-brand-200 text-brand-900"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-600" />
                <div className="space-y-1">
                  <p className="font-bold">
                    Ringkasan Program: {selectedProgramObj.title} ({selectedProgramObj.priceDisplay})
                  </p>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {selectedProgramObj.isCustomPrice
                      ? "Catatan Penting: Untuk kelas Private, biaya Rp300.000–Rp350.000 merupakan kisaran estimasi. Harga final akan ditentukan dan dikonfirmasi langsung oleh admin setelah mengevaluasi usia serta tingkat kemampuan berenang atlet."
                      : selectedProgramObj.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tingkat Kemampuan */}
          <div>
            <label
              htmlFor="swimmingLevel"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Tingkat Kemampuan Berenang Atlet Saat Ini *
            </label>
            <select
              id="swimmingLevel"
              required
              value={formData.swimmingLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  swimmingLevel: e.target.value as "pemula" | "menengah" | "mahir",
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
            >
              {SWIMMING_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preferensi Jadwal */}
          <div>
            <label
              htmlFor="preferredSchedule"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Preferensi Hari & Jam Latihan (Appointment) *
            </label>
            <input
              type="text"
              id="preferredSchedule"
              required
              placeholder="Contoh: Sabtu & Minggu Pagi, atau Selasa Sore jam 16.00"
              value={formData.preferredSchedule}
              onChange={(e) =>
                setFormData({ ...formData, preferredSchedule: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Jadwal bersifat fleksibel dan akan disepakati bersama admin klub.
            </span>
          </div>

          {/* Catatan Tambahan (Opsional) */}
          <div>
            <label
              htmlFor="notes"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Catatan Khusus (Opsional)
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Contoh: Ada sedikit rasa takut air mendalam, riwayat alergi kaporit, atau catatan khusus lainnya."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>

        {/* Section 4: Persetujuan Kebijakan Privasi */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
            <input
              type="checkbox"
              id="agreePrivacy"
              required
              checked={formData.agreePrivacy}
              onChange={(e) =>
                setFormData({ ...formData, agreePrivacy: e.target.checked })
              }
              className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Saya selaku orang tua / wali yang sah menyatakan bahwa data yang diisi adalah benar, dan saya menyetujui pemrosesan data pribadi atlet ini untuk keperluan administrasi latihan sesuai{" "}
              <Link
                href="/kebijakan-privasi"
                target="_blank"
                className="text-brand-600 hover:underline font-semibold"
              >
                Kebijakan Privasi
              </Link>{" "}
              Bougenville Swimming Club.
            </span>
          </label>
        </div>

        {/* Tombol Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white font-extrabold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan Pendaftaran ke Sistem...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" />
                <span>Kirim Pendaftaran & Lanjut ke WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data pendaftaran tersimpan secara aman dan terenkripsi.</span>
          </p>
        </div>
      </form>
    </div>
  );
}
