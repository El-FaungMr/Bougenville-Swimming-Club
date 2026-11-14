import { doc, setDoc } from "firebase/firestore";
import { getClientDb } from "./firebase";
import { getAdminFirestore } from "./firebase-admin";
import { RegistrationRecord } from "./types";

function getAdminDb() {
  return getAdminFirestore();
}

/**
 * Menyimpan data pendaftaran baru ke Cloud Firestore.
 * Menggunakan Firebase Admin SDK (jika Service Account ada) atau Firebase Client SDK di server.
 * Tanpa menggunakan filesystem lokal sementara.
 */
export async function saveRegistration(
  record: RegistrationRecord
): Promise<{ success: boolean; storage: "firestore"; error?: string }> {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("registrations").doc(record.id).set(record);
      return { success: true, storage: "firestore" };
    }

    // Jika tanpa Admin SDK Service Account, gunakan Client SDK Firestore dengan kredensial project
    const clientDb = getClientDb();
    if (!clientDb) {
      throw new Error(
        "Koneksi Firebase belum terkonfigurasi. Pastikan NEXT_PUBLIC_FIREBASE_API_KEY dan NEXT_PUBLIC_FIREBASE_PROJECT_ID sudah diatur di Environment Variables."
      );
    }

    await setDoc(doc(clientDb, "registrations", record.id), record);
    return { success: true, storage: "firestore" };
  } catch (error: any) {
    console.error("Error saving registration to Cloud Firestore:", error);
    return {
      success: false,
      storage: "firestore",
      error: error.message || "Gagal menyimpan pendaftaran ke Cloud Firestore.",
    };
  }
}

/**
 * Mengambil daftar pendaftaran (hanya untuk Admin API jika Service Account tersedia)
 */
export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb
        .collection("registrations")
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((d) => d.data() as RegistrationRecord);
    }

    return [];
  } catch (error) {
    console.error("Error fetching registrations in Admin API:", error);
    return [];
  }
}

/**
 * Memperbarui status / catatan pendaftaran oleh admin melalui backend
 */
export async function updateRegistrationById(
  id: string,
  updates: Partial<RegistrationRecord>
): Promise<boolean> {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await adminDb.collection("registrations").doc(id).update(updatedData);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating registration in Admin API:", error);
    return false;
  }
}

/**
 * Menghapus pendaftaran oleh admin melalui backend
 */
export async function deleteRegistrationById(id: string): Promise<boolean> {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("registrations").doc(id).delete();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting registration in Admin API:", error);
    return false;
  }
}
