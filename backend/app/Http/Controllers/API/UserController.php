<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $users = $query->select('id', 'username', 'email', 'nip', 'role', 'created_at')
                       ->orderBy('created_at', 'desc')
                       ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50|unique:users',
            'email'    => 'required|email|max:100|unique:users',
            'nip'      => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,user',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan.',
            'data'    => $user->only(['id', 'username', 'email', 'nip', 'role']),
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json([
            'success' => true,
            'data'    => $user->only(['id', 'username', 'email', 'nip', 'role', 'created_at']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'email'    => ['required', 'email', 'max:100', Rule::unique('users')->ignore($user->id)],
            'nip'      => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6',
            'role'     => 'required|in:admin,user',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui.',
            'data'    => $user->only(['id', 'username', 'email', 'nip', 'role']),
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus.',
        ]);
    }
}
