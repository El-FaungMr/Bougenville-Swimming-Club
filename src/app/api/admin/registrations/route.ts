import { NextRequest, NextResponse } from "next/server";
import {
  getAllRegistrations,
  updateRegistrationById,
  deleteRegistrationById,
} from "@/lib/server-db";
import { REGISTRATION_STATUSES } from "@/lib/constants";

// Helper verifikasi allowlist email admin
function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  const envAdmins = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : [];

  // Jika env belum diatur saat testing awal, kita izinkan development mode jika tidak ada env ADMIN_EMAILS
  if (envAdmins.length === 0) {
    return true;
  }

  return envAdmins.includes(cleanEmail);
}

// GET: Mengambil daftar semua registrasi atlet
export async function GET(request: NextRequest) {
  try {
    const adminEmail = request.headers.get("x-admin-email");

    // Verifikasi otorisasi allowlist
    if (process.env.ADMIN_EMAILS && !isAllowedAdminEmail(adminEmail)) {
      return NextResponse.json(
        { error: "Akses ditolak. Email tidak terdaftar dalam daftar pengelola resmi." },
        { status: 403 }
      );
    }

    const records = await getAllRegistrations();
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    console.error("GET /api/admin/registrations error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pendaftaran." },
      { status: 500 }
    );
  }
}

// PATCH: Memperbarui status, jadwal yang disepakati, atau catatan internal
export async function PATCH(request: NextRequest) {
  try {
    const adminEmail = request.headers.get("x-admin-email");

    if (process.env.ADMIN_EMAILS && !isAllowedAdminEmail(adminEmail)) {
      return NextResponse.json(
        { error: "Akses ditolak. Anda tidak memiliki izin untuk mengubah data." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, agreedSchedule, adminNotes } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID pendaftaran tidak valid." }, { status: 400 });
    }

    const updates: Record<string, any> = {};

    if (status) {
      if (!REGISTRATION_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Status pendaftaran tidak valid." }, { status: 400 });
      }
      updates.status = status;
    }

    if (typeof agreedSchedule === "string") {
      updates.agreedSchedule = agreedSchedule.trim();
    }

    if (typeof adminNotes === "string") {
      updates.adminNotes = adminNotes.trim();
    }

    const updated = await updateRegistrationById(id, updates);

    if (!updated) {
      return NextResponse.json(
        { error: "Data pendaftaran tidak ditemukan atau gagal diperbarui." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data pendaftaran berhasil diperbarui.",
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/registrations error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data pendaftaran." },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus pendaftaran
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = request.headers.get("x-admin-email");

    if (process.env.ADMIN_EMAILS && !isAllowedAdminEmail(adminEmail)) {
      return NextResponse.json(
        { error: "Akses ditolak. Anda tidak memiliki izin untuk menghapus data." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID pendaftaran wajib disertakan." }, { status: 400 });
    }

    const deleted = await deleteRegistrationById(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Pendaftaran tidak ditemukan atau gagal dihapus." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil dihapus secara permanen.",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/registrations error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pendaftaran." },
      { status: 500 }
    );
  }
}
