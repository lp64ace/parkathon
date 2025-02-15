CREATE DATABASE IF NOT EXISTS `parkathon` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `parkathon`;

-- Drop existing tables
DROP TABLE IF EXISTS `parking`;
DROP TABLE IF EXISTS `destination`;
DROP TABLE IF EXISTS `user`;

-- Table structure for 'user'
CREATE TABLE `user` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(250) NOT NULL,
  `email` VARCHAR(250) NOT NULL,
  `password` TEXT NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for 'destination'
CREATE TABLE `destination` (
  `destination_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `lat` DECIMAL(10,7) NOT NULL,
  `long` DECIMAL(10,7) NOT NULL,
  `visited` INT(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`destination_id`),
  CONSTRAINT `fk_destination_user` FOREIGN KEY (`user_id`) 
  REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for 'parking'
CREATE TABLE `parking` (
  `parking_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `lat` DECIMAL(10,7) NOT NULL,
  `long` DECIMAL(10,7) NOT NULL,
  `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `end_time` TIMESTAMP NULL DEFAULT NULL,
  `weather` ENUM('Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Foggy') DEFAULT NULL,
  PRIMARY KEY (`parking_id`),
  CONSTRAINT `fk_parking_user` FOREIGN KEY (`user_id`) 
  REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
