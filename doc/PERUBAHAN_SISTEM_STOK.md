# 📋 Summary Perubahan Sistem Kedai Bunda PWA

## 🎯 Tujuan Perubahan

Menyederhanakan sistem untuk UMKM dengan menambahkan fitur:

1. **Data Master Satuan** - Konversi satuan otomatis
2. **Tracking Stok Bahan Baku** - Riwayat penambahan stok
3. **Tracking Stok Menu** - Riwayat penambahan stok menu
4. **Mode Stok Menu** - Opsi manual atau terhubung bahan baku

---

## 📁 File-file yang Dibuat/Diubah

### Backend (Laravel)

#### Migrations Baru:

- `2025_11_25_000001_create_satuan_table.php` - Tabel master satuan
- `2025_11_25_000002_add_stok_fields_to_menu_table.php` - Kolom baru di menu
- `2025_11_25_000003_create_menu_stok_log_table.php` - Tracking stok menu
- `2025_11_25_000004_add_satuan_id_to_bahan_baku_table.php` - Relasi satuan ke bahan baku

#### Models Baru:

- `app/Models/Satuan.php` - Model satuan dengan konversi
- `app/Models/MenuStokLog.php` - Model tracking stok menu

#### Models Diupdate:

- `app/Models/Menu.php` - Tambah field stok, kelola_stok_mandiri, satuan_id, relasi stokLog
- `app/Models/BahanBaku.php` - Tambah satuan_id, method tambahStok() & kurangiStok()

#### Controllers:

- `app/Http/Controllers/Api/SatuanController.php` - CRUD satuan (BARU)
- `app/Http/Controllers/Api/BahanBakuController.php` - Tambah endpoint tambah/kurangi stok
- `app/Http/Controllers/Api/MenuController.php` - Tambah endpoint stok menu

#### Routes (api.php):

```php
// Satuan
Route::get('satuan', [SatuanController::class, 'index']);
Route::get('satuan/grouped', [SatuanController::class, 'groupedByTipe']);

// Bahan Baku Stok
Route::post('bahan-baku/{id}/tambah-stok', [BahanBakuController::class, 'tambahStok']);
Route::post('bahan-baku/{id}/kurangi-stok', [BahanBakuController::class, 'kurangiStok']);
Route::get('bahan-baku/{id}/stok-log', [BahanBakuController::class, 'stokLog']);

// Menu Stok
Route::get('menu/{id}/stok-efektif', [MenuController::class, 'getStokEfektif']);
Route::post('menu/{id}/tambah-stok', [MenuController::class, 'tambahStok']);
Route::post('menu/{id}/kurangi-stok', [MenuController::class, 'kurangiStok']);
Route::get('menu/{id}/stok-log', [MenuController::class, 'stokLog']);
```

#### Seeders:

- `database/seeders/SatuanSeeder.php` - Data master satuan standar
- Update `DatabaseSeeder.php` - Panggil SatuanSeeder

---

### Frontend (React + TypeScript)

#### Types Update (`src/lib/types.ts`):

```typescript
interface Menu {
  // ... existing fields
  stok: number;
  kelola_stok_mandiri: boolean;
  satuan_id?: number | null;
  stok_efektif?: number;
  satuan?: Satuan;
}

interface Satuan {
  id: number;
  nama: string;
  singkatan: string;
  tipe: "berat" | "volume" | "jumlah";
  faktor_konversi: number;
  // ...
}
```

#### Pages Update:

**BahanBakuPage.tsx:**

- Tombol "Tambah Stok" (+) untuk menambah stok dengan tracking
- Tombol "Riwayat" (🕒) untuk melihat histori perubahan stok
- Dialog modal untuk input jumlah dan keterangan
- Dialog modal untuk melihat riwayat stok
- Konfirmasi hapus dengan dialog (bukan confirm() browser)

**MenuPage.tsx:**

