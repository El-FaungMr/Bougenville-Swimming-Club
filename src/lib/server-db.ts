import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { RegistrationRecord } from "./types";
import fs from "fs";
import path from "path";

let adminApp: App | undefined;

// Inisialisasi Firebase Admin SDK secara aman jika credentials tersedia
function getAdminDb() {
  if (adminApp) {
    return getAdminFirestore(adminApp);
  }

  // Opsi 1: Cek env FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
      return getAdminFirestore(adminApp);
    } catch (e) {
      console.error("Gagal mengurai FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
  }

  // Opsi 2: Default ADC (Google Application Default Credentials) jika di Firebase App Hosting / Cloud Run
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !getApps().length) {
    try {
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      return getAdminFirestore(adminApp);
    } catch (e) {
      // Tidak dapat menggunakan Admin SDK tanpa credentials
    }
  }

  return null;
}

// File fallback untuk lingkungan pengujian lokal offline sebelum user memasang Firebase credentials
const LOCAL_STORAGE_FILE = path.join(process.cwd(), ".local_registrations_dev.json");

function readLocalDevRegistrations(): RegistrationRecord[] {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Gagal membaca local storage dev:", err);
  }
  return [];
}

function writeLocalDevRegistrations(records: RegistrationRecord[]) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.error("Gagal menulis local storage dev:", err);
  }
}

/**
 * Menyimpan data pendaftaran baru ke Firestore atau storage dev
 */
export async function saveRegistration(record: RegistrationRecord): Promise<{ success: boolean; storage: "firestore" | "local_dev"; error?: string }> {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("registrations").doc(record.id).set(record);
      return { success: true, storage: "firestore" };
    }

    // Jika Admin SDK belum ada kredensial, simpan ke file dev storage aman di server
    const current = readLocalDevRegistrations();
    current.unshift(record);
    writeLocalDevRegistrations(current);
    return { success: true, storage: "local_dev" };
  } catch (error: any) {
    console.error("Error saving registration to database:", error);
    return { success: false, storage: "local_dev", error: error.message || "Gagal menyimpan ke database." };
  }
}

/**
 * Mengambil daftar pendaftaran (hanya untuk Admin API)
 */
export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb
        .collection("registrations")
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) => doc.data() as RegistrationRecord);
    }

    return readLocalDevRegistrations();
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return readLocalDevRegistrations();
  }
}

/**
 * Memperbarui status / catatan pendaftaran oleh admin
 */
export async function updateRegistrationById(
  id: string,
  updates: Partial<RegistrationRecord>
): Promise<boolean> {
  try {
    const adminDb = getAdminDb();
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (adminDb) {
      await adminDb.collection("registrations").doc(id).update(updatedData);
      return true;
    }

    const current = readLocalDevRegistrations();
    const index = current.findIndex((r) => r.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updatedData };
      writeLocalDevRegistrations(current);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating registration:", error);
    return false;
  }
}

/**
 * Menghapus pendaftaran oleh admin
 */
export async function deleteRegistrationById(id: string): Promise<boolean> {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("registrations").doc(id).delete();
      return true;
    }

    const current = readLocalDevRegistrations();
    const filtered = current.filter((r) => r.id !== id);
    writeLocalDevRegistrations(filtered);
    return true;
  } catch (error) {
    console.error("Error deleting registration:", error);
    return false;
  }
}
