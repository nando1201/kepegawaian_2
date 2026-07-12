<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PegawaiController extends Controller
{
    public function index(Request $request)
    {
        $query = Pegawai::with('jabatanAktif');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nip', 'like', "%{$search}%")
                  ->orWhere('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        $pegawai = $query->orderBy('created_at', 'desc')
                         ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $pegawai,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip'           => 'required|string|max:20|unique:pegawai',
            'nama_lengkap'  => 'required|string|max:100',
            'nama_jalan'    => 'nullable|string|max:255',
            'rt'            => 'nullable|string|max:5',
            'rw'            => 'nullable|string|max:5',
            'kelurahan'     => 'nullable|string|max:100',
            'kota'          => 'nullable|string|max:100',
            'provinsi'      => 'nullable|string|max:100',
            'kode_pos'      => 'nullable|string|max:10',
            'email'         => 'nullable|email|max:100',
            'tanggal_lahir' => 'nullable|date',
            'no_hp'         => 'nullable|string|max:20',
            'jenis_kelamin' => 'nullable|in:L,P',
        ]);

        $pegawai = Pegawai::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil ditambahkan.',
            'data'    => $pegawai,
        ], 201);
    }

    public function show(Pegawai $pegawai)
    {
        $pegawai->load('jabatanAktif');
        return response()->json([
            'success' => true,
            'data'    => $pegawai,
        ]);
    }

    public function update(Request $request, Pegawai $pegawai)
    {
        $validated = $request->validate([
            'nip'           => ['required', 'string', 'max:20', Rule::unique('pegawai')->ignore($pegawai->id)],
            'nama_lengkap'  => 'required|string|max:100',
            'nama_jalan'    => 'nullable|string|max:255',
            'rt'            => 'nullable|string|max:5',
            'rw'            => 'nullable|string|max:5',
            'kelurahan'     => 'nullable|string|max:100',
            'kota'          => 'nullable|string|max:100',
            'provinsi'      => 'nullable|string|max:100',
            'kode_pos'      => 'nullable|string|max:10',
            'email'         => 'nullable|email|max:100',
            'tanggal_lahir' => 'nullable|date',
            'no_hp'         => 'nullable|string|max:20',
            'jenis_kelamin' => 'nullable|in:L,P',
        ]);

        $pegawai->update($validated);
        $pegawai->load('jabatanAktif');

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil diperbarui.',
            'data'    => $pegawai,
        ]);
    }

    public function destroy(Pegawai $pegawai)
    {
        $pegawai->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil dihapus.',
        ]);
    }

    public function all()
    {
        $pegawai = Pegawai::select('id', 'nip', 'nama_lengkap')->orderBy('nama_lengkap')->get();
        return response()->json([
            'success' => true,
            'data'    => $pegawai,
        ]);
    }
}
