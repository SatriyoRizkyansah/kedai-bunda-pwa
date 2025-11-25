<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    protected $table = 'menu';

    protected $fillable = [
        'nama',
        'kategori',
        'harga_jual',
        'gambar',
        'deskripsi',
        'tersedia',
        'stok',
        'kelola_stok_mandiri',
        'satuan_id',
    ];

    protected $casts = [
        'harga_jual' => 'decimal:2',
        'stok' => 'decimal:2',
        'tersedia' => 'boolean',
        'kelola_stok_mandiri' => 'boolean',
    ];

    /**
     * Relasi ke satuan
     */
    public function satuan(): BelongsTo
    {
        return $this->belongsTo(Satuan::class);
    }

    /**
     * Relasi ke komposisi menu
     */
    public function komposisiMenu(): HasMany
    {
        return $this->hasMany(KomposisiMenu::class);
    }

    /**
     * Relasi ke bahan baku melalui komposisi menu
     */
    public function bahanBaku(): BelongsToMany
    {
        return $this->belongsToMany(BahanBaku::class, 'komposisi_menu')
            ->withPivot('jumlah', 'satuan')
            ->withTimestamps();
    }

    /**
     * Relasi ke detail transaksi
     */
    public function detailTransaksi(): HasMany
    {
        return $this->hasMany(DetailTransaksi::class);
    }

    /**
     * Relasi ke stok log menu
     */
    public function stokLog(): HasMany
    {
        return $this->hasMany(MenuStokLog::class);
    }

    /**
     * Hitung stok berdasarkan bahan baku (jika tidak kelola mandiri)
     * Menghitung berapa banyak menu yang bisa dibuat berdasarkan stok bahan baku
     */
    public function hitungStokDariBahanBaku(): float
    {
        if ($this->kelola_stok_mandiri) {
            return $this->stok;
        }

        $komposisi = $this->komposisiMenu()->with('bahanBaku')->get();
        
        if ($komposisi->isEmpty()) {
            return 0;
        }

        $stokTerkecil = PHP_FLOAT_MAX;

        foreach ($komposisi as $item) {
            if (!$item->bahanBaku || $item->jumlah <= 0) {
                continue;
            }

            // Hitung berapa menu yang bisa dibuat dari bahan ini
            $stokBahan = $item->bahanBaku->stok_tersedia;
            $kebutuhanPerMenu = $item->jumlah;
            
            $menuDariBahan = floor($stokBahan / $kebutuhanPerMenu);
            
            if ($menuDariBahan < $stokTerkecil) {
                $stokTerkecil = $menuDariBahan;
            }
        }

        return $stokTerkecil === PHP_FLOAT_MAX ? 0 : $stokTerkecil;
    }

    /**
     * Get stok efektif (manual atau dari bahan baku)
     */
    public function getStokEfektifAttribute(): float
    {
        return $this->kelola_stok_mandiri ? $this->stok : $this->hitungStokDariBahanBaku();
    }
}
