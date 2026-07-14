-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jun 18, 2026 at 03:20 PM
-- Server version: 11.4.12-MariaDB-ubu2404
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistem_pegawai`
--

-- --------------------------------------------------------

--
-- Table structure for table `jabatan`
--

CREATE TABLE `jabatan` (
  `kode_jabatan` varchar(5) NOT NULL,
  `nama_jabatan` varchar(20) NOT NULL,
  `level` varchar(5) NOT NULL,
  `gaji` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jabatan_pegawai`
--

CREATE TABLE `jabatan_pegawai` (
  `nip` varchar(15) NOT NULL,
  `kode_jabatan` varchar(5) NOT NULL,
  `status` char(3) NOT NULL,
  `periode` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pegawai`
--

CREATE TABLE `pegawai` (
  `nip` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `jenis_kelamin` varchar(1) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `nohp` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jabatan`
--
ALTER TABLE `jabatan`
  ADD PRIMARY KEY (`kode_jabatan`);

--
-- Indexes for table `jabatan_pegawai`
--
ALTER TABLE `jabatan_pegawai`
  ADD UNIQUE KEY `nip_fk` (`nip`) USING BTREE,
  ADD KEY `jabatan_fk` (`kode_jabatan`) USING BTREE;

--
-- Indexes for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`nip`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nohp` (`nohp`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jabatan_pegawai`
--
ALTER TABLE `jabatan_pegawai`
  ADD CONSTRAINT `jabatan_fk` FOREIGN KEY (`kode_jabatan`) REFERENCES `jabatan` (`kode_jabatan`),
  ADD CONSTRAINT `nip_fk` FOREIGN KEY (`nip`) REFERENCES `pegawai` (`nip`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
