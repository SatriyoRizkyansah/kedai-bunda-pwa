<?php

/**
 * @OA\Info(
 *     title="Kedai Bunda POS API",
 *     version="1.0.0",
 *     description="API Documentation untuk Sistem Point of Sale Kedai Bunda - Manajemen Stok, Menu, dan Transaksi",
 *     @OA\Contact(
 *         email="admin@kedaibunda.com",
 *         name="Kedai Bunda Support"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Development Server"
 * )
 * 
 * @OA\Server(
 *     url="https://api.kedaibunda.com",
 *     description="Production Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     type="http",
 *     securityScheme="bearerAuth",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="JWT Authorization menggunakan Bearer token. Format: Authorization: Bearer {token}"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="Endpoint untuk autentikasi pengguna"
 * )
 * 
 * @OA\Tag(
 *     name="Dashboard",
 *     description="Endpoint untuk dashboard dan statistik"
 * )
 * 
 * @OA\Tag(
 *     name="Bahan Baku",
 *     description="Manajemen bahan baku/raw materials"
 * )
 * 
 * @OA\Tag(
 *     name="Konversi Bahan",
 *     description="Konversi satuan bahan (contoh: 1 ekor = 8 potong)"
 * )
 * 
 * @OA\Tag(
 *     name="Menu",
 *     description="Manajemen menu/produk"
 * )
 * 
 * @OA\Tag(
 *     name="Komposisi Menu",
 *     description="Komposisi/resep bahan untuk setiap menu"
 * )
 * 
 * @OA\Tag(
 *     name="Transaksi",
 *     description="Manajemen transaksi penjualan"
 * )
 * 
 * @OA\Tag(
 *     name="Stok Log",
 *     description="Riwayat perubahan stok bahan baku"
 * )
 * 
 * @OA\Tag(
 *     name="User Management",
 *     description="Manajemen pengguna (Super Admin only)"
 * )
 * 
 * @OA\Schema(
 *     schema="SuccessResponse",
 *     @OA\Property(property="sukses", type="boolean", example=true),
 *     @OA\Property(property="pesan", type="string", example="Operasi berhasil"),
 *     @OA\Property(property="data", type="object")
 * )
 * 
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     @OA\Property(property="sukses", type="boolean", example=false),
 *     @OA\Property(property="pesan", type="string", example="Terjadi kesalahan"),
 *     @OA\Property(property="errors", type="object")
 * )
 * 
 * @OA\Schema(
 *     schema="BahanBaku",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="nama", type="string", example="Ayam Potong"),
 *     @OA\Property(property="satuan", type="string", example="potong"),
 *     @OA\Property(property="stok", type="number", example=50),
 *     @OA\Property(property="harga_beli", type="number", example=25000),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Menu",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="nama", type="string", example="Ayam Goreng"),
 *     @OA\Property(property="kategori", type="string", example="Makanan"),
 *     @OA\Property(property="harga", type="number", example=15000),
 *     @OA\Property(property="deskripsi", type="string", example="Ayam goreng crispy"),
 *     @OA\Property(property="status", type="string", example="tersedia"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Transaksi",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="nomor_transaksi", type="string", example="TRX-20250124-001"),
 *     @OA\Property(property="tanggal", type="string", format="date-time"),
 *     @OA\Property(property="total", type="number", example=45000),
 *     @OA\Property(property="metode_pembayaran", type="string", example="tunai"),
 *     @OA\Property(property="status", type="string", example="selesai"),
 *     @OA\Property(property="catatan", type="string", example="Pelanggan reguler")
 * )
 */
class SwaggerAnnotations
{
    // This class is only for Swagger documentation
}
