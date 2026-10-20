"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, KeyRound, AlertCircle, Loader2, ArrowLeft, ShieldCheck, Info } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfigured = isFirebaseConfigured();

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
        // Login melalui Firebase Authentication resmi
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        const user = userCredential.user;

        // Simpan sesi admin lokal untuk header request
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_auth_email", user.email || "");
        }

        router.push("/admin");
      } else {
        // Fallback Development Mode jika Firebase belum dikonfigurasi di .env
        // Menyimpan email penguji untuk sesi lokal
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

  return (
    <main className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center space-y-3">
          <Logo size="md" className="justify-center" />
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5 text-brand-600" />
              <span>Portal Pengelola Resmi</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Masuk Dashboard Admin
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Akses khusus untuk dua pengelola Bougenville Swimming Club
            </p>
          </div>
        </div>

        {/* Notifikasi Status Konfigurasi Firebase */}
        {!isConfigured && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Mode Siap Setup Firebase</p>
              <p className="mt-0.5 text-amber-800">
                Variabel environment Firebase belum diisi. Anda dapat menguji login lokal langsung, atau memasukkan kredensial Firebase di <code className="bg-amber-100 px-1 rounded">.env.local</code> sesuai petunjuk README.
              </p>
            </div>
          </div>
        )}

        {/* Alert Error */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="admin@bougenville.sc"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          {/* Password Admin */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Kata Sandi
            </label>
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
    </main>
  );
}
