-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2025 at 10:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rubiktimer`
--

-- --------------------------------------------------------

--
-- Table structure for table `solves`
--

CREATE TABLE `solves` (
  `id` int(11) NOT NULL,
  `typeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `sessionId` int(11) NOT NULL,
  `solveTime` float NOT NULL,
  `scramble` varchar(255) NOT NULL,
  `plusTwo` tinyint(1) NOT NULL DEFAULT 0,
  `DNF` tinyint(1) NOT NULL DEFAULT 0,
  `endTimestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `solves`
--

INSERT INTO `solves` (`id`, `typeId`, `userId`, `sessionId`, `solveTime`, `scramble`, `plusTwo`, `DNF`, `endTimestamp`) VALUES
(6, 1, 1, 1, 13522, 'F2 U\' L\' F2 D2 L D2 R\' D2 R\' F2 R U2 R2 D\' F\' R\' U2 B F2 D\'', 0, 0, '2025-03-28 23:45:05'),
(7, 1, 1, 1, 15344, 'R2 F\' U\' R F2 B\' L U R2 F2 B2 L\' U2 D2 L\' B2 R U2 R2 B U', 0, 0, '2025-03-28 23:45:05'),
(8, 1, 1, 1, 13030, 'B2 R D2 F2 R D2 R D2 U2 R\' U2 R\' D R\' B2 U B\' L2 B', 0, 0, '2025-03-28 23:45:05'),
(9, 1, 1, 1, 14794, 'B\' U\' L\' B2 U\' L2 D2 R\' D F2 L2 U2 B\' D2 B U2 B L2 D2', 0, 0, '2025-03-28 23:45:05'),
(10, 1, 1, 1, 12555, 'L\' U F U2 D F U L\' B D2 R2 B\' R2 L2 U2 B2 L2 B U2 L2 U\'', 0, 0, '2025-03-28 23:45:05'),
(11, 1, 1, 1, 14617, 'L2 F2 R\' U\' R\' B D2 L2 D\' R F2 U2 R2 L\' D2 L B2 L\' B2 U2 F2', 0, 0, '2025-03-28 23:45:05'),
(13, 1, 1, 1, 13232, 'D F D L\' F R B\' D L D2 L2 F2 R2 B2 U R2 F2 U F2 R2 D\'', 0, 0, '2025-03-28 23:45:05'),
(14, 1, 1, 1, 11738, 'R D F2 D\' L2 D2 U L2 F2 U\' B2 U F\' D2 R F\' R2 U B L2', 0, 0, '2025-03-28 23:45:05'),
(15, 1, 1, 1, 14530, 'U R\' F\' B U\' D L D L2 F U2 B\' L2 F\' B2 U2 B\' R2 F2 U2 D', 0, 0, '2025-03-28 23:45:05'),
(16, 1, 1, 1, 15912, 'F2 R F B L\' F\' R\' D R\' F2 U F2 R2 D B2 U2 R2 U F2 L2 U\'', 0, 0, '2025-03-28 23:45:05'),
(17, 1, 1, 1, 11309, 'L\' B L U2 L\' U2 R U2 L\' B2 U2 F2 R D2 B\' D F\' D U L\' R2', 0, 0, '2025-03-28 23:45:05'),
(18, 1, 1, 1, 11886, 'F2 R2 B L D B2 U B\' U R2 F\' R2 U2 R2 U2 F\' D2 F\' L2 U2 F2', 0, 0, '2025-03-28 23:45:05'),
(19, 1, 1, 1, 11053, 'D\' L2 U2 B2 R\' F2 L\' B2 R\' U2 F2 L\' U L\' B\' F\' L\' D\' B2 U', 0, 0, '2025-03-28 23:45:05'),
(20, 1, 1, 1, 12609, 'F2 U L2 U\' R2 B2 L2 D L2 F2 U2 B2 L\' B R B\' L U L B\' D\'', 0, 0, '2025-03-28 23:45:05'),
(21, 1, 1, 1, 11981, 'B R2 F\' L2 F U\' B R\' D2 F2 L2 U B2 L2 U\' R2 U L2 F2 U', 0, 0, '2025-03-28 23:45:05'),
(22, 1, 1, 1, 10651, 'R\' D\' R U\' L B L\' F D2 F2 B2 D\' F2 L2 D2 F2 D F2 D B2 R', 0, 0, '2025-03-28 23:45:05'),
(23, 1, 1, 1, 14544, 'L2 B\' L\' F2 L D2 F2 U2 L U2 R\' U2 L U2 B D2 U\' R B F2 D\'', 0, 0, '2025-03-28 23:45:05'),
(24, 1, 1, 1, 13593, 'F2 U2 F R2 D2 L2 B2 D2 F2 U2 F\' L2 D R\' U2 F2 R B\' L D2 U', 0, 0, '2025-03-28 23:45:05'),
(25, 1, 1, 1, 14378, 'B2 L\' F2 U2 B2 R F2 R\' B2 F2 L2 D B U2 B2 U L F R2 D2', 0, 0, '2025-03-28 23:45:05'),
(27, 1, 1, 1, 12508, 'B2 U\' R L\' F\' U\' B U2 L D B2 U2 B2 R2 B2 U F2 D B2 U2 F2', 0, 0, '2025-03-28 23:45:05'),
(28, 1, 1, 1, 12633, 'L\' F L2 B R\' U F R2 B\' L F2 D2 L F2 D2 L U2 R\' F2 B2 D2', 0, 0, '2025-03-28 23:45:05'),
(30, 1, 1, 1, 13342, 'R2 U2 B\' R\' D\' B\' U\' R F B2 R L2 B2 R U2 R2 D2 B2 L\' D2', 0, 0, '2025-03-28 23:45:05'),
(31, 1, 1, 1, 12225, '', 0, 0, '2025-03-28 23:45:05'),
(32, 1, 1, 1, 10503, 'F\' U2 B2 R2 U\' F2 D L2 F2 D F2 U2 L\' F2 U2 F\' R B D\' L', 0, 0, '2025-03-28 23:45:05'),
(33, 1, 1, 1, 11663, 'R2 F\' R\' L U R\' B\' U\' B\' U2 D\' L2 D\' B2 R2 B2 L2 D\' B2 D R2', 0, 0, '2025-03-29 00:34:17'),
(34, 1, 1, 1, 16499, 'B L2 D B\' L U\' B\' R2 D2 R2 F2 L U2 F2 R2 U2 R F2 D\' R', 0, 0, '2025-03-28 23:45:05'),
(35, 1, 1, 1, 11880, 'B2 U\' D2 B2 L\' B\' D\' B L\' B\' U2 R2 F\' B\' D2 L2 F\' L2 F2 U2 R2', 0, 0, '2025-03-28 23:45:05'),
(36, 1, 1, 1, 12598, 'D2 F2 U2 F U2 F L2 F\' R2 F R2 L\' U2 B2 F U2 B D\' F', 0, 0, '2025-03-28 23:45:05'),
(38, 1, 1, 1, 13916, 'D\' F B D\' F U F R F U F\' R2 B2 R2 D2 F2 U2 F\' D2 F2 R2', 0, 0, '2025-03-28 23:45:05'),
(39, 1, 1, 1, 11868, 'F\' L2 F2 U2 L2 B2 R2 U L2 B2 R2 U\' R2 L\' F U\' R2 B\' L B', 0, 0, '2025-03-28 23:45:05'),
(40, 1, 1, 1, 13176, 'R2 D2 F2 L2 D U L2 F2 U L2 U\' B2 R\' U\' B\' R\' F2 U\' L\' F', 0, 0, '2025-03-28 23:45:05'),
(42, 1, 1, 1, 11637, 'L B\' U\' F\' U2 D2 R U2 L2 D2 F2 D2 F B2 D2 R2 F\' D2 F\' U F\'', 0, 0, '2025-03-28 23:45:05'),
(43, 1, 1, 1, 8978, 'L D2 B R L\' D L B\' R2 L B2 R2 F2 L B2 R F2 D2 R2 B2', 0, 0, '2025-03-28 23:45:05'),
(44, 1, 1, 1, 10526, 'U2 L2 F L2 U\' B\' L U L\' D2 L2 D2 R2 B L2 D2 B U2 F\' D2 L2', 0, 0, '2025-03-28 23:45:05'),
(45, 1, 1, 1, 11519, 'B\' L\' D\' B\' U2 F2 L\' F R2 U L2 D\' R2 L2 U R2 D\' B2 L\'', 0, 0, '2025-03-28 23:45:05'),
(46, 1, 1, 1, 11899, 'L\' R2 F2 U\' B2 U\' R2 U\' L2 R2 B2 R2 D R F2 U\' R\' U2 F D L2', 0, 0, '2025-03-28 23:45:05'),
(47, 1, 1, 1, 12150, 'L2 D2 B2 D2 F2 R2 F2 D B2 L2 U\' B\' R U\' R2 F R2 U2 L\' U F2', 0, 0, '2025-03-28 23:45:05'),
(48, 1, 1, 1, 13815, 'L2 D\' L2 U2 L\' U2 F2 R2 U2 B2 R B2 R F2 B\' L\' R2 U2 R\' F\' U', 0, 0, '2025-03-28 23:45:05'),
(49, 1, 1, 1, 12272, 'L\' F2 L U D2 F D L2 B U\' F2 U L2 U\' L2 D\' F2 B2 L2', 0, 0, '2025-03-28 23:45:05'),
(50, 1, 1, 1, 10314, 'D2 F U\' B R\' D B R U\' R F2 R\' B2 R2 D2 L\' U2 R\' U2', 0, 0, '2025-03-28 23:45:05'),
(51, 1, 1, 1, 13001, 'D\' B\' L F\' R D F2 D2 L\' R2 B2 U B2 U2 B2 U\' F2 L2 U\' F2 U2', 0, 0, '2025-03-28 23:45:05'),
(52, 1, 1, 1, 11867, 'U2 F D2 R2 U2 L2 R2 B2 D2 B F2 U2 L\' U\' B R U2 B2 F R2 F2', 0, 0, '2025-03-28 23:45:05'),
(53, 1, 1, 1, 11258, 'U\' F L2 D2 R F2 B2 U F2 R2 U2 F2 L2 F R2 L2 B L2 D2 L2 D', 0, 0, '2025-03-28 23:45:05'),
(54, 1, 1, 1, 10873, 'U\' B D\' R2 D2 L\' F\' R2 U R2 U\' F2 U2 L2 U B2 U\' L2 D\' R', 0, 0, '2025-03-28 23:45:05'),
(55, 1, 1, 1, 11901, 'U R F B\' U2 L B R2 L B2 U2 B2 U2 R\' B2 L\' D2 R U2 D\'', 0, 0, '2025-03-28 23:45:05'),
(56, 1, 1, 1, 12298, 'R2 D2 B L\' U2 F B U\' L F\' D2 B\' D2 F2 L2 D2 F D2 B\' R2 F\'', 0, 0, '2025-03-28 23:45:05'),
(57, 1, 1, 1, 11797, 'U L\' U\' F B U L\' B\' R B2 U2 B2 R B2 L\' U2 R2 L\' D2 R\'', 0, 0, '2025-03-28 23:45:05'),
(65, 1, 1, 1, 9129, 'L2 U F R F\' U F2 R B L2 U\' B2 D\' F2 U2 L2 D L2 U2 B2 R', 0, 0, '2025-03-28 23:45:05'),
(66, 1, 1, 1, 11626, 'B\' U\' B D\' R\' F U\' L\' D R\' U\' L2 U F2 D B2 R2 U D\' R2 L2', 0, 0, '2025-03-28 23:45:05'),
(67, 1, 1, 1, 11612, 'U F R\' F L B2 R D B2 D2 B2 L2 F U2 D2 R2 F U2 B L\'', 0, 0, '2025-03-28 23:45:05'),
(68, 1, 1, 1, 11650, 'D\' F2 R2 U\' R2 D\' L2 U R2 F2 D2 R2 B R D\' U B2 F U\' R U\'', 0, 0, '2025-03-28 23:45:05'),
(69, 1, 1, 1, 13936, 'F2 D\' R2 B U2 L2 U2 L2 B\' R2 B2 U2 L2 F\' D B\' L U B2 F2 D\'', 0, 0, '2025-03-28 23:45:05'),
(70, 1, 1, 1, 12094, 'D\' R U2 D2 F2 U L F B L2 B\' R2 U2 B2 R2 B\' L2 F R U\' L', 0, 0, '2025-03-28 23:45:05'),
(71, 1, 1, 1, 10158, 'B\' D R\' D B D F L B U R\' F2 R\' B2 D2 L\' D2 L2 B2 U2 R2', 0, 0, '2025-03-28 23:45:05'),
(73, 1, 1, 1, 13381, 'D2 F2 L D L U2 R F2 U\' F2 D L2 U R2 U2 F2 D\' R2 U F D\'', 0, 0, '2025-03-29 00:32:23'),
(75, 1, 1, 1, 11404, 'D B\' R U D\' B\' U2 L\' F2 D R2 F2 B\' R2 U2 R2 D2 F\' R2 L2 D2', 0, 0, '2025-03-28 23:45:05'),
(77, 1, 1, 1, 9529, 'B D F L\' D2 L U F L2 U2 B2 L2 U\' R2 U\' B2 U R2 U R\'', 0, 0, '2025-03-28 23:45:05'),
(79, 1, 1, 1, 11735, 'U2 B\' U\' L U2 D\' R U2 R2 F R2 F B2 R2 F L2 B D2 L2 R F2', 0, 0, '2025-03-28 23:45:05'),
(80, 6, 1, 1, 460, '3Fw\' B 3Uw\' Fw Uw D\' L\' Lw2 Rw Dw2 Rw\' Dw\' Lw F\' Lw\' Dw Uw\' Rw2 3Rw2 Fw2 D\' Dw R Fw Bw2 Lw U\' Dw2 L\' R2 Fw\' D U D2 Dw2 R Uw\' F2 Rw2 Uw D2 Dw L\' F\' Lw\' F2 3Rw Dw R 3Uw\' D Rw Bw Dw R Fw2 D 3Rw\' 3Uw\' B2 3Uw\' Lw U B\' Bw2 R U R\' 3Fw\' R\' 3Uw D Lw Dw2 Uw2 3Rw\' U', 0, 0, '2025-03-28 22:58:09'),
(84, 1, 1, 5, 12086, 'R D2 F U R\' U L\' B R U2 F2 D F2 U\' L2 U R2 L2 D L2 D\'', 0, 0, '2025-03-30 16:22:40'),
(85, 1, 1, 5, 11645, 'F2 U R\' F\' R2 L U B2 R2 F\' U2 R2 F U2 R2 D2 L2 B2 R\'', 0, 0, '2025-03-30 16:23:10'),
(86, 1, 1, 5, 12915, 'F D R F\' R B2 D L\' F U2 R2 U2 F2 L2 B2 D L2 U\' F2 U\' R2', 0, 0, '2025-03-30 16:23:42'),
(87, 1, 1, 5, 8198, 'B2 D B R2 U\' R D\' F\' R U2 F2 L2 U\' B2 D\' R2 D L2 D\' F2 D\'', 0, 0, '2025-03-30 16:24:08'),
(88, 1, 1, 5, 8347, 'F2 B U L F2 B\' D\' R U\' R2 D2 R2 F2 U B2 D\' R2 L2 D\' B R\'', 0, 0, '2025-03-30 16:32:09'),
(89, 1, 1, 5, 10115, 'R2 D B2 U\' B L D\' U2 F2 B2 R L2 U2 B2 L\' D2 F2 R\' F2 B', 0, 0, '2025-03-30 16:32:34'),
(90, 1, 1, 5, 13066, 'F2 D\' R F\' B\' D2 R U2 L2 U\' B2 L2 F2 D2 R2 D L2 B2 D L F2', 0, 0, '2025-03-30 16:33:02'),
(91, 1, 1, 5, 12506, 'F2 R U F\' U B2 U B\' D\' F2 B2 D\' B2 L2 U\' B2 L2 D2 L', 0, 0, '2025-03-30 16:33:27'),
(92, 1, 1, 5, 11514, 'R2 B2 R D B\' U\' R D\' F2 U D2 F2 D\' F2 R2 F2 B2 D\' L2 R B', 0, 0, '2025-03-30 16:33:54'),
(93, 1, 1, 5, 10374, 'B\' L D2 L\' U\' F\' R D2 B\' F2 U2 R2 U B2 R2 F2 R2 D\' R2 B2 U\'', 0, 0, '2025-03-30 16:34:23'),
(94, 1, 1, 5, 12548, 'F\' R\' D\' B R\' B U\' R\' L\' D F2 B2 U2 L2 D\' F2 U\' R2 L2 D\' B', 0, 0, '2025-03-30 16:37:56'),
(95, 1, 1, 5, 12593, 'U\' R\' D\' B\' L D\' F U L2 U B2 U2 B2 R2 F2 D F2 B2 U', 0, 0, '2025-03-30 16:38:20'),
(96, 1, 1, 1, 17031, 'U L2 R2 U R2 U B2 D\' L2 U R2 B\' R D B F L R F\' R\' U', 0, 0, '2025-04-01 17:17:07'),
(97, 1, 1, 1, 14808, 'L2 B2 D\' B2 L2 D U R2 D\' L2 U2 B L2 R\' F D\' B D\' L B2 F2', 0, 0, '2025-04-01 17:17:36'),
(98, 1, 1, 1, 10969, 'B2 L\' B U\' R2 F2 U2 D F\' U2 F2 D R2 U\' B2 U F2 B2 U\' B2 U', 0, 0, '2025-04-01 17:18:01'),
(99, 1, 1, 1, 13174, 'D L B2 D2 R L2 U L2 B U2 F\' U2 L2 F2 U2 L2 B\' L2 B\' U\' F', 0, 0, '2025-04-01 17:18:31'),
(103, 3, 11, 13, 1046, 'R F L\' F\' U2 R F R2 U2 L2 U\'', 0, 0, '2025-04-02 18:55:36'),
(104, 1, 11, 13, 540, 'F L\' U\' D R\' D F L B\' D2 R F2 L B2 U2 F2 U2 R F2 B2 R', 0, 0, '2025-04-02 18:58:53'),
(105, 1, 11, 14, 763, 'D F\' U2 L F2 U2 L2 D2 L\' U2 R B2 U2 L F\' L\' D\' U F2 L\' U', 0, 0, '2025-04-02 18:59:28'),
(106, 1, 11, 14, 3188, 'F U\' R U2 B D\' F2 U2 L\' D2 B2 U2 B U2 R2 B\' U2 R2 L2 D2 R2', 0, 0, '2025-04-02 19:01:09'),
(107, 1, 11, 14, 2848, 'B2 U B\' U F2 R L\' F\' L\' F2 D2 R D2 F2 B2 L D2 L2 B2 U2', 0, 1, '2025-04-02 19:01:27'),
(108, 1, 11, 14, 880, 'R\' D B D2 L U\' B\' D2 L D2 F2 R2 B2 D L2 D\' B2 D F2 U B\'', 0, 0, '2025-04-02 19:09:54'),
(109, 1, 11, 14, 1409, 'U2 B\' D R\' U\' R2 F U\' L2 U2 F2 B2 R2 D2 F2 L2 D R2 U B\' R', 0, 0, '2025-04-02 19:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `solvetypes`
--

CREATE TABLE `solvetypes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `solvetypes`
--

