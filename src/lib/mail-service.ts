import nodemailer from "nodemailer";
import { RECOVERY_EMAIL } from "./otp-service";

export interface SendOtpResult {
  success: boolean;
  mode: "smtp" | "dev";
  error?: string;
  message?: string;
}

/**
 * Mengirim email berisi kode OTP 6 digit ke email pemulihan resmi (bougenville.sc@gmail.com).
 */
export async function sendOtpEmail(
  targetAccount: string,
  otp: string
): Promise<SendOtpResult> {
  const recipientEmail = process.env.RECOVERY_ADMIN_EMAIL || RECOVERY_EMAIL;
  const smtpUser = process.env.SMTP_USER || "bougenville.sc@gmail.com";
  const smtpPass = process.env.SMTP_PASS;

  // Jika App Password SMTP belum diatur di environment, jalankan mode simulasi aman
  if (!smtpPass) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `\n` +
        `================================================================================\n` +
        `🏊 [BOUGENVILLE SWIMMING CLUB] KODE OTP RESET PASSWORD PENGELOLA (DEV LOKAL)\n` +
        `--------------------------------------------------------------------------------\n` +
        `  Email Pemulihan Tujuan : ${recipientEmail}\n` +
        `  Akun Pengelola Target  : ${targetAccount}\n` +
        `  KODE OTP 6-DIGIT       : >> [ ${otp} ] <<\n` +
        `  Masa Berlaku           : 5 Menit (Sekali Pakai)\n` +
        `  Status SMTP            : Belum dikonfigurasi (SMTP_PASS kosong di lokal).\n` +
        `================================================================================\n`
      );
    } else {
      // Keamanan Ketat: Jangan pernah mencetak OTP di log server produksi
      console.warn(
        `[Mail Service] SMTP_PASS belum dikonfigurasi di lingkungan produksi. Email verifikasi untuk ${targetAccount} tidak dapat dikirim.`
      );
    }

    return {
      success: true,
      mode: "dev",
      message: `Kode OTP berhasil diproses (Mode pengujian).`,
    };
  }

  // Konfigurasi Transporter Nodemailer (Gmail SMTP)
  try {
    const port = Number(process.env.SMTP_PORT) || 465;
    const isSecure = port === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: isSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass.replace(/\s+/g, ""), // Hilangkan spasi pada 16 karakter app password Gmail
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const subject = `[Bougenville SC] ${otp} adalah Kode Verifikasi Reset Kata Sandi Akun ${targetAccount}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Kata Sandi Pengelola</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
          
          <!-- Header Biru Laut BSC -->
          <tr>
            <td style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 30px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">Bougenville Swimming Club</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #e0f2fe; font-weight: 500;">Portal Pengelola Resmi &bull; Keamanan Akun</p>
            </td>
          </tr>

          <!-- Konten Utama -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0f172a;">Permintaan Reset Kata Sandi</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Halo Pengelola, kami menerima permintaan pengaturan ulang kata sandi untuk akun pengelola:
              </p>

              <!-- Target Akun Chip -->
              <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                <span style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Akun Pengelola:</span><br/>
                <strong style="font-size: 15px; color: #0284c7;">${targetAccount}</strong>
              </div>

              <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Gunakan kode verifikasi OTP 6-digit di bawah ini pada halaman portal admin Bougenville Swimming Club untuk membuat kata sandi baru:
              </p>

              <!-- Kotak Kode OTP Besar -->
              <div style="background-color: #f0f9ff; border: 2px dashed #0284c7; border-radius: 14px; padding: 20px; text-align: center; margin: 25px 0;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #0369a1; font-weight: 700; margin-bottom: 8px;">KODE VERIFIKASI RESMI (OTP)</div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0284c7; padding-left: 8px;">${otp}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 500;">Berlaku selama <strong>5 menit</strong> sejak dikirimkan</div>
              </div>

              <!-- Peringatan Keamanan -->
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #92400e;">
                  <strong>Peringatan Keamanan:</strong><br/>
                  &bull; Kode ini bersifat <strong>sekali pakai</strong> dan hanya berlaku 5 menit.<br/>
                  &bull; Maksimal 5 kali percobaan verifikasi.<br/>
                  &bull; Jangan membagikan kode ini kepada siapapun termasuk pihak yang mengaku sebagai staf BSC.<br/>
                  &bull; Jika Anda tidak pernah meminta kode ini, segera hubungi rekan pengelola lainnya.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Salam hangat,<br/>
                <strong>Tim Bougenville Swimming Club</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Email ini dikirim secara otomatis ke email pemulihan resmi (${recipientEmail}) dari sistem keamanan Bougenville Swimming Club.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `
[Bougenville Swimming Club] Permintaan Reset Kata Sandi Admin
Akun Pengelola: ${targetAccount}

Kode Verifikasi OTP Anda adalah: ${otp}
Kode berlaku selama 5 menit.

Jangan pernah membagikan kode ini kepada siapapun demi keamanan akun Anda.
Email pemulihan: ${recipientEmail}
    `.trim();

    await transporter.sendMail({
      from: `"Bougenville Swimming Club" <${smtpUser}>`,
      to: recipientEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Mail Service] Email OTP berhasil dikirim ke ${recipientEmail} untuk akun ${targetAccount}`);

    return {
      success: true,
      mode: "smtp",
    };
  } catch (error: any) {
    console.error("[Mail Service] Gagal mengirim email via SMTP:", error);
    return {
      success: false,
      mode: "smtp",
      error: error.message || "Gagal mengirim email verifikasi ke alamat pemulihan.",
    };
  }
}
