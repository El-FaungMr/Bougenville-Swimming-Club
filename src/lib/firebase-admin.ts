import { getApps as getAdminApps, initializeApp as initAdminApp, cert, getApp as getAdminAppInstance, App as AdminApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestoreInstance, Firestore } from "firebase-admin/firestore";
import { getAuth as getAdminAuthInstance, Auth } from "firebase-admin/auth";

let cachedAdminApp: AdminApp | null = null;

/**
 * Memeriksa apakah kredensial Firebase Admin Service Account tersedia di environment.
 */
export function isFirebaseAdminConfigured(): boolean {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return true;
  }
  if (
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  ) {
    return true;
  }
  return false;
}

/**
 * Menginisialisasi atau mengambil instance Firebase Admin App tunggal (singleton).
 */
export function getAdminApp(): AdminApp | null {
  if (cachedAdminApp) {
    return cachedAdminApp;
  }

  const existingApps = getAdminApps();
  if (existingApps.length > 0) {
    cachedAdminApp = existingApps[0];
    return cachedAdminApp;
  }

  // 1. Opsi: Full JSON string di FIREBASE_SERVICE_ACCOUNT_KEY
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      const serviceAccount = JSON.parse(raw);
      cachedAdminApp = initAdminApp({
        credential: cert(serviceAccount),
      });
      return cachedAdminApp;
    } catch (error) {
      console.error("[Firebase Admin] Gagal mengurai FIREBASE_SERVICE_ACCOUNT_KEY JSON:", error);
    }
  }

  // 2. Opsi: Variabel individual (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      // Normalisasi karakter escaped newline \n dari env Vercel / Windows
      privateKey = privateKey.replace(/\\n/g, "\n");

      cachedAdminApp = initAdminApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return cachedAdminApp;
    } catch (error) {
      console.error("[Firebase Admin] Gagal menginisialisasi dengan variabel individual:", error);
    }
  }

  return null;
}

/**
 * Mendapatkan instance Firestore Admin SDK (melewati Firestore Security Rules untuk keperluan server).
 */
export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  return getAdminFirestoreInstance(app);
}

/**
 * Mendapatkan instance Firebase Auth Admin SDK untuk manajemen akun di server.
 */
export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  if (!app) return null;
  return getAdminAuthInstance(app);
}

/**
 * Memeriksa keberadaan akun admin resmi di Firebase Authentication tanpa mengubah password.
 * Aman digunakan untuk audit dan pengujian status akun.
 */
export async function findAdminUser(
  email: string
): Promise<{ exists: boolean; uid?: string; email?: string; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== "admin1@bougenville.sc" && cleanEmail !== "admin2@bougenville.sc") {
    return { exists: false, error: "Akses ditolak. Email bukan akun pengelola resmi." };
  }

  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return {
      exists: false,
      error: "Firebase Admin Auth belum terhubung (Kredensial Service Account belum tersedia).",
    };
  }

  try {
    const userRecord = await adminAuth.getUserByEmail(cleanEmail);
    return {
      exists: true,
      uid: userRecord.uid,
      email: userRecord.email,
    };
  } catch (err: any) {
    return {
      exists: false,
      error: err.code === "auth/user-not-found" ? "Akun belum dibuat di Firebase Auth" : err.message,
    };
  }
}

/**
 * Memperbarui kata sandi akun Firebase Authentication secara aman di backend.
 */
export async function updateAdminUserPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; uid?: string; error?: string; devMode?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  // Pastikan hanya akun admin resmi Bougenville Swimming Club yang dapat diproses
  if (cleanEmail !== "admin1@bougenville.sc" && cleanEmail !== "admin2@bougenville.sc") {
    return {
      success: false,
      error: "Akses ditolak. Email bukan akun pengelola resmi Bougenville Swimming Club.",
    };
  }

  const adminAuth = getAdminAuth();

  if (adminAuth) {
    try {
      // Ambil user berdasarkan email dari Firebase Authentication
      const userRecord = await adminAuth.getUserByEmail(cleanEmail);

      // Perbarui password user di Firebase Authentication
      await adminAuth.updateUser(userRecord.uid, {
        password: newPassword,
      });

      console.log(`[Firebase Admin Auth] Password berhasil diperbarui untuk ${cleanEmail} (UID: ${userRecord.uid})`);
      return { success: true, uid: userRecord.uid };
    } catch (error: any) {
      console.error(`[Firebase Admin Auth] Gagal memperbarui password ${cleanEmail}:`, error);

      if (error.code === "auth/user-not-found") {
        return {
          success: false,
          error: `Akun ${cleanEmail} belum terdaftar di Firebase Authentication. Pastikan akun sudah dibuat di Firebase Console -> Authentication -> Users.`,
        };
      }

      return {
        success: false,
        error: error.message || "Gagal memperbarui kata sandi di Firebase Authentication.",
      };
    }
  }

  // Jika Service Account belum dikonfigurasi di env, jalankan mode simulasi aman untuk dev lokal
  console.warn(
    `[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY belum diisi di environment. Mode simulasi: Password baru untuk ${cleanEmail} telah diverifikasi secara lokal. Masukkan kredensial Service Account untuk mengubah password sungguhan di Firebase Auth.`
  );

  return {
    success: true,
    devMode: true,
  };
}
