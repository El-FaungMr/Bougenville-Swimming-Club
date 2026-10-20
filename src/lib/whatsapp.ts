import { CLUB_INFO, PROGRAMS, SWIMMING_LEVELS } from "./constants";
import { RegistrationRecord } from "./types";

/**
 * Membentuk URL WhatsApp untuk calon pendaftar agar langsung mengirim rincian pendaftaran
 * ke nomor admin Bougenville Swimming Club.
 */
export function buildRegistrationWhatsAppUrl(record: {
  id: string;
  fullName: string;
  age: number;
  parentName: string;
  programTitle: string;
  priceDisplay: string;
  swimmingLevel: string;
  preferredSchedule: string;
  notes?: string;
}): string {
  const levelObj = SWIMMING_LEVELS.find((l) => l.id === record.swimmingLevel);
  const levelText = levelObj ? levelObj.label : record.swimmingLevel;

  const lines = [
    `*PENDAFTARAN ATLET BARU - ${CLUB_INFO.name.toUpperCase()}*`,
    `Halo Admin, saya telah mengisi formulir pendaftaran di website resmi. Berikut adalah ringkasan data pendaftaran:`,
    ``,
    `*No. Registrasi:* ${record.id}`,
    `*Nama Atlet:* ${record.fullName}`,
    `*Usia:* ${record.age} Tahun`,
    `*Nama Orang Tua / Wali:* ${record.parentName}`,
    `*Pilihan Program:* ${record.programTitle}`,
    `*Estimasi Biaya:* ${record.priceDisplay}`,
    `*Tingkat Kemampuan:* ${levelText}`,
    `*Preferensi Jadwal:* ${record.preferredSchedule}`,
  ];

  if (record.notes && record.notes.trim()) {
    lines.push(`*Catatan Tambahan:* ${record.notes.trim()}`);
  }

  lines.push(``);
  lines.push(`Mohon informasi konfirmasi jadwal latihan dan arahan pembayaran. Terima kasih!`);

  const messageText = lines.join("\n");
  const encoded = encodeURIComponent(messageText);

  return `${CLUB_INFO.whatsappUrl}?text=${encoded}`;
}

/**
 * Membentuk URL WhatsApp untuk admin menghubungi orang tua/wali atlet.
 */
export function buildAdminContactParentWhatsAppUrl(record: RegistrationRecord): string {
  // Format nomor HP orang tua/wali: hilangkan awalan 0, spasi, tanda minus, ganti dengan 62
  let cleanPhone = record.parentWhatsapp.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith("62")) {
    cleanPhone = "62" + cleanPhone;
  }

  const message = [
    `Halo Bapak/Ibu *${record.parentName}*, salam kenal dari *Admin ${CLUB_INFO.name}*.`,
    ``,
    `Kami telah menerima formulir pendaftaran untuk atlet:`,
    `• Nama Atlet: *${record.fullName}* (${record.age} thn)`,
    `• Program: *${record.programTitle}*`,
    `• Status: *${record.status}*`,
    ``,
    record.agreedSchedule
      ? `Jadwal latihan yang disepakati: *${record.agreedSchedule}*`
      : `Kami ingin mendiskusikan dan mengonfirmasi jadwal latihan ananda yang paling nyaman.`,
    ``,
    `Apakah ada yang ingin ditanyakan mengenai persiapan latihan renang?`,
  ].join("\n");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
