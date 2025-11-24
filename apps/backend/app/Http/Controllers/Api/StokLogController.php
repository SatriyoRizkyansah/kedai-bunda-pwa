<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StokLog;
use App\Models\BahanBaku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StokLogController extends Controller
{
    /**
     * Menampilkan riwayat stok
     */
    public function index(Request $request)
    {
        $query = StokLog::with(['bahanBaku', 'user']);

        // Filter berdasarkan bahan baku
        if ($request->has('bahan_baku_id')) {
            $query->where('bahan_baku_id', $request->bahan_baku_id);
        }

        // Filter berdasarkan tipe
        if ($request->has('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        // Filter berdasarkan tanggal
        if ($request->has('tanggal_mulai') && $request->has('tanggal_selesai')) {
            $query->whereBetween('created_at', [
                $request->tanggal_mulai . ' 00:00:00',
                $request->tanggal_selesai . ' 23:59:59'
            ]);
        }

        $stokLog = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'sukses' => true,
            'pesan' => 'Berhasil mengambil riwayat stok',
            'data' => $stokLog
        ]);
    }

    /**
     * Menambah stok (pembelian/restok)
     */
    public function tambahStok(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bahan_baku_id' => 'required|exists:bahan_baku,id',
            'jumlah' => 'required|numeric|min:0.01',
            'keterangan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $bahanBaku = BahanBaku::find($request->bahan_baku_id);
        $stokSebelum = $bahanBaku->stok_tersedia;
        $stokSesudah = $stokSebelum + $request->jumlah;

        $bahanBaku->update(['stok_tersedia' => $stokSesudah]);

        $stokLog = StokLog::create([
            'bahan_baku_id' => $request->bahan_baku_id,
            'user_id' => auth()->id(),
            'tipe' => 'masuk',
            'jumlah' => $request->jumlah,
            'stok_sebelum' => $stokSebelum,
            'stok_sesudah' => $stokSesudah,
            'referensi' => 'RESTOK-' . date('YmdHis'),
            'keterangan' => $request->keterangan ?? 'Penambahan stok manual'
        ]);

        return response()->json([
            'sukses' => true,
            'pesan' => 'Stok berhasil ditambahkan',
            'data' => $stokLog->load(['bahanBaku', 'user'])
        ], 201);
    }

    /**
     * Mengurangi stok (penyesuaian/rusak/hilang)
     */
    public function kurangiStok(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bahan_baku_id' => 'required|exists:bahan_baku,id',
            'jumlah' => 'required|numeric|min:0.01',
            'keterangan' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $bahanBaku = BahanBaku::find($request->bahan_baku_id);
        $stokSebelum = $bahanBaku->stok_tersedia;
        
        if ($stokSebelum < $request->jumlah) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Stok tidak mencukupi untuk dikurangi'
            ], 400);
        }

        $stokSesudah = $stokSebelum - $request->jumlah;
        $bahanBaku->update(['stok_tersedia' => $stokSesudah]);

        $stokLog = StokLog::create([
            'bahan_baku_id' => $request->bahan_baku_id,
            'user_id' => auth()->id(),
            'tipe' => 'keluar',
            'jumlah' => $request->jumlah,
            'stok_sebelum' => $stokSebelum,
            'stok_sesudah' => $stokSesudah,
            'referensi' => 'ADJUST-' . date('YmdHis'),
            'keterangan' => $request->keterangan
        ]);

        return response()->json([
            'sukses' => true,
            'pesan' => 'Stok berhasil dikurangi',
            'data' => $stokLog->load(['bahanBaku', 'user'])
        ], 201);
    }
}
