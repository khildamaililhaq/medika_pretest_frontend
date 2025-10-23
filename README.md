# Product Management System

Sistem Manajemen Produk yang komprehensif dibangun dengan Next.js 15, Material UI, dan JavaScript. Aplikasi ini menyediakan operasi CRUD lengkap untuk mengelola produk dan kategori dengan antarmuka modern dan responsif.

## 🚀 Fitur Utama

- **Autentikasi Pengguna**: Sistem login dan registrasi dengan JWT
- **Manajemen Produk**: Tambah, edit, hapus, dan publish/unpublish produk
- **Manajemen Kategori**: Kelola kategori produk dengan fitur pencarian
- **Pencarian Real-time**: Pencarian produk dan kategori langsung dari API
- **Antarmuka Responsif**: Desain yang bekerja di desktop dan mobile
- **Navigasi Sidebar**: Navigasi yang mudah dengan sidebar yang dapat diciutkan

## 📋 Prasyarat

- Node.js 18+
- npm, yarn, atau pnpm

## 🛠️ Instalasi

1. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` dan update URL API sesuai dengan backend Anda:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://medika_pretest.localhost
   ```

3. **Jalankan server development**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

4. **Buka browser**
   Navigasi ke [http://localhost:3000](http://localhost:3000)

## 📖 Penggunaan

### Autentikasi
1. **Registrasi**: Buat akun baru di halaman `/auth/register`
2. **Login**: Masuk dengan kredensial Anda di halaman `/auth/login`
3. Sistem akan otomatis mengarahkan ke halaman login jika token kadaluarsa

### Manajemen Produk
- **Lihat Produk**: Halaman utama menampilkan daftar semua produk
- **Tambah Produk**: Klik tombol "Add Product" untuk membuat produk baru
- **Edit Produk**: Klik tombol "Edit" pada produk yang ingin diubah
- **Publish/Unpublish**: Gunakan tombol "Publish" atau "Unpublish" untuk mengubah status produk
- **Hapus Produk**: Klik tombol "Delete" untuk menghapus produk

### Manajemen Kategori
- **Lihat Kategori**: Akses halaman Categories untuk melihat semua kategori
- **Tambah Kategori**: Klik tombol "Add Category" untuk membuat kategori baru
- **Edit Kategori**: Klik tombol "Edit" pada kategori yang ingin diubah
- **Hapus Kategori**: Klik tombol "Delete" untuk menghapus kategori

### Pencarian
- **Produk**: Gunakan kotak pencarian untuk mencari produk berdasarkan nama
- **Kategori**: Gunakan kotak pencarian untuk mencari kategori berdasarkan nama
- **Filter**: Filter produk berdasarkan status publish/unpublish

## 🏗️ Struktur Proyek

```
├── app/
│   ├── api/                 # API routes Next.js
│   ├── auth/                # Halaman autentikasi
│   │   ├── login/          # Halaman login
│   │   └── register/       # Halaman registrasi
│   ├── categories/         # Halaman kategori
│   │   ├── [id]/           # Detail kategori
│   │   │   └── edit/       # Edit kategori
│   │   └── new/            # Tambah kategori baru
│   ├── products/           # Halaman produk
│   │   ├── [id]/           # Detail produk
│   │   │   └── edit/       # Edit produk
│   │   └── new/            # Tambah produk baru
│   ├── components/         # Komponen reusable
│   │   └── Navigation.js   # Komponen navigasi sidebar
│   ├── services/           # Layanan API
│   │   └── api.js          # Konfigurasi dan fungsi API
│   ├── globals.css         # Styling global
│   ├── layout.js           # Layout utama aplikasi
│   ├── page.js             # Halaman dashboard utama
│   └── theme.js            # Konfigurasi tema Material UI
├── public/                 # File statis
└── README.md              # Dokumentasi ini
```

## 🔧 Teknologi yang Digunakan

- **Next.js 15**: Framework React untuk production
- **Material UI**: Komponen UI yang modern dan responsif
- **Axios**: HTTP client untuk komunikasi API
- **Tailwind CSS**: Utility-first CSS framework
- **JWT**: Autentikasi berbasis token

## 🔒 Keamanan

- **Autentikasi JWT**: Token-based authentication dengan auto-refresh
- **Interceptors**: Automatic redirect ke login pada 401 responses
- **Token Revocation**: Logout yang proper dengan pencabutan token
- **Input Validation**: Validasi form di frontend dan backend

## 📱 Responsive Design

Aplikasi ini dirancang untuk bekerja optimal di:
- **Desktop**: Layout penuh dengan sidebar navigasi
- **Tablet**: Sidebar dapat diciutkan/diperluas
- **Mobile**: Menu hamburger dengan drawer overlay

## 🚀 Deployment

1. Build aplikasi untuk production:
   ```bash
   npm run build
   ```

2. Jalankan aplikasi production:
   ```bash
   npm start
   ```

3. Aplikasi akan berjalan di port 3000 secara default

## 🤝 Kontribusi

1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

