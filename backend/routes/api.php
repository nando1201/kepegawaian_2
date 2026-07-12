<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\PegawaiController;
use App\Http\Controllers\API\JabatanController;
use App\Http\Controllers\API\JabatanPegawaiController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes (requires JWT)
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // User management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // Pegawai (admin full CRUD, user read-only)
    Route::get('/pegawai/all', [PegawaiController::class, 'all']);
    Route::get('/pegawai', [PegawaiController::class, 'index']);
    Route::get('/pegawai/{pegawai}', [PegawaiController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/pegawai', [PegawaiController::class, 'store']);
        Route::put('/pegawai/{pegawai}', [PegawaiController::class, 'update']);
        Route::delete('/pegawai/{pegawai}', [PegawaiController::class, 'destroy']);
    });

    // Jabatan (admin full CRUD, user read-only)
    Route::get('/jabatan/all', [JabatanController::class, 'all']);
    Route::get('/jabatan', [JabatanController::class, 'index']);
    Route::get('/jabatan/{jabatan}', [JabatanController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/jabatan', [JabatanController::class, 'store']);
        Route::put('/jabatan/{jabatan}', [JabatanController::class, 'update']);
        Route::delete('/jabatan/{jabatan}', [JabatanController::class, 'destroy']);
    });

    // Jabatan Pegawai (admin full CRUD, user read-only)
    Route::get('/jabatan-pegawai', [JabatanPegawaiController::class, 'index']);
    Route::get('/jabatan-pegawai/{jabatanPegawai}', [JabatanPegawaiController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/jabatan-pegawai', [JabatanPegawaiController::class, 'store']);
        Route::put('/jabatan-pegawai/{jabatanPegawai}', [JabatanPegawaiController::class, 'update']);
        Route::delete('/jabatan-pegawai/{jabatanPegawai}', [JabatanPegawaiController::class, 'destroy']);
    });
});
