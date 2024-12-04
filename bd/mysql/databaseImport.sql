-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 03-12-2024 a las 08:34:44
-- Versión del servidor: 8.0.40-0ubuntu0.22.04.1
-- Versión de PHP: 8.2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `a20erigomvil_projecteAssociacions`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ASSOCIACIO`
--

CREATE TABLE `ASSOCIACIO` (
  `id` int NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `descripcio` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `ASSOCIACIO`
--

INSERT INTO `ASSOCIACIO` (`id`, `nom`, `descripcio`) VALUES
(1, 'Associació Cultural', 'Promoció de la cultura local'),
(2, 'Associació Esportiva', 'Foment de l\'esport en comunitat');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `COMENTARI`
--

CREATE TABLE `COMENTARI` (
  `id` int NOT NULL,
  `autor` int DEFAULT NULL,
  `idProp` int DEFAULT NULL,
  `contingut` text,
  `actiu` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `COMENTARI`
--

INSERT INTO `COMENTARI` (`id`, `autor`, `idProp`, `contingut`, `actiu`) VALUES
(1, 2, 1, 'M\'agrada aquesta idea!', 1),
(2, 1, 2, 'Crec que necessitem més informació.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ESDEVENIMENT`
--

CREATE TABLE `ESDEVENIMENT` (
  `id` int NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `tipus` varchar(255) DEFAULT NULL,
  `adreca` varchar(255) DEFAULT NULL,
  `idAsso` int DEFAULT NULL,
  `descripcio` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `ESDEVENIMENT`
--

INSERT INTO `ESDEVENIMENT` (`id`, `nom`, `data`, `tipus`, `adreca`, `idAsso`, `descripcio`) VALUES
(1, 'Torneig de futbol', '2024-12-10', 'Esportiu', 'Camp municipal', 2, 'Competició de futbol per equips locals'),
(2, 'Concert de música', '2024-12-15', 'Cultural', 'Plaça Major', 1, 'Concert amb artistes locals');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ESDEVENIMENT_USUARI`
--

CREATE TABLE `ESDEVENIMENT_USUARI` (
  `idEsde` int NOT NULL,
  `idUsu` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `ESDEVENIMENT_USUARI`
--

INSERT INTO `ESDEVENIMENT_USUARI` (`idEsde`, `idUsu`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `NOTICIA`
--

CREATE TABLE `NOTICIA` (
  `id` int NOT NULL,
  `titol` varchar(255) DEFAULT NULL,
  `subtitol` varchar(255) DEFAULT NULL,
  `contingut` text,
  `imatge` varchar(255) DEFAULT NULL,
  `autor` int DEFAULT NULL,
  `idAsso` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `NOTICIA`
--

INSERT INTO `NOTICIA` (`id`, `titol`, `subtitol`, `contingut`, `imatge`, `autor`, `idAsso`) VALUES
(1, 'Nova normativa', 'Canvis en la normativa local', 'Es prohibeix l\'ús de plàstics d\'un sol ús.', 'noticia1.jpg', 1, 1),
(2, 'Èxit del torneig', 'Gran participació en el torneig', 'Més de 10 equips van competir al torneig de futbol.', 'noticia2.jpg', 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PROPOSTA`
--

CREATE TABLE `PROPOSTA` (
  `id` int NOT NULL,
  `titol` varchar(255) DEFAULT NULL,
  `subtitol` varchar(255) DEFAULT NULL,
  `contingut` text,
  `autor` int DEFAULT NULL,
  `idAsso` int DEFAULT NULL,
  `data` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `PROPOSTA`
--

INSERT INTO `PROPOSTA` (`id`, `titol`, `subtitol`, `contingut`, `autor`, `idAsso`, `data`) VALUES
(1, 'Millores al parc', 'Proposta per a millorar el parc', 'Augmentar zones verdes i afegir bancs.', 1, 1, '2024-12-01'),
(2, 'Festes locals', 'Organització de festes populars', 'Planificar un calendari de festes locals anuals.', 2, 2, '2024-12-02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `USUARI`
--

CREATE TABLE `USUARI` (
  `id` int NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `cognoms` varchar(255) DEFAULT NULL,
  `contrasenya` varchar(255) DEFAULT NULL,
  `correu` varchar(255) DEFAULT NULL,
  `imatge` varchar(255) DEFAULT NULL,
  `permisos` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `USUARI`
--

INSERT INTO `USUARI` (`id`, `nom`, `cognoms`, `contrasenya`, `correu`, `imatge`, `permisos`) VALUES
(1, 'Joan', 'Garcia', 'pass123', 'joan@example.com', 'joan.jpg', 'admin'),
(2, 'Maria', 'Lopez', 'pass456', 'maria@example.com', 'maria.jpg', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ASSOCIACIO`
--
ALTER TABLE `ASSOCIACIO`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `COMENTARI`
--
ALTER TABLE `COMENTARI`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor` (`autor`),
  ADD KEY `idProp` (`idProp`);

--
-- Indices de la tabla `ESDEVENIMENT`
--
ALTER TABLE `ESDEVENIMENT`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idAsso` (`idAsso`);

--
-- Indices de la tabla `ESDEVENIMENT_USUARI`
--
ALTER TABLE `ESDEVENIMENT_USUARI`
  ADD PRIMARY KEY (`idEsde`,`idUsu`),
  ADD KEY `idUsu` (`idUsu`);

--
-- Indices de la tabla `NOTICIA`
--
ALTER TABLE `NOTICIA`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor` (`autor`),
  ADD KEY `idAsso` (`idAsso`);

--
-- Indices de la tabla `PROPOSTA`
--
ALTER TABLE `PROPOSTA`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor` (`autor`),
  ADD KEY `idAsso` (`idAsso`);

--
-- Indices de la tabla `USUARI`
--
ALTER TABLE `USUARI`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ASSOCIACIO`
--
ALTER TABLE `ASSOCIACIO`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `COMENTARI`
--
ALTER TABLE `COMENTARI`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ESDEVENIMENT`
--
ALTER TABLE `ESDEVENIMENT`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `NOTICIA`
--
ALTER TABLE `NOTICIA`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `PROPOSTA`
--
ALTER TABLE `PROPOSTA`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `USUARI`
--
ALTER TABLE `USUARI`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `COMENTARI`
--
ALTER TABLE `COMENTARI`
  ADD CONSTRAINT `COMENTARI_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `USUARI` (`id`),
  ADD CONSTRAINT `COMENTARI_ibfk_2` FOREIGN KEY (`idProp`) REFERENCES `PROPOSTA` (`id`);

--
-- Filtros para la tabla `ESDEVENIMENT`
--
ALTER TABLE `ESDEVENIMENT`
  ADD CONSTRAINT `ESDEVENIMENT_ibfk_1` FOREIGN KEY (`idAsso`) REFERENCES `ASSOCIACIO` (`id`);

--
-- Filtros para la tabla `ESDEVENIMENT_USUARI`
--
ALTER TABLE `ESDEVENIMENT_USUARI`
  ADD CONSTRAINT `ESDEVENIMENT_USUARI_ibfk_1` FOREIGN KEY (`idEsde`) REFERENCES `ESDEVENIMENT` (`id`),
  ADD CONSTRAINT `ESDEVENIMENT_USUARI_ibfk_2` FOREIGN KEY (`idUsu`) REFERENCES `USUARI` (`id`);

--
-- Filtros para la tabla `NOTICIA`
--
ALTER TABLE `NOTICIA`
  ADD CONSTRAINT `NOTICIA_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `USUARI` (`id`),
  ADD CONSTRAINT `NOTICIA_ibfk_2` FOREIGN KEY (`idAsso`) REFERENCES `ASSOCIACIO` (`id`);

--
-- Filtros para la tabla `PROPOSTA`
--
ALTER TABLE `PROPOSTA`
  ADD CONSTRAINT `PROPOSTA_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `USUARI` (`id`),
  ADD CONSTRAINT `PROPOSTA_ibfk_2` FOREIGN KEY (`idAsso`) REFERENCES `ASSOCIACIO` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
