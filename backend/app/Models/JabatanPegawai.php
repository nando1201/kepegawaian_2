<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JabatanPegawai extends Model
{
    protected $table = 'jabatan_pegawai';

    protected $fillable = [
        'pegawai_id',
        'jabatan_id',
        'tanggal_mulai',
        'tanggal_berakhir',
        'is_aktif',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai'    => 'date',
            'tanggal_berakhir' => 'date',
            'is_aktif'         => 'boolean',
        ];
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class);
    }

    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class);
    }
}