INSERT INTO `solvetypes` (`id`, `name`) VALUES
(3, '222'),
(1, '333'),
(4, '444'),
(5, '555'),
(6, '666'),
(7, '777'),
(10, 'clock'),
(8, 'minx'),
(12, 'pyram'),
(11, 'skewb'),
(9, 'sq1');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`) VALUES
(1, 'Qczer', '3de0b54686b6d6c37247b7246a63e323c1c3456568fd1487d9e4b3f0ae3bed6f', 'mateuszkuczera2@gmail.com'),
(2, 'Dominik', 'c8f39371018d2892daad90b6d11b4f05007c22ee4871dd28e7a84b9ac440ae38', ''),
(9, 'Barburka', 'f0052dbaaff65c6f8684d7b3f593b9e4b2199eef6c000b932062cfdce526507e', 'barburka@gmail.com'),
(11, 'Dawidek', '3d2e985959795f2b97d908733edafbb78745e1fd55945b162400fabdd68ef55f', 'bartczak@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `solves`
--
ALTER TABLE `solves`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `Solves_fk1` (`typeId`),
  ADD KEY `sessionId` (`sessionId`),
  ADD KEY `fk_solves_users` (`userId`);

--
-- Indexes for table `solvetypes`
--
ALTER TABLE `solvetypes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `e-mail` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `solves`
--
ALTER TABLE `solves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `solvetypes`
--
ALTER TABLE `solvetypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `solves`
--
ALTER TABLE `solves`
  ADD CONSTRAINT `Solves_fk1` FOREIGN KEY (`typeId`) REFERENCES `solvetypes` (`id`),
  ADD CONSTRAINT `fk_solves_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `solves_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
