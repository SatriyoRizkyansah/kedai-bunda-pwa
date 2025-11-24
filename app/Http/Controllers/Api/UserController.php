<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Menampilkan daftar user (hanya super_admin)
     */
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json([
            'sukses' => true,
            'pesan' => 'Berhasil mengambil data user',
            'data' => $users
        ]);
    }

    /**
     * Menampilkan detail user
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'User tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'sukses' => true,
            'pesan' => 'Berhasil mengambil detail user',
            'data' => $user
        ]);
    }

    /**
     * Mengupdate user
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'User tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:super_admin,admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['nama', 'email', 'role']);
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'sukses' => true,
            'pesan' => 'User berhasil diupdate',
            'data' => $user
        ]);
    }

    /**
     * Menghapus user
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'User tidak ditemukan'
            ], 404);
        }

        // Tidak bisa hapus diri sendiri
        if ($user->id === auth()->id()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Tidak dapat menghapus akun sendiri'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'sukses' => true,
            'pesan' => 'User berhasil dihapus'
        ]);
    }

    /**
     * Update profil sendiri
     */
    public function updateProfil(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password_lama' => 'required_with:password|string',
            'password' => 'sometimes|string|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'sukses' => false,
                'pesan' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['nama', 'email']);

        // Update password jika diminta
        if ($request->has('password')) {
            if (!Hash::check($request->password_lama, $user->password)) {
                return response()->json([
                    'sukses' => false,
                    'pesan' => 'Password lama tidak sesuai'
                ], 400);
            }
            
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'sukses' => true,
            'pesan' => 'Profil berhasil diupdate',
            'data' => $user
        ]);
    }
}
