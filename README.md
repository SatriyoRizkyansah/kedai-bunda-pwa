# Kedai Bunda - Sistem Manajemen Kedai

Aplikasi sistem manajemen untuk Kedai Bunda dengan fitur lengkap untuk mengelola stok bahan baku, menu, transaksi, dan laporan penjualan.

## 🚀 Fitur Utama

-   ✅ **Manajemen Bahan Baku** - Input dan tracking stok bahan baku dengan konversi unit otomatis
-   ✅ **Manajemen Menu** - Kelola menu dengan komposisi bahan baku
-   ✅ **Sistem Transaksi** - Pencatatan transaksi penjualan dengan pengurangan stok otomatis
-   ✅ **Laporan** - Laporan harian, mingguan, dan bulanan
-   ✅ **Multi-Level User** - Super Admin dan Admin dengan hak akses berbeda
-   ✅ **Dashboard Interaktif** - Dashboard dengan statistik real-time

## 🛠️ Teknologi

-   Laravel 11
-   PHP 8.2+
-   MySQL
-   Tailwind CSS
-   Alpine.js
-   Laravel Breeze

## 📦 Instalasi

1. Clone repository

```bash
git clone <repository-url>
cd kedai-bunda
```

2. Install dependencies

```bash
composer install
npm install
```

3. Setup environment

```bash
cp .env.example .env
php artisan key:generate
```

4. Konfigurasi database di file `.env`

```
DB_DATABASE=kedai_bunda
DB_USERNAME=root
DB_PASSWORD=
```

5. Jalankan migration dan seeder

```bash
php artisan migrate:fresh --seed
```

6. Build assets

```bash
npm run build
```

7. Jalankan server

```bash
php artisan serve
```

Akses aplikasi di: `http://localhost:8000`

## 👤 Akun Demo

### Super Admin

-   **Email:** superadmin@kedaibunda.com
-   **Password:** superadmin123

### Admin

-   **Email:** admin@kedaibunda.com
-   **Password:** admin123

## 📊 Struktur Database

-   **users** - Data pengguna (Super Admin & Admin)
-   **bahan_baku** - Data bahan baku
-   **konversi_bahan** - Konversi unit bahan baku (ekor → potong, liter → porsi, dll)
-   **menu** - Daftar menu
-   **komposisi_menu** - Relasi menu dengan bahan baku yang dibutuhkan
-   **transaksi** - Data transaksi penjualan
-   **detail_transaksi** - Detail item dalam transaksi
-   **stok_log** - Log perubahan stok bahan baku

## 🎨 Tampilan

-   **Navbar Horizontal** - Menu navigasi di bagian atas dengan warna merah-putih
-   **Dashboard** - Statistik real-time, menu terlaris, dan peringatan stok
-   **Design Merah-Putih** - Sesuai dengan identitas Kedai Bunda

## 📝 License

MIT License
# kedai-bunda-pwa
