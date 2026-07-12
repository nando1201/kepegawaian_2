<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
    protected $table = 'jabatan';

    protected $fillable = [
        'kode_jabatan',
        'nama_jabatan',
        'gaji_jabatan',
    ];

    protected function casts(): array
    {
        return [
            'gaji_jabatan' => 'decimal:2',
        ];
    }

    public function jabatanPegawai()
    {
        return $this->hasMany(JabatanPegawai::class);
    }
}
