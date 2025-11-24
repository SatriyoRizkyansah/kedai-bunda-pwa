<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KonversiBahan;
use App\Models\BahanBaku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KonversiBahanController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/konversi-bahan",
     *     summary="Ambil semua konversi bahan",
     *     tags={"Konversi Bahan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="bahan_baku_id",
     *         in="query",
     *         description="Filter by bahan baku ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Data konversi bahan",
     *         @OA\JsonContent(
     *             @OA\Property(property="sukses", type="boolean", example=true),
     *             @OA\Property(property="pesan", type="string"),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="bahan_baku_id", type="integer", example=1),
     *                     @OA\Property(property="satuan_asal", type="string", example="ekor"),
     *                     @OA\Property(property="satuan_tujuan", type="string", example="potong"),
     *                     @OA\Property(property="nilai_konversi", type="number", example=8)
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = KonversiBahan::with('bahanBaku');

        // Filter berdasarkan bahan baku
        if ($request->has('bahan_baku_id')) {
            $query->where('bahan_baku_id', $request->bahan_baku_id);
        }

        $konversi = $query->get();

        return response()->json([
            'sukses' => true,
            'pesan' => 'Berhasil mengambil data konversi bahan',
            'data' => $konversi
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/konversi-bahan",
     *     summary="Tambah konversi bahan baru",
     *     tags={"Konversi Bahan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"bahan_baku_id","satuan_konversi","nilai_konversi"},
     *             @OA\Property(property="bahan_baku_id", type="integer", example=1),
     *             @OA\Property(property="satuan_konversi", type="string", example="potong"),
     *             @OA\Property(property="nilai_konversi", type="number", example=8),
     *             @OA\Property(property="keterangan", type="string", example="1 ekor = 8 potong")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Konversi berhasil ditambahkan"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bahan_baku_id' => 'required|exists:bahan_baku,id',
            'satuan_konversi' => 'required|string|max:50',
            'nilai_konversi' => 'required|numeric|min:0.01',
            'keterangan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cek apakah konversi untuk satuan ini sudah ada
        $existing = KonversiBahan::where('bahan_baku_id', $request->bahan_baku_id)
            ->where('satuan_konversi', $request->satuan_konversi)
            ->first();

        if ($existing) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Konversi untuk satuan ini sudah ada'
            ], 400);
        }

        $konversi = KonversiBahan::create($request->all());

        return response()->json([
            'sukses' => true,
            'pesan' => 'Konversi bahan berhasil ditambahkan',
            'data' => $konversi->load('bahanBaku')
        ], 201);
    }

    /**
     * Menampilkan detail konversi bahan
     */
    public function show($id)
    {
        $konversi = KonversiBahan::with('bahanBaku')->find($id);

        if (!$konversi) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Konversi bahan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'sukses' => true,
            'pesan' => 'Berhasil mengambil detail konversi bahan',
            'data' => $konversi
        ]);
    }

    /**
     * Mengupdate konversi bahan
     */
    public function update(Request $request, $id)
    {
        $konversi = KonversiBahan::find($id);

        if (!$konversi) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Konversi bahan tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'satuan_konversi' => 'sometimes|string|max:50',
            'nilai_konversi' => 'sometimes|numeric|min:0.01',
            'keterangan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $konversi->update($request->all());

        return response()->json([
            'sukses' => true,
            'pesan' => 'Konversi bahan berhasil diupdate',
            'data' => $konversi->load('bahanBaku')
        ]);
    }

    /**
     * Menghapus konversi bahan
     */
    public function destroy($id)
    {
        $konversi = KonversiBahan::find($id);

        if (!$konversi) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Konversi bahan tidak ditemukan'
            ], 404);
        }

        $konversi->delete();

        return response()->json([
            'sukses' => true,
            'pesan' => 'Konversi bahan berhasil dihapus'
        ]);
    }
}
