-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para sistema_pos
CREATE DATABASE IF NOT EXISTS `sistema_pos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_pos`;

-- Volcando estructura para tabla sistema_pos.almacenes
CREATE TABLE IF NOT EXISTS `almacenes` (
  `id_almacen` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `encargado` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_almacen`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.almacenes: ~3 rows (aproximadamente)
INSERT INTO `almacenes` (`id_almacen`, `nombre`, `direccion`, `telefono`, `encargado`, `activo`) VALUES
	(1, 'Almacén Central ggg', 'Calle 10 # 20-30, Bogotá', '6012345678', 'Carlos Pérez', 1),
	(2, 'Almacén Norte', 'Carrera 15 # 100-50, Bogotá', '6019876543', 'Laura Gómez', 1),
	(3, 'Almacén Sur', 'Av. Caracas # 45-60, Bogotá', '6015678901', 'Juan Martínez', 1);

-- Volcando estructura para tabla sistema_pos.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.categorias: ~5 rows (aproximadamente)
INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `activo`) VALUES
	(1, 'Bebidas', 'Todos los tipos de bebidas', 1),
	(2, 'Dulces', 'Productos de confitería y chocolates', 1),
	(3, 'Lácteos', 'Leche, quesos y derivados', 1),
	(4, 'Abarrotes', 'Productos básicos de despensa', 1),
	(5, 'Limpieza', 'Productos para limpieza y aseo', 1);

-- Volcando estructura para tabla sistema_pos.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.clientes: ~3 rows (aproximadamente)
INSERT INTO `clientes` (`id_cliente`, `nombre`, `telefono`, `direccion`, `correo`, `estado`, `fecha_registro`) VALUES
	(1, 'Juan Pérez', '3001234567', 'Calle 10 #5-20', 'juanperez@gmail.com', 1, '2025-05-12 04:12:47'),
	(2, 'Ana Gómez', '3012345678', 'Carrera 7 #45-89', 'anagomez@hotmail.com', 1, '2025-05-12 04:12:47'),
	(3, 'sfmksnnfks', '2553335', 'akdkakadadd', 'adadaa@gmail.com', 1, '2025-05-28 03:24:40');

-- Volcando estructura para tabla sistema_pos.compras
CREATE TABLE IF NOT EXISTS `compras` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_proveedor` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('completada','anulada') DEFAULT 'completada',
  PRIMARY KEY (`id_compra`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_proveedor` (`id_proveedor`) USING BTREE,
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.compras: ~1 rows (aproximadamente)
INSERT INTO `compras` (`id_compra`, `fecha`, `id_proveedor`, `id_usuario`, `total`, `estado`) VALUES
	(1, '2025-05-12 04:12:47', 1, 1, 100000.00, 'completada');

-- Volcando estructura para tabla sistema_pos.detalle_compra
CREATE TABLE IF NOT EXISTS `detalle_compra` (
  `id_detalle_compra` int NOT NULL AUTO_INCREMENT,
  `id_compra` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_detalle_compra`),
  KEY `id_compra` (`id_compra`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `inventario` (`id_inventario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.detalle_compra: ~2 rows (aproximadamente)
INSERT INTO `detalle_compra` (`id_detalle_compra`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
	(1, 1, 1, 20, 2000.00),
	(2, 1, 2, 20, 1500.00);

-- Volcando estructura para tabla sistema_pos.detalle_venta
CREATE TABLE IF NOT EXISTS `detalle_venta` (
  `id_detalle_venta` int NOT NULL AUTO_INCREMENT,
  `id_venta` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id_detalle_venta`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `inventario` (`id_inventario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.detalle_venta: ~5 rows (aproximadamente)
INSERT INTO `detalle_venta` (`id_detalle_venta`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `descuento`) VALUES
	(1, 1, 1, 1, 1500.00, 0.00),
	(2, 1, 5, 1, 8500.00, 0.00),
	(3, 2, 1, 1, 1500.00, 0.00),
	(4, 2, 5, 1, 8500.00, 0.00),
	(5, 2, 16, 1, 5000.00, 0.00);

-- Volcando estructura para tabla sistema_pos.inventario
CREATE TABLE IF NOT EXISTS `inventario` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `detalle` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `precio_mayorista` decimal(10,2) DEFAULT NULL,
  `cantidad_mayorista_minima` int DEFAULT NULL,
  `stock` int DEFAULT '0',
  `stock_minimo` int DEFAULT '0',
  `stock_maximo` int DEFAULT NULL,
  `unidad_medida` enum('UNIDAD','PAQUETE','PACA','CAJA','BULTO') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'UNIDAD',
  `ean_8` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ean_13` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `codigo_inventario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  `id_proveedor` int DEFAULT NULL,
  `id_almacen` int DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `comentarios` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ultima_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_inventario`) USING BTREE,
  UNIQUE KEY `ean_13_unique` (`ean_13`) USING BTREE,
  KEY `id_categoria` (`id_categoria`) USING BTREE,
  KEY `id_proveedor` (`id_proveedor`) USING BTREE,
  KEY `id_almacen` (`id_almacen`) USING BTREE,
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE SET NULL,
  CONSTRAINT `inventario_ibfk_3` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.inventario: ~23 rows (aproximadamente)
INSERT INTO `inventario` (`id_inventario`, `nombre`, `detalle`, `precio_venta`, `precio_compra`, `precio_mayorista`, `cantidad_mayorista_minima`, `stock`, `stock_minimo`, `stock_maximo`, `unidad_medida`, `ean_8`, `ean_13`, `codigo_inventario`, `id_categoria`, `id_proveedor`, `id_almacen`, `fecha_ingreso`, `fecha_vencimiento`, `activo`, `comentarios`, `ultima_actualizacion`) VALUES
	(1, 'GALLETAS TRAD SALTSSINAS PQ*60', '*200GR PQ*6 CJ*24', 1500.00, 1000.00, 900.00, 10, 100, 10, 200, 'PAQUETE', NULL, '7701234567890', NULL, 4, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-06-04 17:13:21'),
	(2, 'ARROZ ROA *5K', '*5K CJ*10', 20000.00, 15000.00, 14000.00, 5, 30, 5, 100, 'UNIDAD', NULL, '7709876543210', NULL, 3, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:43:06'),
	(3, 'AZÚCAR MORENA SAN CARLOS *1K', '*1K PC*15', 4500.00, 3500.00, 3200.00, 8, 50, 5, 150, 'UNIDAD', NULL, '7703456789123', NULL, 3, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:42:58'),
	(4, 'HARINA PAN BLANCA *1K ', '*1K PC*20', 3500.00, 2500.00, 2200.00, 12, 80, 10, 200, 'UNIDAD', NULL, '7701122334455', NULL, 3, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:40:49'),
	(5, 'ACEITE FINO GIRASOL *900ML ', '*900ML CJ*12', 8500.00, 6500.00, 6000.00, 6, 40, 5, 100, 'UNIDAD', NULL, '7705566778899', NULL, 2, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:46:19'),
	(6, 'PASTA SPAGHETTI 500G', '*500G PQ*10', 2500.00, 2000.00, 1800.00, 10, 70, 10, 200, 'PAQUETE', NULL, '7709988776655', NULL, 4, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:10'),
	(7, 'LECHE ENTERA ALQUERIA *1.1L', '*1.1L PC*6 ', 3200.00, 2700.00, 2500.00, 6, 60, 10, 150, 'CAJA', NULL, '7703344556677', NULL, 2, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:44:23'),
	(8, 'CAFÉ MOLIDO 250G', '*250G PQ*12', 9500.00, 8000.00, 7500.00, 12, 40, 5, 120, 'PAQUETE', NULL, '7702233445566', NULL, 5, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:18'),
	(9, 'JABÓN LAVAPLATOS 500ML', '*500ML BOT', 3000.00, 2500.00, 2300.00, 12, 100, 20, 300, 'UNIDAD', NULL, '7707788990011', NULL, 5, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:20'),
	(10, 'PAPEL HIGIÉNICO 4UND', '*4UND PQ', 6000.00, 4500.00, 4000.00, 8, 90, 10, 250, 'PAQUETE', NULL, '7706655443322', NULL, 5, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:24'),
	(11, 'CREMA DENTAL 100ML', '*100ML UNIDAD', 2500.00, 1800.00, 1600.00, 10, 80, 10, 200, 'UNIDAD', NULL, '7708899001122', NULL, 4, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:26'),
	(12, 'SAL REFINADA 1KG', '*1KG PQ*8', 2000.00, 1500.00, 1300.00, 8, 70, 10, 200, 'PAQUETE', NULL, '7701234432111', NULL, 3, 1, 1, '2025-05-27', NULL, 0, NULL, '2025-05-27 20:59:58'),
	(13, 'SARDINAS EN LATA', '*425GR CAJA*24', 4500.00, 3500.00, 3200.00, 24, 40, 5, 150, 'CAJA', NULL, '7705566001123', NULL, 2, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:32'),
	(14, 'FRIJOLES ROJOS 500G', '*500G PQ*10', 3500.00, 2800.00, 2600.00, 10, 60, 10, 200, 'PAQUETE', NULL, '7702233441144', NULL, 3, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:34'),
	(15, 'LENTEJAS 1KG', '*1KG PQ*6', 4000.00, 3200.00, 2900.00, 6, 80, 10, 250, 'PAQUETE', NULL, '7704455667788', NULL, 3, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:38'),
	(16, 'JUGO DE NARANJA 1L', '*1L BOT*6', 5000.00, 4000.00, 3700.00, 6, 50, 10, 150, 'CAJA', NULL, '7709988111222', NULL, 2, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:40'),
	(17, 'BEBIDA GASEOSA 2L', '*2L BOT*6', 4500.00, 3500.00, 3200.00, 6, 70, 10, 200, 'CAJA', NULL, '7701122557799', NULL, 2, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:43'),
	(18, 'GALLETAS CHOCOLATE 300G', '*300G PQ*8', 5200.00, 4200.00, 3900.00, 8, 60, 10, 150, 'PAQUETE', NULL, '7706655448877', NULL, 4, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:45'),
	(19, 'YOGURT NATURAL 500ML', '*500ML BOT*12', 4800.00, 3800.00, 3500.00, 12, 40, 5, 120, 'CAJA', NULL, '7709988773344', NULL, 2, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-27 19:32:48'),
	(20, 'QUESO CREMA 250G', '*250G PQ*12', 9500.00, 8000.00, 7500.00, 12, 30, 5, 100, 'PAQUETE', NULL, '7703344552233', NULL, 4, 1, 1, '2025-05-27', NULL, 0, NULL, '2025-05-27 20:59:30'),
	(21, 'GALLETAS TRAD SALTSSINAS PQ*6', '*200GR PQ*6 CJ*24', 1500.00, 1000.00, 900.00, 10, 100, 10, 200, 'PAQUETE', NULL, '7701234568890', NULL, 4, 1, 1, '2025-05-27', NULL, 1, NULL, '2025-05-28 02:59:03'),
	(22, 'ADADA', '', 5222.00, 522.00, 2555.00, 5, 50, 2, 50, 'UNIDAD', '', '51546121', '', 1, 1, 1, '2025-05-27', '2025-05-27', 1, '', '2025-05-28 03:22:52'),
	(24, 'SFSFS', '*1.1L PC*6 ', 600.00, 357.00, 500.00, 25, 24, 1, 40, 'UNIDAD', '', '5184681651', '', 1, 1, 1, '2025-05-28', '2025-05-28', 1, '', '2025-05-28 19:17:37');

-- Volcando estructura para tabla sistema_pos.pagos
CREATE TABLE IF NOT EXISTS `pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_venta` int DEFAULT NULL,
  `tipo_pago` enum('efectivo','tarjeta','transferencia') DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_venta` (`id_venta`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.pagos: ~2 rows (aproximadamente)
INSERT INTO `pagos` (`id_pago`, `id_venta`, `tipo_pago`, `monto`, `referencia`) VALUES
	(1, 1, 'tarjeta', 10000.00, 'TC-1'),
	(2, 2, 'tarjeta', 15000.00, 'TC-2');

-- Volcando estructura para tabla sistema_pos.proveedores
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.proveedores: ~3 rows (aproximadamente)
INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `direccion`, `telefono`, `correo`, `activo`) VALUES
	(1, 'Proveedor Aaaeeehty', 'Calle 1 # 10-20', '6011234567', 'proveedora@example.com', 1),
	(2, 'Proveedor B', 'Carrera 2 # 15-30', '6012345678', 'proveedorb@example.com', 1),
	(3, 'Proveedor C', 'Av. 3 # 20-40', '6013456789', 'proveedorc@example.com', 1);

-- Volcando estructura para tabla sistema_pos.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `rol` enum('admin','cajero') NOT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`correo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios: ~11 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `nombre`, `rol`, `correo`, `contraseña`, `estado`) VALUES
	(1, 'Admin Principal', 'admin', 'admin@pos.com', '1234hashed', 'activo'),
	(2, 'Carlos Cajero', 'cajero', 'carlos@pos.com', '5678hashed', 'activo'),
	(3, 'Carlos Cajero', 'cajero', 'cajero1@pos.com', '$2b$10$9D51TTrt/..1P3xS5S3nYOzyrL8/VU0lKQzUj2Kd7E4N1DGdqNuom', 'activo'),
	(4, 'Carlos Cajero', 'cajero', NULL, '$2b$10$ytcgUH6Eej5m720eneSkxumWZWA3ZlEefXe3F2OAgKxeg7at47igO', 'activo'),
	(5, 'Carlos Cajero', 'cajero', NULL, '$2b$10$BGpFeZkL67f8AW2vonpZ9.dFEBoI8dRCzYq3dB.9qSxKAXNHonVUC', 'activo'),
	(6, 'Carlos Cajero', 'cajero', NULL, '$2b$10$q4sVEJfvwrAsWe80rh2gaeInmKPpOUK3ZQHh.huAKnAMmJVFor/LG', 'activo'),
	(7, 'Admin2 Principal', 'admin', 'admin1@pos.com', '$2b$10$W/9QeKeiqhlHCbIR/YaYE.9cupypZCjurEKswzeznIWnbW4O7hDS2', 'activo'),
	(8, 'Admin2 Principal', 'admin', 'admin2@pos.com', '$2b$10$s5VVgkyPIExZ9e4Wcr0tt.sns8lFzHnIQvxDcL77I15BYuxixLZFK', 'activo'),
	(9, 'si Cajero', 'cajero', 'adminsi@pos.com', '$2b$10$tMg.HcMxwJWl6/e2U/VsZOpi61hl0tRvccVNT4Q0rhDq74M85wbsu', 'activo'),
	(10, 'Carlos Camila', 'cajero', 'danielyangu@gmail.com', '$2b$10$WOW50OjOf1LbGIFehIFrO.Rz4jrzGR4.wI556T7erl49H0QupsWhm', 'activo'),
	(11, 'xsdfs', 'cajero', 'danielyan@gmail.com', '$2b$10$lTjEKQLVjQiEA8mcJNPEpu4NfHeCuWNUTSejCmT9/dR3Vr7GeI3nK', 'activo');

-- Volcando estructura para tabla sistema_pos.ventas
CREATE TABLE IF NOT EXISTS `ventas` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_cliente` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('completada','anulada') DEFAULT 'completada',
  PRIMARY KEY (`id_venta`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas: ~2 rows (aproximadamente)
INSERT INTO `ventas` (`id_venta`, `fecha`, `id_cliente`, `id_usuario`, `total`, `estado`) VALUES
	(1, '2025-06-06 16:17:28', 1, 1, 10000.00, 'completada'),
	(2, '2025-06-06 16:42:39', 1, 1, 15000.00, 'completada');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
