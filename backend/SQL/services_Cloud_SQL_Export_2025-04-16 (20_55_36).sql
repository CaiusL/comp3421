-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: mysql
-- ------------------------------------------------------
-- Server version	8.0.37-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `quiz`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `quiz` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `quiz`;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `question_text` text NOT NULL,
  `options` json NOT NULL,
  `correct_option` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (2,1,'What is 2 + 2?','[{\"id\": 1, \"text\": \"1\"}, {\"id\": 2, \"text\": \"2\"}, {\"id\": 3, \"text\": \"3\"}, {\"id\": 4, \"text\": \"4\"}]',4),(4,2,'Which number is prime?','[{\"id\": 1, \"text\": \"10\"}, {\"id\": 2, \"text\": \"15\"}, {\"id\": 3, \"text\": \"17\"}, {\"id\": 4, \"text\": \"20\"}]',3),(5,2,'What is 12 ÷ 4?','[{\"id\": 1, \"text\": \"2\"}, {\"id\": 2, \"text\": \"3\"}, {\"id\": 3, \"text\": \"4\"}, {\"id\": 4, \"text\": \"6\"}]',2),(6,2,'What is the capital of Japan?','[{\"id\": 1, \"text\": \"Tokyo\"}, {\"id\": 2, \"text\": \"Kyoto\"}, {\"id\": 3, \"text\": \"Osaka\"}]',1),(7,2,'Which of the following are prime numbers?','[{\"id\": 1, \"text\": \"7\"}, {\"id\": 2, \"text\": \"9\"}, {\"id\": 3, \"text\": \"11\"}, {\"id\": 4, \"text\": \"15\"}, {\"id\": 5, \"text\": \"17\"}]',1),(9,14,'1 ','[{\"id\": 1, \"text\": \"1\"}, {\"id\": 2, \"text\": \"1\"}, {\"id\": 3, \"text\": \"3\"}]',1),(10,15,'56+4','[{\"id\": 1, \"text\": \"60\"}, {\"id\": 2, \"text\": \"61\"}]',1);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `timer` int NOT NULL DEFAULT '60',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (1,'Math Quiz','2025-04-14 19:20:57',60),(2,'Math Quiz','2025-04-14 19:42:54',120),(14,'test 1 ','2025-04-15 19:03:24',4500),(15,'Math qui','2025-04-15 21:23:05',60);
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-16 12:56:20
