# 🏊‍♂️ Website Resmi Bougenville Swimming Club

Website resmi *production-ready* untuk **Bougenville Swimming Club**, klub renang profesional yang berfokus pada pembinaan teknik renang, kenyamanan adaptasi air, dan keselamatan (*water safety*).

Aplikasi ini dibangun menggunakan **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Firebase Authentication**, dan **Cloud Firestore**.

---

## 🌟 Fitur Utama

### 1. Halaman Publik
- **Beranda (`/`)**: Hero section modern, pengenalan keunggulan klub, ringkasan program & biaya resmi, alur pendaftaran 3 langkah, dan CTA pendaftaran.
- **Tentang Kami (`/tentang`)**: Profil klub, tujuan latihan (keselamatan air, penguasaan teknik dasar, kebugaran, dan mental juara), serta nilai-nilai klub tanpa klaim fiktif.
- **Program & Harga (`/program`)**:
  - **Reguler 3 Pertemuan**: Rp160.000 / paket.
  - **Reguler 4 Pertemuan**: Rp200.000 / paket.
  - **Private (1-on-1)**: Rp300.000 – Rp350.000 (harga final dikonfirmasi langsung oleh admin berdasarkan usia dan tingkat kemampuan atlet).
  - **Jadwal Sesi**: Berdasarkan appointment / kesepakatan langsung dengan admin.
- **Formulir Pendaftaran Atlet (`/daftar`)**:
  - Didesain khusus agar nyaman diakses dari ponsel (HP).
  - Validasi ketat nama atlet, usia (3–80 tahun), kontak WhatsApp orang tua, preferensi hari/jam latihan.
  - Ringkasan biaya transparan sebelum pengiriman formulir.
  - Persetujuan wajib Kebijakan Privasi & Pemrosesan Data Anak oleh orang tua/wali.
