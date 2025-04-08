-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 08, 2025 at 08:44 AM
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
-- Table structure for table `Bookings`
--

CREATE TABLE `Bookings` (
  `id` varchar(255) NOT NULL,
  `ride_id` int NOT NULL,
  `user_id` int NOT NULL,
  `seats_booked` int NOT NULL,
  `booking_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Bookings`
--

INSERT INTO `Bookings` (`id`, `ride_id`, `user_id`, `seats_booked`, `booking_date`, `status`) VALUES
('BKG1750', 1, 1, 1, '2025-04-08 08:30:59', 'pending'),
('BKG2895', 2, 1, 1, '2025-04-08 08:33:41', 'pending'),
('BKG5746', 2, 1, 2, '2025-04-08 08:35:22', 'pending'),
('BKG8801', 1, 1, 1, '2025-04-08 08:33:24', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `Rides`
--

CREATE TABLE `Rides` (
  `id` int NOT NULL,
  `start_location` varchar(255) DEFAULT NULL,
  `end_location` varchar(255) DEFAULT NULL,
  `ride_date` date DEFAULT NULL,
  `ride_time` time DEFAULT NULL,
  `seats_available` int DEFAULT NULL,
  `cost_per_seat` decimal(5,2) DEFAULT NULL,
  `driver_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Rides`
--

INSERT INTO `Rides` (`id`, `start_location`, `end_location`, `ride_date`, `ride_time`, `seats_available`, `cost_per_seat`, `driver_name`) VALUES
(1, 'Roehampton University', 'Baker Street, London', '2025-04-15', '08:30:00', 1, 12.50, 'John Doe'),
(2, 'Borough Market, London', 'Roehampton University', '2025-04-16', '14:00:00', 1, 15.00, 'Sarah Smith'),
(3, 'Victoria Station, London', 'Roehampton University', '2025-04-17', '18:15:00', 2, 10.00, 'David Green'),
(4, 'Roehampton university', 'Putney bridge', '2025-04-10', '14:36:00', 4, 3.00, 'Saeed uthman');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `email`, `password`, `phone`, `name`) VALUES
(1, 'hasen6422@gmail.com', '$2b$10$/d0V2AqzhvANRRHw4LEqxOGXPofBDnR83dc3gmU6Q5krgZ60jFBMK', '', 'Hassen Jemal');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Bookings`
--
ALTER TABLE `Bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Rides`
--
ALTER TABLE `Rides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Rides`
--
ALTER TABLE `Rides`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Bookings`
--
ALTER TABLE `Bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `Rides` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
