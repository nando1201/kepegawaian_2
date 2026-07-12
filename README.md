# SIMPEG — Sistem Informasi Kepegawaian

SIMPEG adalah aplikasi Sistem Informasi Kepegawaian berbasis web yang menggunakan arsitektur decoupled/terpisah antara **Laravel (REST API)** sebagai backend dan **React (Vite)** sebagai frontend SPA. Aplikasi ini mengusung desain dashboard gelap premium ala *Materio Admin* menggunakan **Tailwind CSS**.

---

## 🛠️ Tech Stack & Dependencies

### Backend
* **Framework**: Laravel 12
* **Authentication**: JWT (JSON Web Token) menggunakan `tymon/jwt-auth`
* **Database**: MySQL (MariaDB/XAMPP)
* **CORS**: `fruitcake/laravel-cors` (bawaan Laravel Middleware)

### Frontend
* **Runtime & Bundler**: Node.js & Vite 5
* **Library Utama**: React 18
* **Styling**: Tailwind CSS v3
* **Routing**: React Router DOM v6
* **Icons**: Lucide React
* **Toast Notification**: React Hot Toast
* **HTTP Client**: Axios

---

## 📋 Fitur Utama

1. **Modul Login (Autentikasi JWT)**:
   * Login menggunakan username dan password.
   * State manajemen stateless (token JWT disimpan aman di localStorage).
   * Validasi token otomatis via Axios interceptor dengan pengalihan kembali ke login jika kadaluarsa.
2. **Modul User (Manajemen Pengguna)**:
   * Pengelolaan akun sistem (CRUD: username, email, NIP, password, role).
   * Hak akses: Role `admin` & `user`. Modul ini hanya bisa diakses dan dikelola penuh oleh Admin.
3. **Modul Pegawai**:
   * Data pokok pegawai (NIP, nama lengkap, email, tanggal lahir, nomor HP, jenis kelamin).
   * Breakdown alamat lengkap (Nama jalan, RT, RW, Kelurahan, Kota, Provinsi, Kode pos).
   * Status jabatan aktif otomatis tampil di baris tabel.
4. **Modul Jabatan**:
   * Pengelolaan jabatan kerja (Kode jabatan, nama jabatan, gaji jabatan).
   * Format mata uang otomatis (Rupiah IDR) pada list tabel dan input form preview.
5. **Modul Jabatan Pegawai**:
   * Penugasan jabatan aktif ke pegawai tertentu (relasi 1 pegawai ↔ 1 jabatan aktif).
   * Aturan sistem: Jika pegawai ditetapkan ke jabatan baru, jabatan lama secara otomatis akan dinonaktifkan (`is_aktif` menjadi `false`).

---

## 💻 Cara Install & Konfigurasi

### 1. Prasyarat (Prerequisites)
Pastikan komputer Anda sudah terinstal:
* PHP >= 8.2 (direkomendasikan via XAMPP terbaru)
* Composer
* Node.js & npm
* MySQL / MariaDB (sudah aktif di XAMPP)

---

### 2. Setup Database
1. Buka phpMyAdmin (`http://localhost/phpmyadmin`) atau terminal MySQL.
2. Buat database baru bernama: **`db_pegawai`**.
   ```sql
   CREATE DATABASE db_pegawai;
   ```

---

### 3. Konfigurasi Backend (Laravel)
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Salin file `.env.example` menjadi `.env`:
   ```bash
   copy .env.example .env
   ```
3. Sesuaikan detail database di file `.env` (secara default sudah dikonfigurasi tanpa password):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=db_pegawai
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Instal semua dependensi backend:
   ```bash
   composer install
   ```
5. Generate application key dan JWT secret key:
   ```bash
   php artisan key:generate
   php artisan jwt:secret
   ```
6. Jalankan migrasi tabel beserta pengisian data awal (seeder):
   ```bash
   php artisan migrate:fresh --seed
   ```
7. Jalankan server lokal Laravel:
   ```bash
   php artisan serve --port=8000
   ```

---

### 4. Konfigurasi Frontend (React Vite)
1. Buka terminal baru lalu masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Instal semua dependensi frontend:
   ```bash
   npm install
   ```
3. Jalankan server lokal React:
   ```bash
   npm run dev
   ```

---

## 🔑 Akun Default (Login Kredensial)

Gunakan akun berikut untuk menguji sistem setelah melakukan seeding database:

| No | Username | Password | Role | Hak Akses |
|---|---|---|---|---|
| 1 | `admin` | `admin123` | **Admin** | Full Akses (Bisa Tambah, Edit, Hapus di semua modul) |
| 2 | `user` | `user123` | **User** | Read-Only (Hanya dapat melihat data, tombol aksi disembunyikan) |

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Deskripsi | Proteksi Token |
|---|---|---|---|
| **POST** | `/api/auth/login` | Melakukan autentikasi & mendapatkan JWT Token | Publik |
| **POST** | `/api/auth/logout` | Melakukan logout & menghapus token JWT | JWT Token |
| **GET** | `/api/auth/me` | Mendapatkan data informasi user yang sedang login | JWT Token |
| **GET** | `/api/users` | Mendapatkan daftar seluruh user | Admin Only |
| **POST** | `/api/users` | Menambahkan user baru | Admin Only |
| **PUT** | `/api/users/{id}` | Mengubah data user berdasarkan ID | Admin Only |
| **DELETE** | `/api/users/{id}` | Menghapus user berdasarkan ID | Admin Only |
| **GET** | `/api/pegawai` | Mendapatkan list pegawai ter-paginasi | JWT Token |
| **GET** | `/api/pegawai/all` | Mendapatkan seluruh data pegawai (untuk dropdown) | JWT Token |
| **POST** | `/api/pegawai` | Menambahkan pegawai baru | Admin Only |
| **PUT** | `/api/pegawai/{id}` | Mengedit data pegawai | Admin Only |
| **DELETE** | `/api/pegawai/{id}` | Menghapus pegawai | Admin Only |
| **GET** | `/api/jabatan` | Mendapatkan list jabatan ter-paginasi | JWT Token |
| **POST** | `/api/jabatan` | Menambahkan jabatan baru | Admin Only |
| **PUT** | `/api/jabatan/{id}` | Mengedit data jabatan | Admin Only |
| **DELETE** | `/api/jabatan/{id}` | Menghapus jabatan | Admin Only |
| **GET** | `/api/jabatan-pegawai` | Mendapatkan riwayat relasi jabatan pegawai | JWT Token |
| **POST** | `/api/jabatan-pegawai` | Menugaskan jabatan baru ke pegawai | Admin Only |
