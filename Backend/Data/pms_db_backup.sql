-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: pms_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hotels_table`
--

DROP TABLE IF EXISTS `hotels_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hotel_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `room_count` int NOT NULL DEFAULT '0',
  `active_users` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels_table`
--

LOCK TABLES `hotels_table` WRITE;
/*!40000 ALTER TABLE `hotels_table` DISABLE KEYS */;
INSERT INTO `hotels_table` VALUES (6,'Baradari','contact@hotel.com','+12345678900','Street address','Mumbai','India',50,0,1,'2026-01-15 14:08:57',0),(7,'Baradari','contact@hotel.com','+12345678900','Street address','Mumbai','India',50,0,1,'2026-01-15 14:09:35',0),(8,'Baradari','contact@hotel.com','+12345678900','Street address','Mumbai','India',50,0,1,'2026-01-15 14:09:48',0),(9,'Baradari','contact@hotel.com','+12345678900','Street address','Mumbai','India',50,0,1,'2026-01-15 14:10:53',0),(10,'Baradari','contact@hotel.com','+12345678900','Street address','Mumbai','India',50,0,1,'2026-01-16 14:40:25',0);
/*!40000 ALTER TABLE `hotels_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license_table`
--

DROP TABLE IF EXISTS `license_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `license_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hotel_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license_table`
--

LOCK TABLES `license_table` WRITE;
/*!40000 ALTER TABLE `license_table` DISABLE KEYS */;
INSERT INTO `license_table` VALUES (1,3,2,'2026-01-11','2026-02-10',1,'2026-01-05 14:39:24',0),(3,5,4,'2026-01-11','2026-02-10',1,'2026-01-05 14:39:49',0),(4,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:08:18',0),(5,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:09:06',0),(6,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:09:42',0),(7,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:36:58',0),(8,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:37:34',0),(9,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:37:53',0),(10,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:37:57',0),(11,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:38:02',0),(12,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 13:38:23',0),(13,5,4,'2026-01-11','2026-02-10',1,'2026-01-15 14:23:41',0),(14,5,4,'2026-01-11','2026-02-10',1,'2026-01-16 12:30:40',0);
/*!40000 ALTER TABLE `license_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_table`
--

DROP TABLE IF EXISTS `plan_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(20) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `subscription_type` varchar(45) NOT NULL,
  `duration_days` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL,
  `max_rooms` int DEFAULT NULL,
  `max_users` int DEFAULT NULL,
  `include_modules` varchar(40) DEFAULT NULL,
  `trial_eligible` tinyint(1) DEFAULT '0',
  `auto_renew` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '0',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_table`
--

LOCK TABLES `plan_table` WRITE;
/*!40000 ALTER TABLE `plan_table` DISABLE KEYS */;
INSERT INTO `plan_table` VALUES (1,'Gold','Premium plan','Yearly',365,5000.00,'INR',50,25,'dashboard,booking,reports',0,0,0,0),(2,'Gold1','Premium plan','Monthly',30,1000.00,'USD',50,10,'dashboard,booking,reports',1,0,1,0),(3,'Gold1222','Premium plan','Monthly',30,1000.00,'USD',50,10,'dashboard,booking,reports',1,0,1,1),(4,'Golden1','Premium plan','Monthly',30,1000.00,'USD',50,10,'dashboard,booking,reports',1,0,1,0),(6,'Golden22','Premium plan','Yearly',365,5000.00,'INR',50,25,'dashboard,booking,reports',0,0,0,0),(7,'Golden22','Premium plan','Yearly',365,5000.00,'INR',50,25,'dashboard,booking,reports',0,0,0,0),(8,'Gold','Premium plan','Yearly',365,5000.00,'INR',50,25,'0,1,2',1,0,1,0),(9,'Gold','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(10,'Gold','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(11,'Gold','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(12,'Gold','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(13,'Gold','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(18,'Gold','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(19,'Gold (Copy)','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(20,'Gold (Copy)','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0),(21,'Gold (Copy)','Premium plan','Yearly',365,2000.00,'INR',50,25,'0,1,2',1,0,1,0);
/*!40000 ALTER TABLE `plan_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@test.com','$2a$10$8sdjhs7dshd7sd8sd8sd8sd...','Admin',1,NULL,NULL),(2,'soheb@gmail.com','$2b$10$YJ9kI1dfAOmXv5IVlu.Z2.6DmdOYTyBbNZVAp5JThmHQRgNLQDpTe','Soheb',1,NULL,NULL),(3,'soheb1@gmail.com','$2b$10$tDfBXyTxzd3fkJUlNy3L6.m997Oc4QnPOa7dm.tEM6rHMXoJN0QF6','Soheb1',1,NULL,NULL),(4,'soheb25@gmail.com','$2b$10$ATD4PDisBaLLN9idGQ3q.OAo6Bxkkit9Nc9zUid.BFxB1qIropna2','Soheb2',1,NULL,NULL),(5,'soheb28@gmail.com','$2b$10$6f7tqn6FLHJ6hnun064hB.ZB.pi3oGknAoRsFmGOEIZcmTAILv0n2','Soheb2',1,NULL,NULL),(6,'soheb281@gmail.com','$2b$10$LA3H9pPFSJcPDAIgGjMere.ku7dcFP/FaRv.DtJ4SPUL5E7MVik8W','Soheb2',1,NULL,NULL),(7,'test123@gmail.com','$2b$10$ilpZ96pFo2ZlqJIoArquuuEPgmmhQclMEB5gWz.0TNt5cWkXvGhLW','Soheb2',1,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-16 15:10:52
