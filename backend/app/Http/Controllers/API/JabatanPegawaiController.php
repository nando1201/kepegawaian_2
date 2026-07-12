<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JabatanPegawai;
use App\Models\Pegawai;
use Illuminate\Http\Request;

class JabatanPegawaiController extends Controller
{
    public function index(Request $request)
    {
        $query = JabatanPegawai::with(['pegawai', 'jabatan'])
                               ->where('is_aktif', true);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('pegawai', function ($q) use ($search) {
                $q->where('nip', 'like', "%{$search}%")
                  ->orWhere('nama_lengkap', 'like', "%{$search}%");
            })->orWhereHas('jabatan', function ($q) use ($search) {
                $q->where('nama_jabatan', 'like', "%{$search}%");
            });
        }

        $data = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pegawai_id'       => 'required|exists:pegawai,id',
            'jabatan_id'       => 'required|exists:jabatan,id',
            'tanggal_mulai'    => 'nullable|date',
            'tanggal_berakhir' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        // Nonaktifkan jabatan lama pegawai (jika ada)
        JabatanPegawai::where('pegawai_id', $validated['pegawai_id'])
                       ->where('is_aktif', true)
                       ->update(['is_aktif' => false]);

        $validated['is_aktif'] = true;
        $jabatanPegawai = JabatanPegawai::create($validated);
        $jabatanPegawai->load(['pegawai', 'jabatan']);

        return response()->json([
            'success' => true,
            'message' => 'Jabatan pegawai berhasil ditetapkan.',
            'data'    => $jabatanPegawai,
        ], 201);
    }

    public function show(JabatanPegawai $jabatanPegawai)
    {
        $jabatanPegawai->load(['pegawai', 'jabatan']);
        return response()->json([
            'success' => true,
            'data'    => $jabatanPegawai,
        ]);
    }

    public function update(Request $request, JabatanPegawai $jabatanPegawai)
    {
        $validated = $request->validate([
            'pegawai_id'       => 'required|exists:pegawai,id',
            'jabatan_id'       => 'required|exists:jabatan,id',
            'tanggal_mulai'    => 'nullable|date',
            'tanggal_berakhir' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        // Jika pegawai berubah, nonaktifkan jabatan lama pegawai baru
        if ($jabatanPegawai->pegawai_id != $validated['pegawai_id']) {
            JabatanPegawai::where('pegawai_id', $validated['pegawai_id'])
                           ->where('is_aktif', true)
                           ->update(['is_aktif' => false]);
        }

        $jabatanPegawai->update($validated);
        $jabatanPegawai->load(['pegawai', 'jabatan']);

        return response()->json([
            'success' => true,
            'message' => 'Data jabatan pegawai berhasil diperbarui.',
            'data'    => $jabatanPegawai,
        ]);
    }

    public function destroy(JabatanPegawai $jabatanPegawai)
    {
        $jabatanPegawai->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data jabatan pegawai berhasil dihapus.',
        ]);
    }
}
