<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KomposisiMenu;
use App\Models\Menu;
use App\Models\BahanBaku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KomposisiMenuController extends Controller
{
    /**
     * Menampilkan daftar komposisi menu
     */
    public function index(Request $request)
    {
        $query = KomposisiMenu::with(['menu', 'bahanBaku']);

        // Filter berdasarkan menu
        if ($request->has('menu_id')) {
            $query->where('menu_id', $request->menu_id);
        }

        // Filter berdasarkan bahan baku
        if ($request->has('bahan_baku_id')) {
            $query->where('bahan_baku_id', $request->bahan_baku_id);
        }

        $komposisi = $query->get();

        return response()->json([
            'sukses' => true,
            'pesan' => 'Berhasil mengambil data komposisi menu',
            'data' => $komposisi
        ]);
    }

    /**
     * Menyimpan komposisi menu baru
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_id' => 'required|exists:menu,id',
            'bahan_baku_id' => 'required|exists:bahan_baku,id',
            'jumlah' => 'required|numeric|min:0.01',
            'satuan' => 'required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cek apakah bahan ini sudah ada di menu
        $existing = KomposisiMenu::where('menu_id', $request->menu_id)
            ->where('bahan_baku_id', $request->bahan_baku_id)
            ->first();

        if ($existing) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Bahan ini sudah ada di komposisi menu'
            ], 400);
        }

        $komposisi = KomposisiMenu::create($request->all());

        return response()->json([
            'sukses' => true,
            'pesan' => 'Komposisi menu berhasil ditambahkan',
            'data' => $komposisi->load(['menu', 'bahanBaku'])
        ], 201);
    }

    /**
     * Menyimpan multiple komposisi sekaligus untuk menu
     */
    public function storeMultiple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_id' => 'required|exists:menu,id',
            'komposisi' => 'required|array|min:1',
            'komposisi.*.bahan_baku_id' => 'required|exists:bahan_baku,id',
            'komposisi.*.jumlah' => 'required|numeric|min:0.01',
            'komposisi.*.satuan' => 'required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $menu = Menu::find($request->menu_id);
        $komposisiList = [];

        foreach ($request->komposisi as $item) {
            $komposisi = KomposisiMenu::updateOrCreate(
                [
                    'menu_id' => $request->menu_id,
                    'bahan_baku_id' => $item['bahan_baku_id']
                ],
                [
                    'jumlah' => $item['jumlah'],
                    'satuan' => $item['satuan']
                ]
            );

            $komposisiList[] = $komposisi->load('bahanBaku');
        }

        return response()->json([
            'sukses' => true,
            'pesan' => 'Komposisi menu berhasil disimpan',
            'data' => [
                'menu' => $menu,
                'komposisi' => $komposisiList
            ]
        ], 201);
    }

    /**
     * Menampilkan detail komposisi menu
     */
    public function show($id)
    {
        $komposisi = KomposisiMenu::with(['menu', 'bahanBaku'])->find($id);

        if (!$komposisi) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Komposisi menu tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'sukses' => true,
            'pesan' => 'Berhasil mengambil detail komposisi menu',
            'data' => $komposisi
        ]);
    }

    /**
     * Mengupdate komposisi menu
     */
    public function update(Request $request, $id)
    {
        $komposisi = KomposisiMenu::find($id);

        if (!$komposisi) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Komposisi menu tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'jumlah' => 'sometimes|numeric|min:0.01',
            'satuan' => 'sometimes|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $komposisi->update($request->all());

        return response()->json([
            'sukses' => true,
            'pesan' => 'Komposisi menu berhasil diupdate',
            'data' => $komposisi->load(['menu', 'bahanBaku'])
        ]);
    }

    /**
     * Menghapus komposisi menu
     */
    public function destroy($id)
    {
        $komposisi = KomposisiMenu::find($id);

        if (!$komposisi) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Komposisi menu tidak ditemukan'
            ], 404);
        }

        $komposisi->delete();

        return response()->json([
            'sukses' => true,
            'pesan' => 'Komposisi menu berhasil dihapus'
        ]);
    }

    /**
     * Menghapus semua komposisi untuk menu tertentu
     */
    public function destroyByMenu($menuId)
    {
        $menu = Menu::find($menuId);

        if (!$menu) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Menu tidak ditemukan'
            ], 404);
        }

        KomposisiMenu::where('menu_id', $menuId)->delete();

        return response()->json([
            'sukses' => true,
            'pesan' => 'Semua komposisi menu berhasil dihapus'
        ]);
    }
}
