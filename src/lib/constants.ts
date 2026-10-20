export const CLUB_INFO = {
  name: "Bougenville Swimming Club",
  shortName: "Bougenville SC",
  tagline: "Membina Karakter, Kebugaran & Prestasi Melalui Olahraga Renang",
  instagramUrl: "https://www.instagram.com/bougenville.sc/",
  instagramHandle: "@bougenville.sc",
  email: "bougenville.sc@gmail.co",
  whatsappNumber: "6285135630305",
  whatsappDisplay: "+62 851-3563-0305",
  whatsappUrl: "https://wa.me/6285135630305",
  schedulePolicy: "Jadwal fleksibel berdasarkan appointment atau kesepakatan langsung dengan admin.",
} as const;

export interface ProgramItem {
  id: "reguler-3" | "reguler-4" | "private";
  title: string;
  badge?: string;
  priceDisplay: string;
  priceNote: string;
  isCustomPrice: boolean;
  minPrice?: number;
  maxPrice?: number;
  exactPrice?: number;
  sessions: string;
  duration: string;
  ratio: string;
  description: string;
  features: string[];
}

export const PROGRAMS: ProgramItem[] = [
  {
    id: "reguler-3",
    title: "Reguler 3 Pertemuan",
    priceDisplay: "Rp160.000",
    priceNote: "per paket (3x sesi)",
    isCustomPrice: false,
    exactPrice: 160000,
    sessions: "3 Pertemuan",
    duration: "60 menit / sesi",
    ratio: "Grup kecil terarah",
    description: "Cocok untuk pengenalan dasar air, latihan rutin awal, serta penyesuaian teknik renang secara bertahap.",
    features: [
      "3 kali pertemuan latihan",
      "Pendampingan teknik dasar & pernapasan",
      "Fokus water safety & adaptasi air",
      "Jadwal disepakati via appointment admin",
    ],
  },
  {
    id: "reguler-4",
    title: "Reguler 4 Pertemuan",
    badge: "Paling Populer",
    priceDisplay: "Rp200.000",
    priceNote: "per paket (4x sesi)",
    isCustomPrice: false,
    exactPrice: 200000,
    sessions: "4 Pertemuan",
    duration: "60-75 menit / sesi",
    ratio: "Grup kecil terarah",
    description: "Paket ideal untuk membangun konsistensi latihan bulanan, menyempurnakan kayuhan, dan meningkatkan stamina.",
    features: [
      "4 kali pertemuan latihan terjadwal",
      "Penyempurnaan kayuhan dan koordinasi gerak",
      "Evaluasi perkembangan renang bertahap",
      "Jadwal disepakati via appointment admin",
    ],
  },
  {
    id: "private",
    title: "Private (1-on-1)",
    badge: "Eksklusif & Cepat Bisa",
    priceDisplay: "Rp300.000 – Rp350.000",
    priceNote: "harga final dikonfirmasi admin berdasarkan usia & kemampuan",
    isCustomPrice: true,
    minPrice: 300000,
    maxPrice: 350000,
    sessions: "Sesuai Appointment",
    duration: "60 menit / sesi",
    ratio: "1 Atlet : 1 Pelatih Khusus",
    description: "Pendampingan intensif satu pelatih satu murid. Sangat efektif untuk fobia air, akselerasi teknik, maupun kebutuhan terapi khusus.",
    features: [
      "1 Pelatih eksklusif fokus pada 1 atlet",
      "Pendekatan personal sesuai ritme belajar atlet",
      "Harga final (Rp300.000–Rp350.000) ditentukan oleh admin berdasarkan usia dan tingkat kemampuan",
      "Penetapan jadwal paling fleksibel bersama admin",
    ],
  },
];

export const SWIMMING_LEVELS = [
  {
    id: "pemula",
    label: "Pemula (Belum bisa / masih takut air)",
    description: "Fokus pada adaptasi air, pernapasan, dan mengapung mandiri.",
  },
  {
    id: "menengah",
    label: "Menengah (Bisa meluncur & menguasai 1-2 gaya dasar)",
    description: "Fokus pada kelancaran gaya dada/bebas dan ketahanan berenang.",
  },
  {
    id: "mahir",
    label: "Mahir (Menguasai beragam gaya / persiapan pembinaan)",
    description: "Fokus pada penyempurnaan teknik 4 gaya dan kecepatan kayuhan.",
  },
] as const;

export const REGISTRATION_STATUSES = [
  "Baru",
  "Dihubungi",
  "Terjadwal",
  "Selesai",
  "Dibatalkan",
] as const;
