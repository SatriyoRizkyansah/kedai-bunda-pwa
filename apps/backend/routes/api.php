<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BahanBakuController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StokLogController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\KonversiBahanController;
use App\Http\Controllers\Api\KomposisiMenuController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes untuk API Kedai Bunda
|
*/

// Auth routes (public)
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:api'])->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Register user baru (hanya super_admin)
    Route::post('/register', [AuthController::class, 'register'])->middleware('role:super_admin');

    // Dashboard & Laporan (semua yang login bisa akses)
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/laporan/penjualan', [DashboardController::class, 'laporanPenjualan']);
    Route::get('/laporan/stok', [DashboardController::class, 'laporanStok']);

    // Bahan Baku (admin dan super_admin)
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::apiResource('bahan-baku', BahanBakuController::class);
        
        // Konversi Bahan
        Route::apiResource('konversi-bahan', KonversiBahanController::class);
    });

    // Menu (admin dan super_admin)
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::apiResource('menu', MenuController::class);
        Route::get('menu/{id}/cek-stok', [MenuController::class, 'cekStok']);
        
        // Komposisi Menu
        Route::apiResource('komposisi-menu', KomposisiMenuController::class);
        Route::post('komposisi-menu/batch', [KomposisiMenuController::class, 'storeMultiple']);
        Route::delete('komposisi-menu/menu/{menuId}', [KomposisiMenuController::class, 'destroyByMenu']);
    });

    // Transaksi (semua role bisa akses)
    Route::apiResource('transaksi', TransaksiController::class)->except(['update', 'destroy']);
    Route::post('transaksi/{id}/batal', [TransaksiController::class, 'batal'])->middleware('role:super_admin,admin');

    // Stok Log / Riwayat Stok
    Route::get('/stok-log', [StokLogController::class, 'index']);
    Route::post('/stok-log/tambah', [StokLogController::class, 'tambahStok'])->middleware('role:super_admin,admin');
    Route::post('/stok-log/kurangi', [StokLogController::class, 'kurangiStok'])->middleware('role:super_admin,admin');

    // User Management (hanya super_admin)
    Route::middleware('role:super_admin')->group(function () {
        Route::apiResource('users', UserController::class)->except(['store']); // store sudah ada di register
    });

    // Profile (semua user yang login)
    Route::put('/profil', [UserController::class, 'updateProfil']);
});
