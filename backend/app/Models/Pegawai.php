<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    protected $table = 'pegawai';

    protected $fillable = [
        'nip',
        'nama_lengkap',
        'nama_jalan',
        'rt',
        'rw',
        'kelurahan',
        'kota',
        'provinsi',
        'kode_pos',
        'email',
        'tanggal_lahir',
        'no_hp',
        'jenis_kelamin',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
        ];
    }

    public function jabatanAktif()
    {
        return $this->hasOne(JabatanPegawai::class)->where('is_aktif', true)->with('jabatan');
    }

    public function jabatanPegawai()
    {
        return $this->hasMany(JabatanPegawai::class);
    }
}
