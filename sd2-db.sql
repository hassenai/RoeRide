-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 13, 2025 at 02:15 PM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Booking`
--

CREATE TABLE `Booking` (
  `id` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Booking`
--

INSERT INTO `Booking` (`id`, `name`) VALUES
('BKG001', 'Single Ride'),
('BKG002', 'Round Trip'),
('BKG003', 'Monthly Pass'),
('BKG004', 'VIP Service');

-- --------------------------------------------------------

--
-- Table structure for table `Drivers`
--

CREATE TABLE `Drivers` (
  `code` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Drivers`
--

INSERT INTO `Drivers` (`code`, `name`) VALUES
('DRV001', 'Ali Khan'),
('DRV002', 'John Smith'),
('DRV003', 'Emily Davis'),
('DRV004', 'Michael Brown'),
('DRV005', 'Sophia Patel'),
('DRV006', 'Omar Hassan'),
('DRV007', 'Aisha Rahman'),
('DRV008', 'James Lee'),
('DRV009', 'Emma Wilson');

-- --------------------------------------------------------

--
-- Table structure for table `Rides`
--

CREATE TABLE `Rides` (
  `id` varchar(8) NOT NULL,
  `booking_id` varchar(10) DEFAULT NULL,
  `driver_code` varchar(10) DEFAULT NULL,
  `user_id` varchar(10) DEFAULT NULL,
  `start_location` varchar(50) DEFAULT NULL,
  `end_location` varchar(50) DEFAULT NULL,
  `ride_purpose` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Rides`
--

INSERT INTO `Rides` (`id`, `booking_id`, `driver_code`, `user_id`, `start_location`, `end_location`, `ride_purpose`) VALUES
('RID001', 'BKG002', 'DRV002', 'USR005', 'Subway Station', 'City Center', 'Business Trip'),
('RID002', 'BKG004', 'DRV005', 'USR006', 'Hotel Lobby', 'Grand Theatre', 'Leisure Travel'),
('RID003', 'BKG001', 'DRV007', 'USR003', 'Residential Area', 'Shopping Mall', 'Grocery Shopping'),
('RID004', 'BKG003', 'DRV009', 'USR001', 'Train Terminal', 'Business District', 'Work Commute');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`) VALUES
('USR001', 'David Parker'),
('USR002', 'Sarah Connor'),
('USR003', 'Robert Johnson'),
('USR004', 'Linda Nguyen'),
('USR005', 'Carlos Mendes'),
('USR006', 'Hina Malik');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Booking`
--
ALTER TABLE `Booking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Drivers`
--
ALTER TABLE `Drivers`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `Rides`
--
ALTER TABLE `Rides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `driver_code` (`driver_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Rides`
--
ALTER TABLE `Rides`
  ADD CONSTRAINT `rides_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `Booking` (`id`),
  ADD CONSTRAINT `rides_ibfk_2` FOREIGN KEY (`driver_code`) REFERENCES `Drivers` (`code`),
  ADD CONSTRAINT `rides_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
