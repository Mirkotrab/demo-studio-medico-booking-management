/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.5-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: medcare
-- ------------------------------------------------------
-- Server version	11.4.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Current Database: `medcare`
--

/*!40000 DROP DATABASE IF EXISTS `medcare`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `medcare` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci */;

USE `medcare`;

--
-- Table structure for table `medico`
--

DROP TABLE IF EXISTS `medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `medico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `data_nascita` date NOT NULL,
  `codice_fiscale` varchar(17) NOT NULL,
  `data_laurea` date NOT NULL,
  `id_specialita` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_specialita` (`id_specialita`),
  CONSTRAINT `medico_ibfk_1` FOREIGN KEY (`id_specialita`) REFERENCES `specialita` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medico`
--

LOCK TABLES `medico` WRITE;
/*!40000 ALTER TABLE `medico` DISABLE KEYS */;
INSERT INTO `medico` VALUES
(1,'Giovanni','Rossi','1980-05-15','RSSGNN80E15H501Z','2005-07-20',1),
(2,'Maria','Bianchi','1990-08-22','BNCMRA90M62F205X','2012-10-15',2),
(3,'Luca','Verdi','1985-11-30','VRDLCA85S10Z404Y','2010-06-30',3),
(4,'Anna','Neri','1975-03-10','NRNANNA75C50Z404W','2000-03-12',4),
(5,'Marco','Gialli','1982-07-25','GLLMRC82L15Z404X','2008-09-18',5);
/*!40000 ALTER TABLE `medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paziente`
--

DROP TABLE IF EXISTS `paziente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `paziente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `data_nascita` date NOT NULL,
  `codice_fiscale` varchar(17) NOT NULL,
  `provincia` varchar(50) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paziente`
--

LOCK TABLES `paziente` WRITE;
/*!40000 ALTER TABLE `paziente` DISABLE KEYS */;
INSERT INTO `paziente` VALUES
(1,'Alessandro','Luca','1990-05-20','LCALSS90E15H501Y','Milano','alessandro_l','password123'),
(2,'Elena','Rossi','1985-03-10','RSSLNA85C50Z404M','Roma','elena_rossi','mypassword456'),
(3,'Francesco','Bianchi','1988-12-12','BNCFNC88T12F205W','Napoli','francesco_b','securepass789'),
(4,'Sara','Verde','1995-07-15','VRDSRA95M55F205Z','Torino','sara_verde','password987'),
(5,'Giulia','Gialli','1992-02-18','GLLGLL92B58F205P','Venezia','giulia_gialli','password1234');
/*!40000 ALTER TABLE `paziente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `problematica`
--

DROP TABLE IF EXISTS `problematica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `problematica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descrizione` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problematica`
--

LOCK TABLES `problematica` WRITE;
/*!40000 ALTER TABLE `problematica` DISABLE KEYS */;
INSERT INTO `problematica` VALUES
(1,'Ipertensione','Aumento cronico della pressione sanguigna.'),
(2,'Diabete','Disturbo metabolico caratterizzato da elevati livelli di glucosio nel sangue.'),
(3,'Psoriasi', 'Malattia della pelle che causa squame e lesioni.'),
(4,'Osteoporosi','Malattia caratterizzata da ossa fragili e suscettibili a fratture.'),
(5,'Emicrania', 'Mal di testa forte con nausea e sensibilità alla luce.');
/*!40000 ALTER TABLE `problematica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialita`
--

DROP TABLE IF EXISTS `specialita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialita` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `prezzo` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialita`
--

LOCK TABLES `specialita` WRITE;
/*!40000 ALTER TABLE `specialita` DISABLE KEYS */;
INSERT INTO `specialita` VALUES
(1,'Cardiologia',100.00),
(2,'Oculistica',90.00),
(3,'Dermatologia',80.00),
(4,'Ortopedia',70.00),
(5,'Neurologia',110.00);
/*!40000 ALTER TABLE `specialita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storico_problematica`
--

DROP TABLE IF EXISTS `storico_problematica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `storico_problematica` (
  `id_paziente` int(11) NOT NULL,
  `id_problematica` int(11) NOT NULL,
  `data_insorgenza` date DEFAULT NULL,
  PRIMARY KEY (`id_paziente`,`id_problematica`),
  KEY `id_problematica` (`id_problematica`),
  CONSTRAINT `storico_problematica_ibfk_1` FOREIGN KEY (`id_paziente`) REFERENCES `paziente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `storico_problematica_ibfk_2` FOREIGN KEY (`id_problematica`) REFERENCES `problematica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storico_problematica`
--

LOCK TABLES `storico_problematica` WRITE;
/*!40000 ALTER TABLE `storico_problematica` DISABLE KEYS */;
INSERT INTO `storico_problematica` VALUES
(1,1,'2022-03-10'),
(1,4,'2021-06-15'),
(2,2,'2019-08-22'),
(3,3,'2020-02-17'),
(4,5,'2023-01-10');
/*!40000 ALTER TABLE `storico_problematica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visita`
--

DROP TABLE IF EXISTS `visita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `visita` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_paziente` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `data` date NOT NULL,
  `ora_inizio` time NOT NULL,
  `effettuata` enum('si','no') NOT NULL DEFAULT 'no',
  `saldo` enum('si','no') NOT NULL DEFAULT 'no',
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_medico` (`id_medico`),
  KEY `id_paziente` (`id_paziente`),
  CONSTRAINT `visita_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `visita_ibfk_2` FOREIGN KEY (`id_paziente`) REFERENCES `paziente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visita`
--

LOCK TABLES `visita` WRITE;
/*!40000 ALTER TABLE `visita` DISABLE KEYS */;
INSERT INTO `visita` VALUES
(1,1,1,'2025-05-01','10:00:00','si','si','Controllo cardiologico, prossimo controllo fra 6 mesi.'),
(2,2,2,'2025-05-10','11:00:00','si','si','Visita per controllo della vista, appuntamento tra 3 mesi.'),
(3,3,3,'2025-05-15','09:00:00','si','no',NULL),
(4,4,4,'2025-05-20','14:00:00','no','no','Visita per problemi articolari, programma riabilitativo avviato.'),
(5,5,5,'2025-05-25','16:00:00','no','no','Controllo neurologico, esami da ripetere fra 6 mesi.');
/*!40000 ALTER TABLE `visita` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-05-17  8:27:29
