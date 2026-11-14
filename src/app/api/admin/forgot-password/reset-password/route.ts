import { NextRequest, NextResponse } from "next/server";
import { verifyAndConsumeOtp, isOfficialAdminAccount } from "@/lib/otp-service";
import { updateAdminUserPassword } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, otp, newPassword, confirmPassword } = body;

    // 1. Validasi Keberadaan Field
    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Semua kolom (email, OTP, kata sandi baru, dan konfirmasi) wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Keamanan Allowlist Akun Admin
    if (!isOfficialAdminAccount(cleanEmail)) {
      return NextResponse.json(
        {
          error:
            "Akses ditolak. Layanan reset kata sandi hanya tersedia untuk akun pengelola resmi Bougenville Swimming Club.",
        },
        { status: 403 }
      );
    }

    // 3. Validasi Kesamaan Password Baru
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru." },
        { status: 400 }
      );
    }

    // 4. Validasi Kekuatan Password
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal harus terdiri dari 8 karakter." },
        { status: 400 }
      );
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      return NextResponse.json(
        { error: "Kata sandi baru harus mengandung kombinasi huruf dan angka." },
        { status: 400 }
      );
    }

    // 5. Verifikasi Kode OTP (Mengecek Expiry, Hash, Attempt Limits, dan Single-Use)
    const verification = await verifyAndConsumeOtp(cleanEmail, otp);

    if (!verification.valid) {
      return NextResponse.json(
        {
          error: verification.error || "Kode OTP tidak valid.",
          attemptsRemaining: verification.attemptsRemaining,
        },
        { status: 400 }
      );
    }

    // 6. OTP Valid -> Perbarui Password Akun di Firebase Authentication via Firebase Admin SDK
    const updateResult = await updateAdminUserPassword(cleanEmail, newPassword);

    if (!updateResult.success) {
      return NextResponse.json(
        {
          error:
            updateResult.error ||
            "Gagal memperbarui kata sandi di Firebase Authentication.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Kata sandi akun ${cleanEmail} berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda.`,
      targetEmail: cleanEmail,
      devMode: updateResult.devMode,
    });
  } catch (error: any) {
    console.error("POST /api/admin/forgot-password/reset-password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server saat memperbarui kata sandi." },
      { status: 500 }
    );
  }
}