- **Alur WhatsApp Otomatis**:
  - Setelah data pendaftaran tersimpan secara aman di database, pengguna diarahkan ke WhatsApp resmi admin ([+62 851-3563-0305](https://wa.me/6285135630305)) dengan pesan yang terformat rapi dan ter-URL-encode tanpa membuka data rahasia.
- **Kontak Resmi (`/kontak`)**: Integrasi langsung ke WhatsApp, Instagram (@bougenville.sc), dan Email (bougenville.sc@gmail.co).
- **Kebijakan Privasi (`/kebijakan-privasi`)**: Perlindungan ketat data anak di bawah umur, tidak ada data pendaftar yang dibuka ke publik, dan hak penghapusan data permanen (*right to deletion*).

### 2. Dashboard Pengelola / Admin (`/admin`)
- **Login Khusus Pengelola (`/admin/login`)**: Menggunakan Firebase Authentication (Email & Password).
- **Verifikasi Allowlist Admin**: Hanya 2 email pengelola yang terdaftar dalam allowlist yang dapat mengakses data.
- **Statistik Ringkasan Pendaftaran**: Menampilkan total pendaftar, status Baru, Dihubungi, Terjadwal, Selesai, dan Dibatalkan.
- **Pencarian & Filter Cepat**: Cari nama atlet, nama orang tua, atau ID registrasi unik, serta filter berdasarkan program dan status.
- **Kelola Jadwal & Catatan Internal**:
  - Admin dapat mengubah status pendaftaran.
  - Mencatat hari & jam latihan yang disepakati (*Appointment*).
  - Menulis catatan internal pengelola (bersifat rahasia, tidak pernah dilihat publik).
- **Hubungi Orang Tua Sekali Klik**: Tombol langsung membuka WhatsApp orang tua dengan format sapaan sopan dari admin Bougenville SC.
- **Hapus Pendaftaran Aman**: Dilengkapi modal konfirmasi untuk mencegah data terhapus secara tidak sengaja.

---

## 📁 Struktur Folder Proyek

```text
├── legacy_backup/             # Backup file HTML/CSS/JS lama
├── public/                    # Aset statis & logo
│   └── logo.jpeg              # Logo resmi Bougenville Swimming Club (crest badge)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/registrations/route.ts  # API kelola pendaftar (GET, PATCH, DELETE)
│   │   │   └── registrations/route.ts        # API pendaftaran publik aman (POST)
│   │   ├── admin/
│   │   │   ├── login/page.tsx # Halaman login pengelola
│   │   │   └── page.tsx       # Dashboard admin pengelola
│   │   ├── daftar/page.tsx    # Halaman formulir pendaftaran
│   │   ├── kebijakan-privasi/ # Halaman kebijakan privasi & perlindungan anak
│   │   ├── kontak/page.tsx    # Halaman kontak resmi
│   │   ├── program/page.tsx   # Halaman rincian program & biaya
│   │   ├── tentang/page.tsx   # Halaman profil & nilai klub
│   │   ├── globals.css        # Styling global & Tailwind CSS
│   │   ├── layout.tsx         # Root layout, font, SEO metadata, Navbar & Footer
│   │   └── page.tsx           # Beranda utama (Home)
│   ├── components/
│   │   ├── Footer.tsx         # Komponen footer lengkap
│   │   ├── Logo.tsx           # Komponen logo responsif
│   │   ├── Navbar.tsx         # Komponen navigasi sticky & mobile drawer
│   │   └── RegistrationForm.tsx # Formulir interaktif & generator WhatsApp
│   └── lib/
│       ├── constants.ts       # Informasi resmi klub, daftar program & harga
│       ├── firebase.ts        # Inisialisasi Firebase Client
│       ├── server-db.ts       # Manajemen database server-side & dev storage
│       ├── types.ts           # Definisi interface TypeScript
│       └── whatsapp.ts        # Helper pembentuk link WhatsApp
├── .env.example               # Contoh konfigurasi environment variables
├── .env.local                 # File konfigurasi environment lokal
├── .firebaserc                # Konfigurasi project ID Firebase
├── firebase.json              # Konfigurasi hosting & Firestore rules
├── firestore.rules            # Aturan keamanan Cloud Firestore (default-deny)
├── package.json               # Dependensi & skrip aplikasi
├── tailwind.config.ts         # Konfigurasi tema warna ocean blue & typography
└── tsconfig.json              # Konfigurasi TypeScript
```

---

## 🚀 Panduan Menjalankan Website Secara Lokal

### Prasyarat
1. Pastikan Anda telah menginstal **Node.js** (versi 18 ke atas disarankan).
2. Periksa versi Node.js dengan perintah:
   ```bash
   node -v
   ```

### Langkah Menjalankan
1. **Buka Terminal / Command Prompt** di direktori proyek ini (`Website`).
2. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```
   *(Pada sistem Windows PowerShell jika skrip dibatasi, gunakan: `cmd.exe /c "npm.cmd run dev"`)*
3. Buka browser Anda dan akses:
   ```text
   http://localhost:3000
   ```
4. Website sudah aktif dan dapat langsung Anda coba!

---

## 🔒 Panduan Setup Firebase (Authentication & Cloud Firestore)

### 1. Membuat Project di Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/) dan login dengan akun Google Anda.
2. Klik **Add project** (Tambah project).
3. Beri nama project, misalnya: `bougenville-swimming-club`.
4. Anda dapat menonaktifkan Google Analytics jika tidak diperlukan, lalu klik **Create project**.

### 2. Mengaktifkan Firebase Authentication
1. Di menu sidebar kiri Firebase Console, klik **Build** > **Authentication**.
2. Klik tombol **Get started**.
3. Di tab **Sign-in method**, pilih **Email/Password**.
4. Aktifkan sakelar pertama (**Email/Password**), biarkan sakelar Email link nonaktif, lalu klik **Save**.

### 3. Membuat 2 Akun Admin dengan Aman
1. Masih di menu **Authentication**, klik tab **Users** di bagian atas.
2. Klik tombol **Add user** (Tambah pengguna).
3. Masukkan email pengelola pertama (misalnya: `admin1@bougenville.sc`) dan kata sandi yang kuat.
4. Klik **Add user** sekali lagi untuk pengelola kedua (misalnya: `admin2@bougenville.sc`) beserta kata sandinya.
> **Penting**: Jangan bagikan kata sandi ini kepada pihak mana pun dan jangan menuliskan kata sandi di dalam source code website.

### 4. Mengaktifkan Cloud Firestore Database
1. Di sidebar kiri, klik **Build** > **Firestore Database**.
2. Klik **Create database**.
3. Pilih lokasi server yang paling dekat dengan Indonesia (disarankan: `asia-southeast2` Jakarta atau `asia-southeast1` Singapura).
4. Pilih **Start in production mode** (dimulai dalam mode aman default-deny).
5. Klik **Create**.

### 5. Memasang Aturan Keamanan (Firestore Security Rules)
File `firestore.rules` sudah kami siapkan di dalam proyek dengan standar keamanan tertinggi:
- **Publik DILARANG membaca data**: Melindungi privasi anak dan kontak orang tua dari pencurian data.
- **Publik hanya dapat membuat (create)** data pendaftaran dengan validasi ketat dan status awal wajib `Baru`.
- **Hanya 2 pengelola** yang dapat membaca, mengubah status/jadwal, atau menghapus pendaftaran.

Cara memasang aturan ke Firebase:
1. Buka Firebase Console > **Firestore Database** > tab **Rules**.
2. Salin seluruh isi file `firestore.rules` dari folder proyek Anda.
3. Tempelkan ke editor di Firebase Console, lalu klik **Publish**.

### 6. Menghubungkan Kredensial ke File `.env.local`
1. Di Firebase Console, klik ikon Gerigi (⚙️) di samping *Project Overview* > pilih **Project settings**.
2. Gulir ke bawah ke bagian **Your apps**, klik ikon Web (`</>`).
3. Beri nama aplikasi (misalnya: `Bougenville SC Web`), lalu klik **Register app**.
4. Salin objek `firebaseConfig` yang muncul, lalu buka file `.env.local` di proyek Anda dan sesuaikan:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="bougenville-sc.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="bougenville-sc"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="bougenville-sc.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"

   # Masukkan 2 email admin yang baru saja Anda buat di Firebase Authentication:
   ADMIN_EMAILS="admin1@bougenville.sc,admin2@bougenville.sc"
   ```
5. Simpan file `.env.local`.

---

## 🧪 Cara Melakukan Testing

1. **Uji Formulir Pendaftaran**:
   - Buka `http://localhost:3000/daftar`.
   - Coba kosongkan salah satu field wajib untuk melihat pesan validasi.
   - Isi data lengkap calon atlet dan klik **Kirim Pendaftaran & Lanjut ke WhatsApp**.
   - Pastikan nomor ID registrasi (`BSC-...`) muncul dan tombol WhatsApp mengarahkan ke pesan yang terisi rapi.
2. **Uji Login & Dashboard Admin**:
   - Buka `http://localhost:3000/admin/login`.
   - Masukkan email dan password salah satu dari 2 akun admin.
   - Di dashboard `/admin`, pastikan data atlet yang baru didaftarkan muncul.
   - Uji fitur:
     - Cari nama atlet pada kolom pencarian.
     - Ubah status pendaftaran (misal: dari "Baru" menjadi "Dihubungi" atau "Terjadwal").
     - Isi "Jadwal yang Disepakati" dan "Catatan Internal", lalu klik **Simpan Perubahan**.
     - Klik tombol **Chat WA** untuk memastikan tautan WhatsApp ke nomor orang tua/wali terbuka dengan sapaan sopan.

---

## 🌐 Cara Deploy ke Hosting Publik (Firebase Hosting / Vercel)

### Opsi A: Menggunakan Vercel (Paling Mudah & Disarankan untuk Next.js)
1. Unggah folder proyek Anda ke repositori GitHub pribadi Anda.
2. Buka [Vercel.com](https://vercel.com/) dan hubungkan akun GitHub Anda.
3. Pilih repositori website ini.
4. Di bagian **Environment Variables**, tambahkan seluruh variabel yang ada di `.env.local` Anda.
5. Klik **Deploy**. Website Anda akan online dengan domain HTTPS gratis dalam hitungan menit!

### Opsi B: Menggunakan Firebase Hosting / App Hosting
1. Pasang Firebase CLI di komputer Anda:
   ```bash
   npm install -g firebase-tools
   ```
2. Login ke Firebase:
   ```bash
   firebase login
   ```
3. Hubungkan project:
   ```bash
   firebase use --add
   ```
   (Pilih project Firebase yang sudah Anda buat).
4. Lakukan build dan deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

## 🔄 Cara Memperbarui Website Setelah Online

Jika di kemudian hari ada pembaruan biaya program atau kontak:
1. Edit file `src/lib/constants.ts` untuk memperbarui harga atau nomor kontak klub.
2. Logo resmi klub berada di file `public/logo.jpeg`. Jika logo resmi diperbarui, cukup timpa file tersebut.
3. Jalankan `npm run build` untuk memverifikasi tidak ada kesalahan kode.
4. Lakukan deploy ulang (`git push` ke GitHub jika menggunakan Vercel, atau `firebase deploy` jika menggunakan Firebase).

---

## 🛠️ Mengatasi Kendala Umum (Troubleshooting)

1. **Error: "File npm.ps1 cannot be loaded because running scripts is disabled"**:
   - Ini adalah proteksi PowerShell bawaan Windows.
   - Solusi: Jalankan perintah menggunakan prefix `cmd.exe /c "npm.cmd <perintah>"` atau gunakan Command Prompt (CMD).
2. **Login Admin Ditolak: "Email atau kata sandi pengelola salah"**:
   - Pastikan Anda sudah membuat akun email & kata sandi tersebut di Firebase Console > Authentication > Users.
   - Pastikan email tersebut sama persis dengan yang Anda tulis di variabel `ADMIN_EMAILS` pada file `.env.local`.
3. **Pendaftaran Gagal Disimpan**:
   - Periksa koneksi internet Anda.
   - Pastikan `firestore.rules` sudah dipublish di Firebase Console dan project Firebase Anda tidak dalam status suspended.

---

## 📞 Informasi Kontak Klub
- **Nama Klub**: Bougenville Swimming Club
- **WhatsApp**: [+62 851-3563-0305](https://wa.me/6285135630305)
- **Instagram**: [@bougenville.sc](https://www.instagram.com/bougenville.sc/)
- **Email**: bougenville.sc@gmail.co
