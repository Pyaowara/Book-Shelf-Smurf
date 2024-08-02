-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3308
-- Generation Time: Aug 02, 2024 at 06:14 PM
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
-- Database: `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `users_info`
--

CREATE TABLE `users_info` (
  `id_users` int(11) NOT NULL,
  `users_email` varchar(255) NOT NULL,
  `users_username` varchar(255) NOT NULL,
  `users_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_info`
--

INSERT INTO `users_info` (`id_users`, `users_email`, `users_username`, `users_password`) VALUES
(1, 'pongpisut@itkmitl.ac.th', 'pongpisut', '$2b$10$MbLU7rkdk.UWqNu/Ri1xUuzFOEF2ffJZot7hLx.L2.//kd1BUIylW'),
(2, 'flook@kmutt.ac.th', 'flookflick', '$2b$10$MBGak/kTX6wg4sZJJA40POJSyYhPQ0HACSIgk1GEYC8wVu41O5J/a'),
(3, 'supakit.net', 'supakit', '$2b$10$RJhi15sTsN4NIl8Fj7upF.ofrTyfcmhF4j5bUWcmN7Phs6yJHYTfe'),
(13, 'suksan', 'suksan', '$2b$10$ybn0nqdfs5oh9LT2D7EOwuK.AiFUG6W9QmnOqaZ7m5KtPFklpQO5W'),
(14, 'test01', 'test01', '$2b$10$BGDsCTIAAVKKQlME59wR.eDfc8QTBp1MD0y9tluLnY.d7qFZ..v1a'),
(16, 'test02', 'test02', '$2b$10$WRMN7EyaKvQuy7NeEo3nwe/F31vH5pYcdbhWcbgZzoVHCcrwEl51u'),
(26, '333', 'suksan333', '$2b$10$5i2obJYmEm3.4tdKpuutEOpoQu3OKBKHOCXcgY17mmYi2Km/j/8JO'),
(27, 'khoaw', 'khoaw', '$2b$10$BmPRhAUtJLoc96yRpN3b8eXZNefel8DZ7vtlSiAp6CHcuMr7BBGqy'),
(28, 'prayut@gmail.com', 'prayut', '$2b$10$Jxu3IcoyAspycMDd0xoelOUrWDd2guM1Ozp9a5b88gWM6.ZbFyCOO');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users_info`
--
ALTER TABLE `users_info`
  ADD PRIMARY KEY (`id_users`),
  ADD UNIQUE KEY `users_username` (`users_username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users_info`
--
ALTER TABLE `users_info`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
