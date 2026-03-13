-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 11 mars 2026 à 17:35
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `eval_api`
--

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE DATABASE IF NOT EXISTS `eval_api` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `eval_api`;

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) DEFAULT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `email`, `mot_de_passe`, `isAdmin`) VALUES
(1, 'admin@email.com', '$2b$10$9YlBXEMrD/SYQ8m4tAHyNe9eeF2v.eo6By0hYov3Pv3rxkf03XR2S', 1),
(2, 'user@email.com', '$2b$10$.6jqc7JxrVh8y3YzWXzLjuqd9HQ8rDoCeb6PVmln.vBQsr0/hchU2', 0);

-- --------------------------------------------------------

--
-- Structure de la table `tables_restaurant`
--

DROP TABLE IF EXISTS `tables_restaurant`;
CREATE TABLE IF NOT EXISTS `tables_restaurant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` int NOT NULL,
  `capacite` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tables_restaurant`
--

INSERT INTO `tables_restaurant` (`id`, `numero`, `capacite`) VALUES
(1, 1, 2),
(2, 2, 2),
(3, 3, 4),
(4, 4, 6),
(5, 5, 10);

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `number_of_people` int NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `note` text,
  `statut` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `name`, `phone`, `number_of_people`, `date`, `time`, `note`, `statut`, `date_creation`) VALUES
(1, 1, 'Jean Dupont', '0785730498', 5, '2026-03-20', '19:00:00', 'Anniversaire', 'pending', '2026-03-11 17:14:11'),
(2, 2, 'Marie Martin', '0612345678', 2, '2026-03-21', '20:00:00', 'Dîner romantique', 'confirmed', '2026-03-11 17:29:24');

-- --------------------------------------------------------

--
-- Structure de la table `reservation_tables`
--

DROP TABLE IF EXISTS `reservation_tables`;
CREATE TABLE IF NOT EXISTS `reservation_tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_id` int DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_id` (`reservation_id`),
  KEY `table_id` (`table_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation_tables`
--

INSERT INTO `reservation_tables` (`id`, `reservation_id`, `table_id`) VALUES
(1, 1, 3),
(2, 1, 4),
(3, 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `menu`
--

DROP TABLE IF EXISTS `menu`;
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text,
  `prix` decimal(6,2) NOT NULL,
  `categorie` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `menu`
--

INSERT INTO `menu` (`id`, `nom`, `description`, `prix`, `categorie`) VALUES
(1, 'Salade César', 'Salade romaine, poulet grillé, parmesan, croûtons', 12.50, 'entrée'),
(2, 'Soupe à l\'oignon', 'Soupe gratinée traditionnelle', 8.00, 'entrée'),
(3, 'Steak frites', 'Entrecôte grillée avec frites maison', 22.00, 'plat'),
(4, 'Saumon grillé', 'Pavé de saumon avec légumes de saison', 19.50, 'plat'),
(5, 'Tiramisu', 'Tiramisu classique au café', 9.00, 'dessert'),
(6, 'Crème brûlée', 'Crème brûlée à la vanille', 8.50, 'dessert');

-- --------------------------------------------------------

--
-- Structure de la table `creneaux`
--

DROP TABLE IF EXISTS `creneaux`;
CREATE TABLE IF NOT EXISTS `creneaux` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jour` varchar(10) NOT NULL,
  `heure_ouverture` time NOT NULL,
  `heure_fermeture` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `creneaux`
--

INSERT INTO `creneaux` (`id`, `jour`, `heure_ouverture`, `heure_fermeture`) VALUES
(1, 'lundi', '11:30:00', '14:30:00'),
(2, 'lundi', '18:30:00', '22:30:00'),
(3, 'mardi', '11:30:00', '14:30:00'),
(4, 'mardi', '18:30:00', '22:30:00'),
(5, 'mercredi', '11:30:00', '14:30:00'),
(6, 'mercredi', '18:30:00', '22:30:00');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
