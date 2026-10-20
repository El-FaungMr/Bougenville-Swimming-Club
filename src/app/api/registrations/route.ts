import { NextRequest, NextResponse } from "next/server";
import { PROGRAMS } from "@/lib/constants";
import { RegistrationRecord } from "@/lib/types";
import { saveRegistration } from "@/lib/server-db";

function generateRegistrationId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BSC-${year}${month}${day}-${randomChars}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Honeypot check untuk mencegah bot spam
    if (body.website_hp && body.website_hp.trim() !== "") {
      return NextResponse.json(
        { error: "Permintaan tidak dapat diproses." },
        { status: 400 }
      );
    }

    const {
      fullName,
      birthDate,
      age,
      parentName,
      parentWhatsapp,
      program,
      swimmingLevel,
      preferredSchedule,
      notes,
      agreePrivacy,
    } = body;

    // 2. Validasi Input Server-Side
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama lengkap atlet wajib diisi minimal 2 karakter." },
        { status: 400 }
      );
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 3 || parsedAge > 80) {
      return NextResponse.json(
        { error: "Usia atlet harus valid (antara 3 hingga 80 tahun)." },
        { status: 400 }
      );
    }

    if (!parentName || typeof parentName !== "string" || parentName.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama orang tua / wali wajib diisi minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (!parentWhatsapp || typeof parentWhatsapp !== "string") {
      return NextResponse.json(
        { error: "Nomor WhatsApp orang tua / wali wajib diisi." },
        { status: 400 }
      );
    }

    const cleanPhone = parentWhatsapp.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 9 || cleanPhone.length > 16) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak valid. Masukkan nomor telepon yang aktif (minimal 9 digit)." },
        { status: 400 }
      );
    }

    const selectedProgram = PROGRAMS.find((p) => p.id === program);
    if (!selectedProgram) {
      return NextResponse.json(
        { error: "Program yang dipilih tidak valid." },
        { status: 400 }
      );
    }

    const validLevels = ["pemula", "menengah", "mahir"];
    if (!validLevels.includes(swimmingLevel)) {
      return NextResponse.json(
        { error: "Tingkat kemampuan berenang tidak valid." },
        { status: 400 }
      );
    }

    if (!preferredSchedule || typeof preferredSchedule !== "string" || preferredSchedule.trim().length < 3) {
      return NextResponse.json(
        { error: "Preferensi hari/jam latihan wajib diisi." },
        { status: 400 }
      );
    }

    if (agreePrivacy !== true) {
      return NextResponse.json(
        { error: "Persetujuan kebijakan privasi dan pemrosesan data atlet wajib dicentang." },
        { status: 400 }
      );
    }

    // 3. Susun Record Pendaftaran
    const registrationId = generateRegistrationId();
    const serverTimestamp = new Date().toISOString();

    const newRecord: RegistrationRecord = {
      id: registrationId,
      fullName: fullName.trim(),
      birthDate: birthDate ? birthDate.trim() : "",
      age: parsedAge,
      parentName: parentName.trim(),
      parentWhatsapp: cleanPhone,
      program: selectedProgram.id,
      programTitle: selectedProgram.title,
      priceDisplay: selectedProgram.priceDisplay,
      swimmingLevel: swimmingLevel as "pemula" | "menengah" | "mahir",
      preferredSchedule: preferredSchedule.trim(),
      notes: notes && typeof notes === "string" ? notes.trim() : "",
      agreePrivacy: true,
      status: "Baru",
      adminNotes: "",
      agreedSchedule: "",
      createdAt: serverTimestamp,
    };

    // 4. Simpan ke Database
    const saveResult = await saveRegistration(newRecord);

    if (!saveResult.success) {
      return NextResponse.json(
        {
          error:
            saveResult.error ||
            "Penyimpanan pendaftaran gagal. Silakan coba kembali atau hubungi admin langsung via WhatsApp.",
        },
        { status: 500 }
      );
    }

    // 5. Kembalikan Response Sukses
    return NextResponse.json({
      success: true,
      registrationId: newRecord.id,
      data: newRecord,
      storage: saveResult.storage,
      message: "Pendaftaran berhasil disimpan ke sistem.",
    });
  } catch (err: any) {
    console.error("API Error in POST /api/registrations:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat memproses pendaftaran." },
      { status: 500 }
    );
  }
}
