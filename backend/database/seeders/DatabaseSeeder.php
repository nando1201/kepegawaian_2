<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin account
        User::create([
            'username' => 'admin',
            'email'    => 'admin@kepegawaian.local',
            'nip'      => '0000000001',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        // Create sample user
        User::create([
            'username' => 'user',
            'email'    => 'user@kepegawaian.local',
            'nip'      => '0000000002',
            'password' => Hash::make('user123'),
            'role'     => 'user',
        ]);
    }
}
