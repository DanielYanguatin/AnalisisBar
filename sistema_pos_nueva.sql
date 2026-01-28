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
  `id_empresa` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_almacen`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `almacenes_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.almacenes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.cierres_caja
CREATE TABLE IF NOT EXISTS `cierres_caja` (
  `id_cierre` int NOT NULL AUTO_INCREMENT,
  `id_almacen` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_apertura` datetime NOT NULL,
  `fecha_cierre` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_ventas` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_pagos_creditos` int DEFAULT NULL COMMENT 'Cantidad de pagos recibidos por créditos',
  `total_creditos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_tarjetas` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_transferencias` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_otros` decimal(12,2) NOT NULL DEFAULT '0.00',
  `diferencia` decimal(12,2) NOT NULL DEFAULT '0.00',
  `id_serie_facturas` int DEFAULT NULL,
  `factura_inicial` bigint DEFAULT NULL,
  `factura_final` bigint DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_cierre`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_serie_facturas` (`id_serie_facturas`),
  KEY `id_almacen` (`id_almacen`) USING BTREE,
  CONSTRAINT `cierres_caja_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `cierres_caja_ibfk_2` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cierres_caja_ibfk_3` FOREIGN KEY (`id_serie_facturas`) REFERENCES `series_facturacion` (`id_serie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.cierres_caja: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.compras
CREATE TABLE IF NOT EXISTS `compras` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_tercero` int NOT NULL COMMENT 'Proveedor',
  `id_usuario` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `numero_documento` varchar(50) DEFAULT NULL,
  `tipo_documento` enum('FACTURA_ELECTRONICA','FACTURA','NOTA_CREDITO','NOTA_DEBITO','RECIBO') NOT NULL DEFAULT 'FACTURA_ELECTRONICA',
  `subtotal` decimal(12,2) NOT NULL,
  `impuestos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `estado` enum('BORRADOR','PENDIENTE','COMPLETADA','ANULADA') NOT NULL DEFAULT 'COMPLETADA',
  `fecha_vencimiento` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_compra`),
  KEY `id_tercero` (`id_tercero`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`),
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `compras_ibfk_3` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.compras: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.compras_detalles
CREATE TABLE IF NOT EXISTS `compras_detalles` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_presentacion` int NOT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `impuesto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_detalle`),
  KEY `id_compra` (`id_compra`),
  KEY `id_producto` (`id_producto`),
  KEY `id_presentacion` (`id_presentacion`),
  CONSTRAINT `compras_detalles_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  CONSTRAINT `compras_detalles_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `compras_detalles_ibfk_3` FOREIGN KEY (`id_presentacion`) REFERENCES `producto_presentaciones` (`id_presentacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.compras_detalles: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.configuracion_tickets
