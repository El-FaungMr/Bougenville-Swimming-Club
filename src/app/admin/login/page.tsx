"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Info,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  UserCheck,
} from "lucide-react";

type FlowMode = "login" | "select-account" | "enter-otp" | "success";

const OFFICIAL_ADMIN_ACCOUNTS = [
  {
    email: "admin1@bougenville.sc",
    label: "Pengelola Utama 1",
    subtitle: "admin1@bougenville.sc",
  },
  {
    email: "admin2@bougenville.sc",
    label: "Pengelola Utama 2",
    subtitle: "admin2@bougenville.sc",
  },
];

export default function AdminLoginPage() {
  const router = useRouter();

  // Mode Alur: login | select-account | enter-otp | success
  const [flowMode, setFlowMode] = useState<FlowMode>("login");

  // State Form Login Utama
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State Lupa Password & Verifikasi OTP
  const [selectedAccountEmail, setSelectedAccountEmail] = useState("admin1@bougenville.sc");
  const [customEmailInput, setCustomEmailInput] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status Request / Action
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [recoveryEmail, setRecoveryEmail] = useState("bougenville.sc@gmail.com");

  // Timer: Expiry 5 menit (300s) & Cooldown Resend (60s)
  const [expirySeconds, setExpirySeconds] = useState(300);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);

  const isConfigured = isFirebaseConfigured();

  // Timer countdown hook saat mode enter-otp
  useEffect(() => {
    if (flowMode !== "enter-otp") return;

    const timer = setInterval(() => {
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [flowMode]);

  // Format detik menjadi MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 1. Handle Login Normal
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Silakan isi alamat email dan kata sandi.");
      return;
    }

    setLoading(true);

    try {
      if (isConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        const user = userCredential.user;

        if (typeof window !== "undefined") {
          localStorage.setItem("admin_auth_email", user.email || "");
        }

        router.push("/admin");
      } else {
        // Fallback Development Mode jika Firebase belum dikonfigurasi di .env
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_auth_email", email.trim());
        }
        router.push("/admin");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      let message = "Gagal masuk ke dashboard pengelola.";

      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          message = "Email atau kata sandi pengelola salah.";
          break;
        case "auth/invalid-email":
          message = "Format alamat email tidak valid.";
          break;
        case "auth/too-many-requests":
          message = "Terlalu banyak percobaan gagal. Akun dibatasi sementara demi keamanan.";
          break;
        case "auth/network-request-failed":
          message = "Gagal terhubung ke server. Periksa koneksi internet Anda.";
          break;
        default:
          message = err.message || message;
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Permintaan Kode OTP ke Backend
  const handleRequestOtp = async (accountEmailToUse?: string) => {
    const target = (accountEmailToUse || selectedAccountEmail || customEmailInput).trim().toLowerCase();
    setResetError(null);

    if (!target) {
      setResetError("Silakan pilih atau masukkan email akun pengelola.");
      return;
    }

    if (target !== "admin1@bougenville.sc" && target !== "admin2@bougenville.sc") {
      setResetError("Akses ditolak. Fitur pemulihan kata sandi hanya untuk admin1@bougenville.sc atau admin2@bougenville.sc.");
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch("/api/admin/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal meminta kode verifikasi OTP.");
      }

      setRecoveryEmail(data.recoveryEmail || "bougenville.sc@gmail.com");
      setSelectedAccountEmail(target);
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
      setExpirySeconds(300); // 5 Menit
      setCooldownSeconds(data.cooldownSeconds || 60);
      setFlowMode("enter-otp");
    } catch (err: any) {
      setResetError(err.message || "Terjadi kesalahan saat meminta kode OTP.");
    } finally {
      setResetLoading(false);
    }
  };

  // 3. Handle Verifikasi OTP & Reset Password Baru
  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const cleanOtp = otpCode.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setResetError("Silakan masukkan 6 digit kode OTP yang diterima.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setResetError("Silakan isi kata sandi baru dan konfirmasi kata sandi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (newPassword.length < 8) {
      setResetError("Kata sandi baru minimal harus 8 karakter.");
      return;
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setResetError("Kata sandi baru harus mengandung kombinasi huruf dan angka.");
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch("/api/admin/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedAccountEmail,
          otp: cleanOtp,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui kata sandi.");
      }

      setFlowMode("success");
    } catch (err: any) {
      setResetError(err.message || "Gagal memverifikasi OTP atau menyimpan password baru.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-md w-full bg-white p-7 sm:p-9 rounded-3xl shadow-xl border border-slate-200 transition-all duration-300">
        
        {/* LOGO & BRAND HEADER */}
        <div className="text-center space-y-3 mb-6">
          <Logo size="md" className="justify-center" />
          <div className="pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5 text-brand-600" />
              <span>Portal Pengelola Resmi</span>
            </div>

            {flowMode === "login" && (
              <>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Masuk Dashboard Admin
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Akses khusus untuk dua pengelola Bougenville Swimming Club
                </p>
              </>
            )}

            {flowMode === "select-account" && (
              <>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Pemulihan Kata Sandi
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Langkah 1 dari 2: Pilih akun pengelola yang akan dipulihkan
                </p>
              </>
            )}

            {flowMode === "enter-otp" && (
              <>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Verifikasi OTP & Sandi Baru
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Langkah 2 dari 2: Masukkan kode 6 digit dan buat sandi baru
                </p>
              </>
            )}

            {flowMode === "success" && (
              <>
                <h1 className="text-2xl font-extrabold text-emerald-600">
                  Kata Sandi Berhasil Diperbarui
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Akun Anda sudah siap digunakan kembali
                </p>
              </>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAMPILAN 1: FORM LOGIN UTAMA */}
        {/* ========================================================================= */}
        {flowMode === "login" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Notifikasi Status Konfigurasi Firebase */}
            {!isConfigured && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Mode Siap Setup Firebase</p>
                  <p className="mt-0.5 text-amber-800">
                    Kredensial Firebase Client sedang berjalan dengan konfigurasi proyek default.
                  </p>
                </div>
              </div>
            )}

            {/* Alert Error Login */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Admin */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Email Pengelola
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin1@bougenville.sc"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
              </div>

              {/* Password Admin */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Kata Sandi
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>

                {/* Tombol Lupa Password */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setResetError(null);
                      if (email.trim().toLowerCase() === "admin2@bougenville.sc") {
                        setSelectedAccountEmail("admin2@bougenville.sc");
                      } else {
                        setSelectedAccountEmail("admin1@bougenville.sc");
                      }
                      setFlowMode("select-account");
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline transition focus:outline-none"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Akses...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Masuk ke Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="border-t border-slate-100 pt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Website Utama</span>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAMPILAN 2: PILIH AKUN PENGELOLA (LANGKAH 1) */}
        {/* ========================================================================= */}
        {flowMode === "select-account" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-900 flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Protokol Keamanan BSC</p>
                <p className="mt-0.5 text-sky-800">
                  Kode OTP 6-digit rahasia akan dikirimkan langsung ke email pemulihan resmi klub:{" "}
                  <span className="font-semibold text-sky-950">bougenville.sc@gmail.com</span>.
                </p>
              </div>
            </div>

            {resetError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Pilih Akun yang Ingin Dipulihkan:
              </label>

              <div className="space-y-2.5">
                {OFFICIAL_ADMIN_ACCOUNTS.map((acc) => {
                  const isSelected = selectedAccountEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => setSelectedAccountEmail(acc.email)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                        isSelected
                          ? "border-brand-500 bg-brand-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? "bg-brand-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{acc.label}</p>
                          <p className="text-xs text-slate-500">{acc.subtitle}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={resetLoading}
                onClick={() => handleRequestOtp()}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim Kode OTP...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Kirim Kode OTP 6-Digit</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetError(null);
                  setFlowMode("login");
                }}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Batal dan Kembali ke Login
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAMPILAN 3: INPUT OTP & KATA SANDI BARU (LANGKAH 2) */}
        {/* ========================================================================= */}
        {flowMode === "enter-otp" && (
          <form onSubmit={handleVerifyAndResetPassword} className="space-y-4 animate-in fade-in duration-200">
            {/* Banner Info Penerima */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Akun Target:</span>
                <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                  {selectedAccountEmail}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-500">Tujuan OTP:</span>
                <span className="font-bold text-slate-900">{recoveryEmail}</span>
              </div>
            </div>

            {/* Timer Kedaluwarsa & Resend Banner */}
            <div className="flex items-center justify-between text-xs px-1">
              <div
                className={`inline-flex items-center gap-1.5 font-bold ${
                  expirySeconds < 60 ? "text-rose-600 animate-pulse" : "text-amber-700"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {expirySeconds > 0
                    ? `OTP Berlaku: ${formatTime(expirySeconds)}`
                    : "OTP Kedaluwarsa"}
                </span>
              </div>

              {cooldownSeconds > 0 ? (
                <span className="text-slate-400 font-medium">
                  Kirim ulang ({cooldownSeconds}s)
                </span>
              ) : (
                <button
                  type="button"
                  disabled={resetLoading}
                  onClick={() => handleRequestOtp()}
                  className="font-bold text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Kirim Ulang OTP</span>
                </button>
              )}
            </div>

            {/* Error Message */}
            {resetError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            {/* INPUT KODE OTP 6-DIGIT */}
            <div>
              <label
                htmlFor="otp-code"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center"
              >
                Kode Verifikasi OTP (6 Digit)
              </label>
              <div className="relative">
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setOtpCode(val);
                  }}
                  className="w-full text-center font-mono text-2xl font-black tracking-[0.4em] py-3 rounded-2xl border-2 border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 transition text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-1">
                Periksa kotak masuk atau folder Spam di <span className="font-semibold text-slate-700">{recoveryEmail}</span>
              </p>
            </div>

            {/* INPUT KATA SANDI BARU */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Minimal 8 karakter (huruf & angka)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* KONFIRMASI KATA SANDI BARU */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Ulangi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* PANDUAN KEAMANAN PASSWORD */}
            <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className={newPassword.length >= 8 ? "text-emerald-600 font-bold" : "text-slate-400"}>
                  {newPassword.length >= 8 ? "✓" : "•"} Minimal 8 karakter
                </span>
                <span className="text-slate-300">|</span>
                <span className={/[a-zA-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? "text-emerald-600 font-bold" : "text-slate-400"}>
                  {/[a-zA-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? "✓" : "•"} Huruf & Angka
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={resetLoading || expirySeconds === 0}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Sandi Baru...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Simpan Kata Sandi Baru</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetError(null);
                  setFlowMode("select-account");
                }}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Ganti Akun Target
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAMPILAN 4: SUKSES (BERHASIL DIUBAH) */}
        {/* ========================================================================= */}
        {flowMode === "success" && (
          <div className="text-center space-y-5 py-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                Pembaruan Selesai!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Kata sandi untuk akun <strong className="text-brand-600">{selectedAccountEmail}</strong> telah berhasil diperbarui di sistem keamanan.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-left">
              <p className="font-bold">Tips Keamanan:</p>
              <p className="mt-0.5 text-emerald-800">
                Simpan kata sandi baru Anda di tempat yang aman. Kode OTP lama Anda kini sudah hangus dan tidak dapat digunakan kembali.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEmail(selectedAccountEmail);
                setPassword("");
                setErrorMessage(null);
                setFlowMode("login");
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Masuk Sekarang</span>
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
