import crypto from "crypto";
import { getAdminFirestore } from "./firebase-admin";

export const ALLOWED_ADMIN_ACCOUNTS = [
  "admin1@bougenville.sc",
  "admin2@bougenville.sc",
] as const;

export const RECOVERY_EMAIL = "bougenville.sc@gmail.com";
export const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 menit
export const RESEND_COOLDOWN_MS = 60 * 1000; // 60 detik cooldown
export const MAX_ATTEMPTS = 5; // Batas percobaan gagal
const OTP_COLLECTION = "_admin_otp_requests";

export interface OtpRecord {
  targetEmail: string;
  recoveryEmail: string;
  salt: string;
  hashedOtp: string;
  expiresAt: number;
  createdAt: number;
  lastRequestedAt: number;
  attemptsRemaining: number;
  used: boolean;
  usedAt?: number;
  requestCountInWindow: number;
  windowStartTime: number;
}

// Fallback Memory Store untuk Dev Serverless / Lokal jika Service Account belum diatur
const globalForOtp = globalThis as unknown as {
  _otpMemoryStore?: Map<string, OtpRecord>;
};
const memoryStore = globalForOtp._otpMemoryStore || new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== "production") {
  globalForOtp._otpMemoryStore = memoryStore;
}

/**
 * Validasi apakah email termasuk salah satu dari dua akun pengelola resmi
 */
export function isOfficialAdminAccount(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ALLOWED_ADMIN_ACCOUNTS.includes(clean as any);
}

/**
 * Menghasilkan hash SHA-256 dari OTP + Salt
 */
export function hashOtp(otp: string, salt: string): string {
  return crypto.createHash("sha256").update(salt + ":" + otp).digest("hex");
}

/**
 * Mengambil record OTP yang tersimpan (dari Firestore Admin atau memory fallback)
 */
async function getStoredOtpRecord(cleanEmail: string): Promise<OtpRecord | null> {
  const adminDb = getAdminFirestore();

  if (adminDb) {
    try {
      const docSnap = await adminDb.collection(OTP_COLLECTION).doc(cleanEmail).get();
      if (docSnap.exists) {
        return docSnap.data() as OtpRecord;
      }
      return null;
    } catch (err) {
      console.error("[OTP Service] Gagal membaca record dari Firestore:", err);
    }
  }

  return memoryStore.get(cleanEmail) || null;
}

/**
 * Menyimpan record OTP (ke Firestore Admin dan memory fallback)
 */
async function saveOtpRecord(cleanEmail: string, record: OtpRecord): Promise<void> {
  memoryStore.set(cleanEmail, record);

  const adminDb = getAdminFirestore();
  if (adminDb) {
    try {
      await adminDb.collection(OTP_COLLECTION).doc(cleanEmail).set(record);
    } catch (err) {
      console.error("[OTP Service] Gagal menulis record ke Firestore:", err);
    }
  }
}

/**
 * Membuat OTP 6 digit baru dan menyimpannya secara terenkripsi (hashed)
 */
export async function createAndStoreOtp(
  targetEmail: string
): Promise<{
  success: boolean;
  otp?: string;
  recoveryEmail?: string;
  expiresAt?: number;
  cooldownSeconds?: number;
  error?: string;
}> {
  const cleanEmail = targetEmail.trim().toLowerCase();

  // 1. Keamanan: Verifikasi allowlist 2 akun admin resmi
  if (!isOfficialAdminAccount(cleanEmail)) {
    return {
      success: false,
      error: "Akses ditolak. Fitur reset password hanya dapat digunakan oleh akun pengelola resmi Bougenville Swimming Club.",
    };
  }

  const now = Date.now();
  const existingRecord = await getStoredOtpRecord(cleanEmail);

  // 2. Perlindungan Cooldown & Rate Limit
  let requestCount = 1;
  let windowStart = now;

  if (existingRecord) {
    // Cooldown 60 detik antar permintaan
    const elapsedSinceLast = now - existingRecord.lastRequestedAt;
    if (elapsedSinceLast < RESEND_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsedSinceLast) / 1000);
      return {
        success: false,
        cooldownSeconds: remainingSeconds,
        error: `Mohon tunggu ${remainingSeconds} detik lagi sebelum meminta kode OTP baru.`,
      };
    }

    // Rate limit: maksimal 5 permintaan per window 15 menit
    const windowDuration = 15 * 60 * 1000;
    if (now - existingRecord.windowStartTime < windowDuration) {
      if (existingRecord.requestCountInWindow >= 5) {
        const resetInMinutes = Math.ceil(
          (windowDuration - (now - existingRecord.windowStartTime)) / 60000
        );
        return {
          success: false,
          error: `Terlalu banyak permintaan OTP. Silakan tunggu ${resetInMinutes} menit demi keamanan sistem.`,
        };
      }
      requestCount = existingRecord.requestCountInWindow + 1;
      windowStart = existingRecord.windowStartTime;
    } else {
      requestCount = 1;
      windowStart = now;
    }
  }

  // 3. Menghasilkan kode OTP 6 digit acak yang aman (100000 - 999999)
  const otpNumber = crypto.randomInt(100000, 1000000);
  const plainOtp = otpNumber.toString();

  // 4. Hashing OTP menggunakan random salt
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedOtp = hashOtp(plainOtp, salt);

  const expiresAt = now + OTP_EXPIRATION_MS;

  const newRecord: OtpRecord = {
    targetEmail: cleanEmail,
    recoveryEmail: RECOVERY_EMAIL,
    salt,
    hashedOtp,
    expiresAt,
    createdAt: now,
    lastRequestedAt: now,
    attemptsRemaining: MAX_ATTEMPTS,
    used: false,
    requestCountInWindow: requestCount,
    windowStartTime: windowStart,
  };

  await saveOtpRecord(cleanEmail, newRecord);

  return {
    success: true,
    otp: plainOtp,
    recoveryEmail: RECOVERY_EMAIL,
    expiresAt,
    cooldownSeconds: 60,
  };
}