CREATE TABLE IF NOT EXISTS `configuracion_tickets` (
  `id_configuracion` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `encabezado` text,
  `pie_pagina` text,
  `mensaje_personalizado` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_configuracion`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `configuracion_tickets_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.configuracion_tickets: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.empresas
CREATE TABLE IF NOT EXISTS `empresas` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `nombre_legal` varchar(100) NOT NULL,
  `nombre_comercial` varchar(100) NOT NULL,
  `nit` varchar(20) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `dominio` varchar(100) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `configuracion` json DEFAULT NULL,
  `regimen` enum('SIMPLIFICADO','COMUN','ESPECIAL') NOT NULL DEFAULT 'COMUN',
  `obligado_contabilidad` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `nit` (`nit`),
  UNIQUE KEY `dominio` (`dominio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.empresas: ~0 rows (aproximadamente)
INSERT INTO `empresas` (`id_empresa`, `nombre_legal`, `nombre_comercial`, `nit`, `direccion`, `telefono`, `email`, `dominio`, `logo_url`, `configuracion`, `regimen`, `obligado_contabilidad`, `fecha_registro`, `activo`) VALUES
	(1, 'Tiendas XYZ S.A.S.', 'Tienda XYZ', '900123456-7', 'Calle 123 #45-67, Bogotá', '6012345678', 'info@tiendaxyz.com', 'tiendaxyz.com', NULL, NULL, 'COMUN', 1, '2025-07-25 21:52:43', 1);

-- Volcando estructura para tabla sistema_pos.facturas_electronicas
CREATE TABLE IF NOT EXISTS `facturas_electronicas` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_serie` int NOT NULL,
  `consecutivo` bigint NOT NULL,
  `cufe` varchar(100) DEFAULT NULL,
  `qr` text,
  `fecha_generacion` datetime DEFAULT NULL,
  `estado_dian` enum('PENDIENTE','ACEPTADA','RECHAZADA') DEFAULT 'PENDIENTE',
  `mensaje_dian` text,
  `xml` longtext,
  `pdf` longblob,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_factura`),
  UNIQUE KEY `empresa_serie_consecutivo` (`id_empresa`,`id_serie`,`consecutivo`),
  KEY `id_serie` (`id_serie`),
  CONSTRAINT `facturas_electronicas_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `facturas_electronicas_ibfk_2` FOREIGN KEY (`id_serie`) REFERENCES `series_facturacion` (`id_serie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.facturas_electronicas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.inventario
CREATE TABLE IF NOT EXISTS `inventario` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `id_almacen` int NOT NULL,
  `id_referencia` int NOT NULL,
  `stock` decimal(12,3) NOT NULL DEFAULT '0.000',
  `stock_minimo` decimal(12,3) NOT NULL DEFAULT '0.000',
  `costo_promedio` decimal(12,2) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_inventario`),
  UNIQUE KEY `producto_almacen_presentacion` (`id_producto`,`id_almacen`,`id_referencia`),
  KEY `id_almacen` (`id_almacen`),
  KEY `id_presentacion` (`id_referencia`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `inventario_ibfk_3` FOREIGN KEY (`id_referencia`) REFERENCES `productos_referencias` (`id_referencia`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.inventario: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.inventario_movimientos
CREATE TABLE IF NOT EXISTS `inventario_movimientos` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_almacen` int NOT NULL,
  `id_presentacion` int NOT NULL,
  `tipo_movimiento` enum('ENTRADA','SALIDA','AJUSTE','TRASPASO') NOT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_referencia` int DEFAULT NULL COMMENT 'ID de venta, compra, etc.',
  `tipo_referencia` varchar(50) DEFAULT NULL COMMENT 'Venta, Compra, Ajuste, etc.',
  `id_usuario` int NOT NULL,
  `costo_unitario` decimal(12,2) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_movimiento`),
  KEY `id_producto` (`id_producto`),
  KEY `id_almacen` (`id_almacen`),
  KEY `id_presentacion` (`id_presentacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `inventario_movimientos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `inventario_movimientos_ibfk_2` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `inventario_movimientos_ibfk_3` FOREIGN KEY (`id_presentacion`) REFERENCES `producto_presentaciones` (`id_presentacion`),
  CONSTRAINT `inventario_movimientos_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `inventario_movimientos_ibfk_5` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.inventario_movimientos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.metodos_pago
CREATE TABLE IF NOT EXISTS `metodos_pago` (
  `id_metodo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `requiere_referencia` tinyint(1) NOT NULL DEFAULT '0',
  `codigo_dian` varchar(10) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_metodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.metodos_pago: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `detalle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `control_stock` tinyint(1) NOT NULL DEFAULT '1',
  `inventariable` tinyint(1) NOT NULL DEFAULT '1',
  `impuesto` decimal(5,2) NOT NULL DEFAULT '19.00',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_producto`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.productos_codigos
CREATE TABLE IF NOT EXISTS `productos_codigos` (
  `id_codigo` int NOT NULL AUTO_INCREMENT,
  `codigo_barras` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_empresa` int NOT NULL,
  `id_producto` int NOT NULL,
  PRIMARY KEY (`id_codigo`),
  UNIQUE KEY `uq_codigo_empresa` (`id_empresa`,`codigo_barras`),
  KEY `idx_empresa` (`id_empresa`),
  KEY `idx_producto` (`id_producto`),
  CONSTRAINT `fk_codigos_producto_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_codigos_producto_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_codigos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.productos_referencias
CREATE TABLE IF NOT EXISTS `productos_referencias` (
  `id_referencia` int NOT NULL AUTO_INCREMENT,
  `id_almacen` int NOT NULL,
  `id_producto` int NOT NULL,
  `referencia` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `precio` decimal(15,2) DEFAULT NULL,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`id_referencia`),
  KEY `idx_producto` (`id_producto`),
  KEY `idx_almacen` (`id_almacen`),
  CONSTRAINT `fk_referencias_producto_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_referencias_producto_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_referencias: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `nivel_permiso` int NOT NULL DEFAULT '1',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.roles: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.series_facturacion
CREATE TABLE IF NOT EXISTS `series_facturacion` (
  `id_serie` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `tipo_documento` enum('FACTURA','NOTA_CREDITO','NOTA_DEBITO','RECIBO','COMPROBANTE') NOT NULL DEFAULT 'FACTURA',
  `serie` varchar(10) NOT NULL,
  `resolucion` varchar(50) DEFAULT NULL,
  `fecha_resolucion` date DEFAULT NULL,
  `rango_inicial` bigint NOT NULL,
  `rango_final` bigint NOT NULL,
  `consecutivo_actual` bigint NOT NULL DEFAULT '0',
  `prefijo` varchar(10) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_serie`),
  UNIQUE KEY `empresa_serie_tipo` (`id_empresa`,`tipo_documento`,`serie`),
  CONSTRAINT `series_facturacion_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.series_facturacion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.terceros
CREATE TABLE IF NOT EXISTS `terceros` (
  `id_tercero` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `tipo_documento` enum('CC','CE','NIT','PASAPORTE','TI','RUT') NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `primer_nombre` varchar(50) DEFAULT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) DEFAULT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `nombre_completo` varchar(200) NOT NULL,
  `nombre_comercial` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tipo_persona` enum('NATURAL','JURIDICA') DEFAULT 'NATURAL',
  `responsabilidad_fiscal` varchar(50) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_tercero`),
  UNIQUE KEY `doc_empresa_tipo` (`id_empresa`,`tipo_documento`,`numero_documento`),
  CONSTRAINT `terceros_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.terceros: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int DEFAULT NULL,
  `id_tercero` int DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `ultimo_login` datetime DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_tercero` (`id_tercero`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.usuarios_roles
CREATE TABLE IF NOT EXISTS `usuarios_roles` (
  `id_usuario` int NOT NULL,
  `id_rol` int NOT NULL,
  `id_empresa` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_rol`,`id_empresa`),
  KEY `id_rol` (`id_rol`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `usuarios_roles_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `usuarios_roles_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  CONSTRAINT `usuarios_roles_ibfk_3` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios_roles: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.ventas
CREATE TABLE IF NOT EXISTS `ventas` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_tercero` int DEFAULT NULL COMMENT 'Cliente',
  `id_usuario` int NOT NULL,
  `id_serie` int DEFAULT NULL,
  `consecutivo` bigint DEFAULT NULL,
  `id_factura_electronica` int DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subtotal` decimal(12,2) NOT NULL,
  `descuentos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `impuestos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `estado` enum('BORRADOR','PENDIENTE','COMPLETADA','ANULADA','DEVUELTA') NOT NULL DEFAULT 'COMPLETADA',
  `tipo_venta` enum('CONTADO','CREDITO') NOT NULL DEFAULT 'CONTADO',
  `fecha_vencimiento` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_venta`),
  KEY `id_tercero` (`id_tercero`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_serie` (`id_serie`),
  KEY `id_factura_electronica` (`id_factura_electronica`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`),
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `ventas_ibfk_4` FOREIGN KEY (`id_serie`) REFERENCES `series_facturacion` (`id_serie`),
  CONSTRAINT `ventas_ibfk_5` FOREIGN KEY (`id_factura_electronica`) REFERENCES `facturas_electronicas` (`id_factura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.ventas_detalles
CREATE TABLE IF NOT EXISTS `ventas_detalles` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_presentacion` int NOT NULL,
  `id_precio` int DEFAULT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `descuento` decimal(12,2) NOT NULL DEFAULT '0.00',
  `impuesto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_detalle`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  KEY `id_precio` (`id_precio`),
  KEY `id_presentacion` (`id_presentacion`),
  CONSTRAINT `ventas_detalles_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  CONSTRAINT `ventas_detalles_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `ventas_detalles_ibfk_3` FOREIGN KEY (`id_precio`) REFERENCES `productos_precios` (`id_precio`),
  CONSTRAINT `ventas_detalles_ibfk_4` FOREIGN KEY (`id_presentacion`) REFERENCES `producto_presentaciones` (`id_presentacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_detalles: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.ventas_espera
CREATE TABLE IF NOT EXISTS `ventas_espera` (
  `id_borrador` int NOT NULL AUTO_INCREMENT,
  `id_almacen` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','FINALIZADO','CANCELADO') NOT NULL DEFAULT 'ACTIVO',
  `tipo` enum('TEMPORAL','EN_ESPERA') NOT NULL DEFAULT 'TEMPORAL',
  `fecha_expiracion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_borrador`),
  KEY `id_almacen` (`id_almacen`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `ventas_espera_ibfk_1 ` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `ventas_espera_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_espera: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.ventas_espera_detalle
CREATE TABLE IF NOT EXISTS `ventas_espera_detalle` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_borrador` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_borrador` (`id_borrador`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `ventas_espera_detalle_ibfk_1` FOREIGN KEY (`id_borrador`) REFERENCES `ventas_espera` (`id_borrador`),
  CONSTRAINT `ventas_espera_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_espera_detalle: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.ventas_pagos
CREATE TABLE IF NOT EXISTS `ventas_pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_metodo` int NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `banco` varchar(50) DEFAULT NULL,
  `cuenta` varchar(50) DEFAULT NULL,
  `titular` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_pago`),
  KEY `id_venta` (`id_venta`),
  KEY `id_metodo` (`id_metodo`),
  CONSTRAINT `ventas_pagos_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  CONSTRAINT `ventas_pagos_ibfk_2` FOREIGN KEY (`id_metodo`) REFERENCES `metodos_pago` (`id_metodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_pagos: ~0 rows (aproximadamente)

-- Volcando estructura para disparador sistema_pos.trg_nombre_completo_terceros
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_nombre_completo_terceros` BEFORE INSERT ON `terceros` FOR EACH ROW BEGIN
  IF NEW.tipo_persona = 'NATURAL' THEN
    SET NEW.nombre_completo = CONCAT_WS(' ', 
      NEW.primer_nombre, 
      NEW.segundo_nombre, 
      NEW.primer_apellido, 
      NEW.segundo_apellido
    );
  ELSE
    SET NEW.nombre_completo = COALESCE(NEW.nombre_comercial, '');
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador sistema_pos.trg_nombre_completo_terceros_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_nombre_completo_terceros_update` BEFORE UPDATE ON `terceros` FOR EACH ROW BEGIN
  IF NEW.tipo_persona = 'NATURAL' THEN
    SET NEW.nombre_completo = CONCAT_WS(' ', 
      NEW.primer_nombre, 
      NEW.segundo_nombre, 
      NEW.primer_apellido, 
      NEW.segundo_apellido
    );
  ELSE
    SET NEW.nombre_completo = COALESCE(NEW.nombre_comercial, '');
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
