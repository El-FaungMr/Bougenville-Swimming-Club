export const CLUB_INFO = {
  name: "Bougenville Swimming Club",
  shortName: "Bougenville SC",
  tagline: "Membina Karakter, Kebugaran & Prestasi Melalui Olahraga Renang",
  instagramUrl: "https://www.instagram.com/bougenville.sc/",
  instagramHandle: "@bougenville.sc",
  email: "bougenville.sc@gmail.com",
  whatsappNumber: "6285135630305",
  whatsappDisplay: "+62 851-3563-0305",
  whatsappUrl: "https://wa.me/6285135630305",
  schedulePolicy: "Jadwal fleksibel berdasarkan appointment atau kesepakatan langsung dengan admin.",
  serviceArea: "Karawang & Sekitarnya",
  trainingLocations: "Kolam renang mitra pilihan (Wonderland Galuh Mas dan titik kolam renang terdekat di Karawang sesuai kesepakatan appointment)",
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
  ticketPolicy: string;
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
    duration: "60 menit per sesi latihan",
    ratio: "Kelompok kecil terarah (maks. 3–5 anak)",
    ticketPolicy: "Jasa kepelatihan resmi (tiket masuk kolam renang menyesuaikan lokasi)",
    description: "Cocok untuk pengenalan dasar air, latihan rutin awal, serta penyesuaian teknik renang secara bertahap.",
    features: [
      "3 kali pertemuan latihan terstruktur",
      "Durasi efektif 60 menit per sesi pertemuan",
      "Kelompok kecil terarah agar perhatian pelatih tetap maksimal",
      "Fokus water safety, adaptasi air & pernapasan dasar",
      "Jadwal disepakati fleksibel via appointment admin",
      "Biaya paket jasa kepelatihan (HTM kolam mengikuti lokasi)",
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
    duration: "60 menit per sesi latihan",
    ratio: "Kelompok kecil terarah (maks. 3–5 anak)",
    ticketPolicy: "Jasa kepelatihan resmi (tiket masuk kolam renang menyesuaikan lokasi)",
    description: "Paket ideal untuk membangun konsistensi latihan bulanan, menyempurnakan kayuhan, dan meningkatkan stamina.",
    features: [
      "4 kali pertemuan latihan terjadwal intensif",
      "Durasi efektif 60 menit per sesi pertemuan",
      "Kelompok kecil terarah agar pantauan teknik selalu optimal",
      "Penyempurnaan kayuhan gaya dada/bebas & koordinasi gerak",
      "Evaluasi perkembangan renang anak secara berkala",
      "Biaya paket jasa kepelatihan (HTM kolam mengikuti lokasi)",
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
    duration: "60 menit intensif per sesi",
    ratio: "1 Atlet : 1 Pelatih Khusus",
    ticketPolicy: "Jasa kepelatihan privat (tiket masuk kolam renang menyesuaikan lokasi)",
    description: "Pendampingan intensif satu pelatih satu murid. Sangat efektif untuk fobia air, akselerasi teknik, maupun kebutuhan terapi khusus.",
    features: [
      "1 Pelatih eksklusif fokus penuh pada 1 murid",
      "Durasi 60 menit intensif personal per sesi pertemuan",
      "Pendekatan psikologis ramah anak (sangat ideal untuk trauma air)",
      "Estimasi harga Rp300.000–Rp350.000 dikonfirmasi admin sesuai usia & asesmen",
      "Penetapan waktu & hari latihan paling fleksibel",
      "Biaya paket jasa kepelatihan (HTM kolam mengikuti lokasi)",
    ],
  },
];

export const COACH_INFO = {
  name: "Fahd Maulana Malik Akbar",
  role: "Head Coach & Founder",
  education: "Pendidikan Jasmani Kesehatan dan Rekreasi (PJKR)",
  badge: "Pelatih Kepala & Pendiri",
  experienceSummary: "Mantan atlet renang kompetitif dengan dedikasi tinggi pada pedagogi renang ramah anak dan keselamatan air.",
  bio: "Berbekal latar belakang akademis sarjana Pendidikan Jasmani Kesehatan dan Rekreasi (PJKR) serta rekam jejak sebagai mantan atlet renang kompetitif, Coach Fahd mendedikasikan pengalamannya untuk menciptakan metode latihan renang yang humanis, menyenangkan, dan berstandar ilmiah. Spesialis dalam penanganan anak yang takut air (water phobia), penanaman insting water safety, hingga pembentukan teknik kayuhan biomekanis yang efisien.",
  credentials: [
    "Lulusan Sarjana Pendidikan Jasmani Kesehatan & Rekreasi (PJKR)",
    "Mantan Atlet Renang Kompetitif Berpengalaman",
    "Spesialis Water Safety & Adaptasi Trauma Air Ramah Anak",
    "Metodologi Pengajaran Terukur, Empatik, dan Tanpa Paksaan",
  ],
  image: "/images/coach-profile.jpg",
} as const;

export interface TestimonialItem {
  id: string;
  parentName: string;
  childInfo: string;
  progressBadge: string;
  programTaken: string;
  rating: number;
  quote: string;
  isFeatured?: boolean;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testi-linda",
    parentName: "Ibu Linda (Mamah Abhimana Zeno)",
    childInfo: "Program Balita & Anak Usia Dini",
    progressBadge: "Usia 2,5 - 3 Tahun • Berani Masuk Air & Happy",
    programTaken: "Private Kids (Usia Dini)",
    rating: 5,
    isFeatured: true,
    quote:
      "Terima kasih banyak ya Coach! Dari pertemuan pertama saat usia Zeno masih 2,5 tahun sampai sekarang menginjak 3 tahun, perkembangannya luar biasa signifikan dan jauh lebih percaya diri. Zeno sekarang sudah berani mencoba hal-hal baru di dalam air, tidak takut lagi memasukkan kepalanya ke dalam kolam, dan selalu happy setiap menjalani proses latihan bersama Coach. Untuk Bunda-Bunda yang masih ragu mengenalkan renang sejak dini, sangat direkomendasikan latihan di Bougenville Swimming Club karena pendekatannya benar-benar sabar dan bikin anak nyaman!",
  },
  {
    id: "testi-rina",
    parentName: "Ibu Rina Wulandari",
    childInfo: "Bunda dari Kenzo (6 tahun)",
    progressBadge: "Dari Takut Air jadi Berani Mandiri",
    programTaken: "Private (1-on-1)",
    rating: 5,
    quote:
      "Awalnya Kenzo menangis histeris kalau kena air kolam yang agak dalam. Berkat Coach yang luar biasa sabar dan tanpa paksaan di kelas Private, dalam 4 pertemuan sekarang Kenzo sudah berani mengapung mandiri dan selalu antusias tiap jadwal les renang.",
  },
  {
    id: "testi-hendra",
    parentName: "Bapak Hendra Pratama",
    childInfo: "Ayah dari Alika (9 tahun)",
    progressBadge: "Lulus Water Safety Level 1",
    programTaken: "Reguler 4 Pertemuan",
    rating: 5,
    quote:
      "Alika sebelumnya bisa berenang tapi cepat capek karena teknik pernapasan yang salah. Setelah ikut kelas Reguler Bougenville SC, kayuhan gaya dada dan gaya bebasnya jadi jauh lebih rapi, efisien, dan stamina fisiknya meningkat pesat.",
  },
  {
    id: "testi-citra",
    parentName: "Ibu Citra Lestari",
    childInfo: "Bunda dari Rafa (5 tahun)",
    progressBadge: "Pendekatan Ramah Anak & Sabar",
    programTaken: "Reguler & Private",
    rating: 5,
    quote:
      "Sangat terbantu dengan sistem jadwal appointment yang fleksibel untuk kami yang sibuk. Yang paling saya apresiasi, pelatih benar-benar menanamkan rasa aman di air sebelum mengejar gaya renang. Anak merasa nyaman dan selalu percaya diri.",
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Mulai usia berapa anak bisa ikut latihan renang di Bougenville SC?",
    answer:
      "Program renang kami terbuka untuk anak mulai usia balita / usia dini (sekitar 4 tahun), anak-anak sekolah, remaja, hingga dewasa. Kurikulum latihan disesuaikan secara bertahap mengikuti kesiapan motorik, psikologis, dan daya fokus masing-masing peserta didik.",
  },
  {
    id: "faq-2",
    question: "Bagaimana jika anak memiliki trauma atau sangat takut dengan air?",
    answer:
      "Kami menerapkan pendekatan ramah anak tanpa paksaan. Di tahap awal, fokus latihan bukanlah langsung berenang melainkan adaptasi rasa aman di air (water safety dan permainan menyenangkan). Untuk anak dengan tingkat ketakutan tinggi, kami sangat menyarankan kelas Private 1-on-1 agar pelatih dapat memberikan perhatian penuh 100%.",
  },
  {
    id: "faq-3",
    question: "Di mana lokasi kolam renang yang digunakan untuk latihan?",
    answer:
      "Layanan latihan kami mencakup area Karawang dan sekitarnya. Sesi latihan diselenggarakan di titik kolam renang mitra yang representatif dan bersih (seperti Wonderland Galuh Mas atau kolam renang terdekat di area Karawang) sesuai dengan kesepakatan appointment bersama admin klub.",
  },
  {
    id: "faq-4",
    question: "Apakah biaya paket latihan sudah termasuk tiket masuk kolam renang?",
    answer:
      "Biaya paket yang tertera merupakan biaya jasa kepelatihan resmi profesional dari Bougenville Swimming Club. Tiket masuk kolam renang (HTM) untuk murid dan pendamping dibayarkan langsung di loket kolam sesuai dengan tarif reguler lokasi kolam yang disepakati.",
  },
  {
    id: "faq-5",
    question: "Bagaimana jika anak berhalangan sakit atau cuaca hujan deras saat jadwal latihan?",
    answer:
      "Kami mengutamakan kesehatan dan keselamatan atlet. Jika anak berhalangan karena sakit atau kondisi cuaca ekstrem (seperti hujan lebat disertai petir), jadwal latihan dapat dijadwalkan ulang (reschedule) dengan melakukan konfirmasi terlebih dahulu kepada admin minimal 2-3 jam sebelum sesi latihan dimulai.",
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