/**
 * Memverifikasi dan menghabiskan kode OTP (Single-Use, Expiration, Attempt Limits)
 */
export async function verifyAndConsumeOtp(
  targetEmail: string,
  inputOtp: string
): Promise<{
  valid: boolean;
  attemptsRemaining?: number;
  error?: string;
}> {
  const cleanEmail = targetEmail.trim().toLowerCase();

  if (!isOfficialAdminAccount(cleanEmail)) {
    return {
      valid: false,
      error: "Akses ditolak. Email tidak sah.",
    };
  }

  const cleanInput = (inputOtp || "").trim();
  if (!/^\d{6}$/.test(cleanInput)) {
    return {
      valid: false,
      error: "Format kode OTP harus berupa 6 digit angka.",
    };
  }

  const record = await getStoredOtpRecord(cleanEmail);

  if (!record) {
    return {
      valid: false,
      error: "Tidak ada permintaan OTP aktif untuk akun ini. Silakan minta kode baru.",
    };
  }

  // 1. Cek apakah sudah pernah digunakan (Single-Use Protection)
  if (record.used) {
    return {
      valid: false,
      error: "Kode OTP ini sudah digunakan sebelumnya. Silakan ajukan kode baru.",
    };
  }

  const now = Date.now();

  // 2. Cek Kedaluwarsa (5 Menit)
  if (now > record.expiresAt) {
    return {
      valid: false,
      error: "Kode OTP telah kedaluwarsa (lebih dari 5 menit). Silakan minta kode OTP baru.",
    };
  }

  // 3. Cek Batas Percobaan Brute-Force
  if (record.attemptsRemaining <= 0) {
    return {
      valid: false,
      attemptsRemaining: 0,
      error: "Batas percobaan salah telah habis (maksimal 5 kali). Kode OTP dinonaktifkan demi keamanan. Silakan minta kode baru.",
    };
  }

  // 4. Verifikasi Hash secara aman (Timing Safe Equal)
  const candidateHash = hashOtp(cleanInput, record.salt);
  const candidateBuffer = Buffer.from(candidateHash);
  const targetBuffer = Buffer.from(record.hashedOtp);

  let isMatch = false;
  if (candidateBuffer.length === targetBuffer.length) {
    isMatch = crypto.timingSafeEqual(candidateBuffer, targetBuffer);
  }

  if (!isMatch) {
    // Kurangi jatah percobaan
    record.attemptsRemaining -= 1;
    await saveOtpRecord(cleanEmail, record);

    if (record.attemptsRemaining <= 0) {
      return {
        valid: false,
        attemptsRemaining: 0,
        error: "Kode OTP salah. Batas percobaan habis. Silakan minta kode baru.",
      };
    }

    return {
      valid: false,
      attemptsRemaining: record.attemptsRemaining,
      error: `Kode OTP salah. Sisa kesempatan: ${record.attemptsRemaining} kali lagi.`,
    };
  }

  // 5. Berhasil: Tandai OTP sebagai 'used' (Single-use)
  record.used = true;
  record.usedAt = now;
  await saveOtpRecord(cleanEmail, record);

  return {
    valid: true,
  };
}