- Toggle mode stok: Manual vs Terhubung Bahan Baku
- Info stok di setiap card menu
- Tombol "Tambah Stok" (hanya untuk mode manual)
- Tombol "Riwayat Stok"
- Dialog modal untuk tambah stok
- Dialog modal untuk riwayat
- Badge menunjukkan mode stok (Manual/Bahan Baku)

---

## 🗄️ Struktur Database Baru

### Tabel `satuan`

| Kolom           | Tipe    | Keterangan                        |
| --------------- | ------- | --------------------------------- |
| id              | bigint  | Primary key                       |
| nama            | string  | Nama satuan (Kilogram, Gram, dll) |
| singkatan       | string  | Singkatan (kg, g, l, ml, pcs)     |
| tipe            | enum    | berat, volume, jumlah             |
| satuan_dasar    | string  | Referensi ke satuan dasar         |
| faktor_konversi | decimal | Faktor konversi ke satuan dasar   |
| is_satuan_dasar | boolean | Apakah ini satuan dasar           |
| aktif           | boolean | Status aktif                      |

### Tabel `menu` (Kolom Baru)

| Kolom               | Tipe    | Keterangan                         |
| ------------------- | ------- | ---------------------------------- |
| stok                | decimal | Jumlah stok (untuk mode manual)    |
| kelola_stok_mandiri | boolean | true=manual, false=dari bahan baku |
| satuan_id           | foreign | Relasi ke tabel satuan             |

### Tabel `menu_stok_log`

| Kolom        | Tipe    | Keterangan                    |
| ------------ | ------- | ----------------------------- |
| id           | bigint  | Primary key                   |
| menu_id      | foreign | Relasi ke menu                |
| user_id      | foreign | User yang melakukan perubahan |
| tipe         | enum    | masuk, keluar, penyesuaian    |
| jumlah       | decimal | Jumlah perubahan              |
| stok_sebelum | decimal | Stok sebelum perubahan        |
| stok_sesudah | decimal | Stok setelah perubahan        |
| referensi    | string  | Nomor referensi (opsional)    |
| keterangan   | text    | Keterangan perubahan          |

---

## 🚀 Cara Menjalankan Migrasi

```bash
cd apps/backend

# Jalankan migrasi
php artisan migrate

# Jalankan seeder (opsional, untuk data master)
php artisan db:seed --class=SatuanSeeder
```

---

## 📝 Catatan Penting

1. **Mode Stok Manual** (`kelola_stok_mandiri = true`):
   - Stok dikelola langsung di menu
   - Bisa tambah/kurangi stok manual
   - Tidak perlu setup komposisi menu
   - Cocok untuk menu simple atau siap jadi

2. **Mode Dari Bahan Baku** (`kelola_stok_mandiri = false`):
   - Stok dihitung otomatis dari ketersediaan bahan baku
   - Perlu setup komposisi menu terlebih dahulu
   - Sistem akan menghitung berapa menu yang bisa dibuat
   - Cocok untuk menu yang memang perlu tracking bahan

3. **Backward Compatibility**:
   - Menu lama yang tidak punya field baru akan default ke `kelola_stok_mandiri = true`
   - Sistem tetap berjalan normal

---

## 🔄 Alur Kerja Baru

### Untuk UMKM yang Simple (Tanpa Tracking Bahan Baku):

1. Buat menu → Pilih mode "Stok Manual"
2. Set stok awal
3. Setiap ada produksi → Klik "Tambah Stok"
4. Setiap ada penjualan → Sistem otomatis kurangi stok

### Untuk UMKM yang Mau Tracking Bahan Baku:

1. Setup bahan baku terlebih dahulu
2. Setup komposisi menu (resep)
3. Buat menu → Pilih mode "Terhubung Bahan Baku"
4. Sistem otomatis hitung stok dari ketersediaan bahan baku

---

_Dokumen ini bisa digunakan sebagai referensi untuk melanjutkan pengembangan._
