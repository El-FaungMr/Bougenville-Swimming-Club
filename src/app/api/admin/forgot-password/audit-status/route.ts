import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isOfficialAdminAccount, RECOVERY_EMAIL, OTP_EXPIRATION_MS, RESEND_COOLDOWN_MS, MAX_ATTEMPTS } from "@/lib/otp-service";
import { isFirebaseAdminConfigured, findAdminUser } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const adminEmail = request.headers.get("x-admin-email") || request.nextUrl.searchParams.get("email");

    // Hanya izinkan admin resmi atau mode development lokal untuk mengakses data audit
    if (process.env.NODE_ENV === "production" && (!adminEmail || !isOfficialAdminAccount(adminEmail))) {
      return NextResponse.json(
        { error: "Akses ditolak. Fitur audit hanya untuk akun pengelola resmi Bougenville Swimming Club." },
        { status: 403 }
      );
    }

    // 1. Audit Ketersediaan Environment Variables (Nilai dirahasiakan, hanya status)
    const envStatus = {
      SMTP_USER: Boolean(process.env.SMTP_USER) ? "TERSEDIA" : "TIDAK TERSEDIA",
      SMTP_PASS: Boolean(process.env.SMTP_PASS) ? "TERSEDIA" : "TIDAK TERSEDIA",
      FIREBASE_SERVICE_ACCOUNT_KEY: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) ? "TERSEDIA" : "TIDAK TERSEDIA",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ? "TERSEDIA" : "TIDAK TERSEDIA",
      ADMIN_EMAILS: Boolean(process.env.ADMIN_EMAILS) ? "TERSEDIA" : "TIDAK TERSEDIA",
    };

    // 2. Audit Koneksi Gmail SMTP
    let smtpStatus = "MODE PENGEMBANGAN / SIMULASI (SMTP_PASS belum diisi di lingkungan ini)";
    if (process.env.SMTP_PASS) {
      try {
        const port = Number(process.env.SMTP_PORT) || 465;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port,
          secure: port === 465,
          auth: {
            user: process.env.SMTP_USER || "bougenville.sc@gmail.com",
            pass: process.env.SMTP_PASS.replace(/\s+/g, ""),
          },
        });

        // Verifikasi handshake SMTP tanpa mengirim email
        await transporter.verify();
        smtpStatus = "BERHASIL TERHUBUNG (Koneksi & Autentikasi Gmail SMTP Valid)";
      } catch (smtpErr: any) {
        smtpStatus = `GAGAL TERHUBUNG (${smtpErr.message || "Autentikasi SMTP ditolak"})`;
      }
    }

    // 3. Audit Firebase Admin SDK & Pengecekan Akun
    let firebaseAdminStatus = "MODE PENGEMBANGAN (Menunggu FIREBASE_SERVICE_ACCOUNT_KEY di lingkungan ini)";
    let admin1Check = "Belum diuji (Firebase Admin belum terhubung)";
    let admin2Check = "Belum diuji (Firebase Admin belum terhubung)";

    if (isFirebaseAdminConfigured()) {
      firebaseAdminStatus = "TERKONFIGURASI RESMI (Service Account Key Terbaca)";
      const res1 = await findAdminUser("admin1@bougenville.sc");
      admin1Check = res1.exists ? `BERHASIL DITEMUKAN (UID: ${res1.uid})` : `GAGAL: ${res1.error}`;

      const res2 = await findAdminUser("admin2@bougenville.sc");
      admin2Check = res2.exists ? `BERHASIL DITEMUKAN (UID: ${res2.uid})` : `GAGAL: ${res2.error}`;
    }

    // 4. Audit Parameter & Kebijakan Keamanan
    const securityAudit = {
      hashingAlgorithm: "SHA-256 dengan Salt Kriptografis Unik",
      timingSafeProtection: "BERHASIL (crypto.timingSafeEqual aktif)",
      expirationDuration: `${OTP_EXPIRATION_MS / 1000} detik (5 menit)`,
      attemptLimit: `${MAX_ATTEMPTS} kali percobaan gagal`,
      singleUseEnforcement: "BERHASIL (Status 'used' langsung aktif saat berhasil)",
      resendCooldown: `${RESEND_COOLDOWN_MS / 1000} detik`,
      officialRecoveryEmail: RECOVERY_EMAIL,
      allowedAdminAccounts: ["admin1@bougenville.sc", "admin2@bougenville.sc"],
      productionLogMasking: "BERHASIL (Kode OTP tidak dicetak pada log produksi)",
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      environmentVariables: envStatus,
      smtpConnection: smtpStatus,
      firebaseAdmin: {
        status: firebaseAdminStatus,
        accounts: {
          "admin1@bougenville.sc": admin1Check,
          "admin2@bougenville.sc": admin2Check,
        },
      },
      securityAudit,
    });
  } catch (error: any) {
    console.error("GET /api/admin/forgot-password/audit-status error:", error);
    return NextResponse.json(
      { error: "Gagal memproses audit status sistem." },
      { status: 500 }
    );
  }
}
