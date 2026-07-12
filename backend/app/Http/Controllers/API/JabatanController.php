<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Jabatan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JabatanController extends Controller
{
    public function index(Request $request)
    {
        $query = Jabatan::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kode_jabatan', 'like', "%{$search}%")
                  ->orWhere('nama_jabatan', 'like', "%{$search}%");
            });
        }

        $jabatan = $query->orderBy('created_at', 'desc')
                         ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $jabatan,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_jabatan'  => 'required|string|max:20|unique:jabatan',
            'nama_jabatan'  => 'required|string|max:100',
            'gaji_jabatan'  => 'required|numeric|min:0',
        ]);

        $jabatan = Jabatan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data jabatan berhasil ditambahkan.',
            'data'    => $jabatan,
        ], 201);
    }

    public function show(Jabatan $jabatan)
    {
        return response()->json([
            'success' => true,
            'data'    => $jabatan,
        ]);
    }

    public function update(Request $request, Jabatan $jabatan)
    {
        $validated = $request->validate([
            'kode_jabatan' => ['required', 'string', 'max:20', Rule::unique('jabatan')->ignore($jabatan->id)],
            'nama_jabatan' => 'required|string|max:100',
            'gaji_jabatan' => 'required|numeric|min:0',
        ]);

        $jabatan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data jabatan berhasil diperbarui.',
            'data'    => $jabatan,
        ]);
    }

    public function destroy(Jabatan $jabatan)
    {
        $jabatan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data jabatan berhasil dihapus.',
        ]);
    }

    public function all()
    {
        $jabatan = Jabatan::select('id', 'kode_jabatan', 'nama_jabatan', 'gaji_jabatan')
                          ->orderBy('nama_jabatan')
                          ->get();
        return response()->json([
            'success' => true,
            'data'    => $jabatan,
        ]);
    }
}
