import { NextRequest, NextResponse } from "next/server";
import { createAndStoreOtp, isOfficialAdminAccount, RECOVERY_EMAIL } from "@/lib/otp-service";
import { sendOtpEmail } from "@/lib/mail-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Alamat email pengelola wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Keamanan Ketat: Hanya admin1@bougenville.sc dan admin2@bougenville.sc
    if (!isOfficialAdminAccount(cleanEmail)) {
      return NextResponse.json(
        {
          error:
            "Akses ditolak. Layanan reset kata sandi hanya tersedia untuk akun pengelola resmi Bougenville Swimming Club.",
        },
        { status: 403 }
      );
    }

    // 2. Generate and store OTP securely
    const otpResult = await createAndStoreOtp(cleanEmail);

    if (!otpResult.success || !otpResult.otp) {
      return NextResponse.json(
        {
          error: otpResult.error || "Gagal membuat kode OTP.",
          cooldownSeconds: otpResult.cooldownSeconds,
        },
        { status: 429 }
      );
    }

    // 3. Kirim email ke bougenville.sc@gmail.com
    const mailResult = await sendOtpEmail(cleanEmail, otpResult.otp);

    if (!mailResult.success) {
      return NextResponse.json(
        {
          error:
            "Gagal mengirimkan email berisi kode OTP ke email pemulihan resmi. Pastikan koneksi internet atau konfigurasi email benar.",
        },
        { status: 500 }
      );
    }

    // 4. Return respon sukses (TIDAK menyertakan OTP mentah ke frontend)
    return NextResponse.json({
      success: true,
      message: `Kode verifikasi OTP 6 digit telah dikirim ke email pemulihan resmi (${RECOVERY_EMAIL}).`,
      recoveryEmail: RECOVERY_EMAIL,
      targetEmail: cleanEmail,
      expiresAt: otpResult.expiresAt,
      cooldownSeconds: otpResult.cooldownSeconds || 60,
      mode: mailResult.mode,
    });
  } catch (error: any) {
    console.error("POST /api/admin/forgot-password/request-otp error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat memproses permintaan OTP." },
      { status: 500 }
    );
  }
}
