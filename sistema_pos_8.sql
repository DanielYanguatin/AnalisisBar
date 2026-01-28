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
  CONSTRAINT `fk_almacenes_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.almacenes: ~4 rows (aproximadamente)
INSERT INTO `almacenes` (`id_almacen`, `id_empresa`, `nombre`, `direccion`, `telefono`, `responsable`, `activo`) VALUES
	(1, 1, 'Bodega Principal', 'Calle 100 # 15-20, Bogotá', '6012345678', 'Carlos Mendoza', 1),
	(2, 1, 'Punto de Venta Norte', 'Carrera 60 # 127-35, Bogotá', '6012345679', 'Ana Gómez', 1),
	(3, 2, 'Centro de Distribución', 'Avenida 30 # 45-67, Medellín', '6045678912', 'Roberto Díaz', 1),
	(4, 2, 'Tienda El Poblado', 'Carrera 43A # 6-100, Medellín', '6045678913', 'Laura Martínez', 1);

-- Volcando estructura para tabla sistema_pos.auditoria
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(100) DEFAULT NULL,
  `id_registro` int DEFAULT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') DEFAULT NULL,
  `valores_anteriores` text,
  `valores_nuevos` text,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_auditoria`),
  KEY `fk_auditoria_usuarios` (`id_usuario`),
  CONSTRAINT `fk_auditoria_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.auditoria: ~4 rows (aproximadamente)
INSERT INTO `auditoria` (`id_auditoria`, `tabla_afectada`, `id_registro`, `accion`, `valores_anteriores`, `valores_nuevos`, `fecha`, `id_usuario`) VALUES
	(1, 'ventas', 1, 'INSERT', NULL, '{"id_venta": 1, "total": 3091620.00}', '2024-01-10 10:30:00', 2),
	(2, 'ventas', 2, 'INSERT', NULL, '{"id_venta": 2, "total": 420665.00}', '2024-01-12 15:45:00', 2),
	(3, 'ventas', 3, 'INSERT', NULL, '{"id_venta": 3, "total": 20468.00}', '2024-01-11 11:20:00', 4),
	(4, 'ventas', 4, 'INSERT', NULL, '{"id_venta": 4, "total": 25466.00}', '2024-01-13 14:30:00', 4);

-- Volcando estructura para tabla sistema_pos.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_categoria`),
  KEY `fk_categorias_empresas` (`id_empresa`),
  CONSTRAINT `fk_categorias_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.categorias: ~6 rows (aproximadamente)
INSERT INTO `categorias` (`id_categoria`, `id_empresa`, `nombre_categoria`, `descripcion`, `activo`) VALUES
	(1, 1, 'Tecnología', 'Productos electrónicos y tecnológicos', 1),
	(2, 1, 'Oficina', 'Artículos de oficina y papelería', 1),
	(3, 1, 'Hogar', 'Productos para el hogar', 1),
	(4, 2, 'Alimentos', 'Productos alimenticios', 1),
	(5, 2, 'Limpieza', 'Productos de limpieza', 1),
	(6, 2, 'Bebidas', 'Bebidas y refrescos', 1);

-- Volcando estructura para tabla sistema_pos.cierres_caja
CREATE TABLE IF NOT EXISTS `cierres_caja` (
  `id_cierre_caja` int NOT NULL AUTO_INCREMENT,
  `id_almacen` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_apertura` datetime NOT NULL,
  `fecha_cierre` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_ventas` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_redondeos` decimal(14,2) NOT NULL DEFAULT '0.00',
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
  PRIMARY KEY (`id_cierre_caja`) USING BTREE,
  KEY `id_usuario` (`id_usuario`),
  KEY `id_serie_facturas` (`id_serie_facturas`),
  KEY `id_almacen` (`id_almacen`) USING BTREE,
  CONSTRAINT `fk_cierres_caja_almacenes` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cierres_caja_series_facturacion` FOREIGN KEY (`id_serie_facturas`) REFERENCES `series_facturacion` (`id_serie`),
  CONSTRAINT `fk_cierres_caja_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.cierres_caja: ~4 rows (aproximadamente)
INSERT INTO `cierres_caja` (`id_cierre_caja`, `id_almacen`, `id_usuario`, `fecha_apertura`, `fecha_cierre`, `total_ventas`, `total_redondeos`, `total_pagos_creditos`, `total_creditos`, `total_tarjetas`, `total_transferencias`, `total_otros`, `diferencia`, `id_serie_facturas`, `factura_inicial`, `factura_final`, `activo`) VALUES
	(1, 2, 2, '2024-01-10 08:00:00', '2024-01-10 18:00:00', 3091620.00, 0.00, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 1, 1, 1),
	(2, 2, 2, '2024-01-12 08:00:00', '2024-01-12 18:00:00', 420665.00, 0.00, 0, 0.00, 420665.00, 0.00, 0.00, 0.00, 1, 2, 2, 1),
	(3, 4, 4, '2024-01-11 08:00:00', '2024-01-11 18:00:00', 20468.00, 0.00, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 3, 1, 1, 1),
	(4, 4, 4, '2024-01-13 08:00:00', '2024-01-13 18:00:00', 25466.00, 0.00, 0, 0.00, 0.00, 25466.00, 0.00, 0.00, 3, 2, 2, 1);

-- Volcando estructura para tabla sistema_pos.compras
CREATE TABLE IF NOT EXISTS `compras` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_tercero` int NOT NULL COMMENT 'Proveedor',
  `id_usuario` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `numero_documento` varchar(50) DEFAULT NULL,
  `id_tipo_documento` int DEFAULT NULL,
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
  KEY `id_tipo_documento` (`id_tipo_documento`) USING BTREE,
  CONSTRAINT `fk_compras_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_compras_terceros` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`),
  CONSTRAINT `fk_compras_tipo_documento` FOREIGN KEY (`id_tipo_documento`) REFERENCES `tipos_documentos` (`id_tipo`),
  CONSTRAINT `fk_compras_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.compras: ~4 rows (aproximadamente)
INSERT INTO `compras` (`id_compra`, `id_empresa`, `id_tercero`, `id_usuario`, `fecha`, `numero_documento`, `id_tipo_documento`, `subtotal`, `impuestos`, `total`, `estado`, `fecha_vencimiento`, `activo`) VALUES
	(1, 1, 3, 1, '2023-11-10 09:30:00', 'FC-0001', 2, 9750000.00, 1852500.00, 11602500.00, 'COMPLETADA', '2023-11-10', 1),
	(2, 1, 4, 1, '2023-11-15 14:20:00', 'FC-0002', 2, 1250000.00, 237500.00, 1487500.00, 'COMPLETADA', '2023-11-15', 1),
	(3, 2, 7, 3, '2023-12-05 11:15:00', 'FC-0003', 2, 1750000.00, 332500.00, 2082500.00, 'COMPLETADA', '2023-12-05', 1),
	(4, 2, 8, 3, '2023-12-08 16:40:00', 'FC-0004', 2, 950000.00, 180500.00, 1130500.00, 'COMPLETADA', '2023-12-08', 1);

-- Volcando estructura para tabla sistema_pos.compras_detalles
CREATE TABLE IF NOT EXISTS `compras_detalles` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `precio_unitario` decimal(12,4) NOT NULL,
  `impuesto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(14,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_detalle`),
  KEY `id_compra` (`id_compra`),
  KEY `id_producto` (`id_producto`),
  KEY `idx_compras_detalles_producto` (`id_producto`),
  KEY `idx_compras_detalles_compra` (`id_compra`),
  CONSTRAINT `fk_compras_detalles_compras` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  CONSTRAINT `fk_compras_detalles_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.compras_detalles: ~4 rows (aproximadamente)
INSERT INTO `compras_detalles` (`id_detalle`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`, `impuesto`, `total`, `activo`) VALUES
	(1, 1, 1, 5.000, 1950000.0000, 1852500.00, 9750000.00, 1),
	(2, 2, 4, 5.000, 250000.0000, 237500.00, 1250000.00, 1),
	(3, 3, 5, 500.000, 3500.0000, 332500.00, 1750000.00, 1),
	(4, 4, 6, 100.000, 9500.0000, 180500.00, 950000.00, 1);

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
  CONSTRAINT `fk_configuracion_tickets_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.configuracion_tickets: ~2 rows (aproximadamente)
INSERT INTO `configuracion_tickets` (`id_configuracion`, `id_empresa`, `encabezado`, `pie_pagina`, `mensaje_personalizado`, `logo_url`, `activo`) VALUES
	(1, 1, 'TecnoShop\nNIT: 900123456-7\nCalle 100 # 15-20, Bogotá\nTel: 6012345678', '¡Gracias por su compra!\nVuelva pronto', 'Conserve este ticket para garantías', '/logos/tecnoshop_ticket.png', 1),
	(2, 2, 'SuperDist\nNIT: 800987654-3\nAvenida 30 # 45-67, Medellín\nTel: 6045678912', '¡Gracias por preferirnos!', 'Productos de la más alta calidad', '/logos/superdist_ticket.png', 1);

-- Volcando estructura para tabla sistema_pos.devoluciones
CREATE TABLE IF NOT EXISTS `devoluciones` (
  `id_devolucion` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_venta` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `motivo` text,
  `total` decimal(12,2) NOT NULL,
  `estado` enum('PENDIENTE','APROBADA','RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_devolucion`),
  KEY `id_venta` (`id_venta`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `fk_devoluciones_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_devoluciones_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_devoluciones_ventas` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.devoluciones: ~2 rows (aproximadamente)
INSERT INTO `devoluciones` (`id_devolucion`, `id_empresa`, `id_venta`, `id_usuario`, `fecha`, `motivo`, `total`, `estado`, `activo`) VALUES
	(1, 1, 1, 2, '2024-01-11 11:00:00', 'Producto defectuoso', 48000.00, 'APROBADA', 1),
	(2, 2, 3, 4, '2024-01-12 10:30:00', 'Producto incorrecto', 2600.00, 'APROBADA', 1);

-- Volcando estructura para tabla sistema_pos.devoluciones_detalles
CREATE TABLE IF NOT EXISTS `devoluciones_detalles` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_devolucion` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `precio_unitario` decimal(12,4) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_devolucion` (`id_devolucion`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `fk_devoluciones_detalles_devoluciones` FOREIGN KEY (`id_devolucion`) REFERENCES `devoluciones` (`id_devolucion`),
  CONSTRAINT `fk_devoluciones_detalles_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.devoluciones_detalles: ~2 rows (aproximadamente)
INSERT INTO `devoluciones_detalles` (`id_detalle`, `id_devolucion`, `id_producto`, `cantidad`, `precio_unitario`, `motivo`) VALUES
	(1, 1, 2, 1.000, 48000.0000, 'Defectuoso'),
	(2, 2, 7, 1.000, 2600.0000, 'Producto incorrecto');

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.empresas: ~2 rows (aproximadamente)
INSERT INTO `empresas` (`id_empresa`, `nombre_legal`, `nombre_comercial`, `nit`, `direccion`, `telefono`, `email`, `dominio`, `logo_url`, `configuracion`, `regimen`, `obligado_contabilidad`, `fecha_registro`, `activo`) VALUES
	(1, 'Tecnologías Avanzadas S.A.S.', 'TecnoShop', '900123456-7', 'Calle 100 # 15-20, Bogotá', '6012345678', 'contacto@tecnoshop.com', 'tecnoshop.com', '/logos/tecnoshop.png', '{"iva": 19, "pais": "Colombia", "moneda": "COP"}', 'COMUN', 1, '2023-01-15 08:00:00', 1),
	(2, 'Distribuciones Comerciales Ltda', 'SuperDist', '800987654-3', 'Avenida 30 # 45-67, Medellín', '6045678912', 'info@superdist.com', 'superdist.com', '/logos/superdist.png', '{"iva": 19, "pais": "Colombia", "moneda": "COP"}', 'SIMPLIFICADO', 0, '2023-03-20 09:30:00', 1);

-- Volcando estructura para tabla sistema_pos.estados
CREATE TABLE IF NOT EXISTS `estados` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL COMMENT 'Descripción del estado',
  `tipo_estado` varchar(50) DEFAULT NULL COMMENT 'Tipo de estado (VENTA, COMPRA, etc)',
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.estados: ~6 rows (aproximadamente)
INSERT INTO `estados` (`id_estado`, `nombre_estado`, `descripcion`, `tipo_estado`) VALUES
	(1, 'PENDIENTE', 'Venta pendiente de pago', 'VENTA'),
	(2, 'PAGADA', 'Venta pagada completamente', 'VENTA'),
	(3, 'CANCELADA', 'Venta cancelada', 'VENTA'),
	(4, 'EN PROCESO', 'Compra en proceso', 'COMPRA'),
	(5, 'RECIBIDA', 'Compra recibida', 'COMPRA'),
	(6, 'ANULADA', 'Compra anulada', 'COMPRA');

-- Volcando estructura para tabla sistema_pos.facturas
CREATE TABLE IF NOT EXISTS `facturas` (
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
  CONSTRAINT `fk_facturas_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_facturas_series_facturacion` FOREIGN KEY (`id_serie`) REFERENCES `series_facturacion` (`id_serie`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.facturas: ~4 rows (aproximadamente)
INSERT INTO `facturas` (`id_factura`, `id_empresa`, `id_serie`, `consecutivo`, `cufe`, `qr`, `fecha_generacion`, `estado_dian`, `mensaje_dian`, `xml`, `pdf`, `activo`) VALUES
	(1, 1, 1, 1, 'CUFE_1234567890', 'QR_CODE_1234567890', '2024-01-10 10:31:00', 'ACEPTADA', 'Documento electrónico aceptado por la DIAN', '<xml>...</xml>', NULL, 1),
	(2, 1, 1, 2, 'CUFE_2345678901', 'QR_CODE_2345678901', '2024-01-12 15:46:00', 'ACEPTADA', 'Documento electrónico aceptado por la DIAN', '<xml>...</xml>', NULL, 1),
	(3, 2, 3, 1, 'CUFE_3456789012', 'QR_CODE_3456789012', '2024-01-11 11:21:00', 'ACEPTADA', 'Documento electrónico aceptado por la DIAN', '<xml>...</xml>', NULL, 1),
	(4, 2, 3, 2, 'CUFE_4567890123', 'QR_CODE_4567890123', '2024-01-13 14:31:00', 'ACEPTADA', 'Documento electrónico aceptado por la DIAN', '<xml>...</xml>', NULL, 1);

-- Volcando estructura para tabla sistema_pos.impuestos
CREATE TABLE IF NOT EXISTS `impuestos` (
  `id_impuesto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `porcentaje` decimal(5,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_impuesto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.impuestos: ~3 rows (aproximadamente)
INSERT INTO `impuestos` (`id_impuesto`, `nombre`, `porcentaje`, `activo`) VALUES
	(1, 'IVA', 19.00, 1),
	(2, 'ICO', 5.00, 1),
	(3, 'Sin Impuesto', 0.00, 1);

-- Volcando estructura para tabla sistema_pos.inventario
CREATE TABLE IF NOT EXISTS `inventario` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `id_almacen` int NOT NULL,
  `id_presentacion` int NOT NULL,
  `stock` decimal(12,3) NOT NULL DEFAULT '0.000',
  `stock_minimo` decimal(12,3) NOT NULL DEFAULT '0.000',
  `costo_promedio` decimal(12,4) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_inventario`),
  UNIQUE KEY `producto_almacen_presentacion` (`id_producto`,`id_almacen`,`id_presentacion`),
  KEY `id_almacen` (`id_almacen`),
  KEY `id_referencia` (`id_presentacion`) USING BTREE,
  CONSTRAINT `fk_inventario_almacenes_id_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `fk_inventario_productos_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `fk_inventario_productos_presentaciones_id_presentacion` FOREIGN KEY (`id_presentacion`) REFERENCES `productos_presentaciones` (`id_presentacion`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.inventario: ~16 rows (aproximadamente)
INSERT INTO `inventario` (`id_inventario`, `id_producto`, `id_almacen`, `id_presentacion`, `stock`, `stock_minimo`, `costo_promedio`, `activo`) VALUES
	(1, 1, 1, 1, 15.000, 5.000, 1950000.0000, 1),
	(2, 2, 1, 2, 50.000, 10.000, 32000.0000, 1),
	(3, 3, 1, 3, 30.000, 5.000, 13500.0000, 1),
	(4, 4, 1, 4, 8.000, 3.000, 250000.0000, 1),
	(5, 1, 2, 1, 8.000, 3.000, 1950000.0000, 1),
	(6, 2, 2, 2, 25.000, 5.000, 32000.0000, 1),
	(7, 3, 2, 3, 15.000, 3.000, 13500.0000, 1),
	(8, 4, 2, 4, 4.000, 2.000, 250000.0000, 1),
	(9, 5, 3, 5, 200.000, 50.000, 3500.0000, 1),
	(10, 6, 3, 6, 150.000, 30.000, 9500.0000, 1),
	(11, 7, 3, 7, 300.000, 100.000, 1800.0000, 1),
	(12, 8, 3, 8, 120.000, 40.000, 6500.0000, 1),
	(13, 5, 4, 5, 80.000, 20.000, 3500.0000, 1),
	(14, 6, 4, 6, 60.000, 15.000, 9500.0000, 1),
	(15, 7, 4, 7, 120.000, 40.000, 1800.0000, 1),
	(16, 8, 4, 8, 50.000, 15.000, 6500.0000, 1);

-- Volcando estructura para tabla sistema_pos.inventario_movimientos
CREATE TABLE IF NOT EXISTS `inventario_movimientos` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_almacen` int NOT NULL,
  `tipo_movimiento` enum('ENTRADA','SALIDA','AJUSTE','TRASPASO') NOT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_referencia` int DEFAULT NULL COMMENT 'ID de venta, compra, etc.',
  `tipo_referencia` varchar(50) DEFAULT NULL COMMENT 'Venta, Compra, Ajuste, etc.',
  `id_usuario` int NOT NULL,
  `costo_unitario` decimal(12,4) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_movimiento`),
  KEY `id_producto` (`id_producto`),
  KEY `id_almacen` (`id_almacen`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `fk_inventario_movimientos_almacenes_id_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `fk_inventario_movimientos_empresas_id_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_inventario_movimientos_productos_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `fk_inventario_movimientos_usuarios_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro de todos los movimientos de inventario con su tipo y referencia';

-- Volcando datos para la tabla sistema_pos.inventario_movimientos: ~12 rows (aproximadamente)
INSERT INTO `inventario_movimientos` (`id_movimiento`, `id_empresa`, `id_producto`, `id_almacen`, `tipo_movimiento`, `cantidad`, `fecha`, `id_referencia`, `tipo_referencia`, `id_usuario`, `costo_unitario`, `activo`) VALUES
	(1, 1, 1, 1, 'ENTRADA', 5.000, '2023-11-10 09:30:00', 1, 'COMPRA', 1, 1950000.0000, 1),
	(2, 1, 4, 1, 'ENTRADA', 5.000, '2023-11-15 14:20:00', 2, 'COMPRA', 1, 250000.0000, 1),
	(3, 1, 1, 2, 'SALIDA', 1.000, '2024-01-10 10:30:00', 1, 'VENTA', 2, 1950000.0000, 1),
	(4, 1, 2, 2, 'SALIDA', 2.000, '2024-01-10 10:30:00', 1, 'VENTA', 2, 32000.0000, 1),
	(5, 1, 3, 2, 'SALIDA', 2.000, '2024-01-12 15:45:00', 2, 'VENTA', 2, 13500.0000, 1),
	(6, 1, 4, 2, 'SALIDA', 1.000, '2024-01-12 15:45:00', 2, 'VENTA', 2, 250000.0000, 1),
	(7, 2, 5, 3, 'ENTRADA', 500.000, '2023-12-05 11:15:00', 3, 'COMPRA', 3, 3500.0000, 1),
	(8, 2, 6, 3, 'ENTRADA', 100.000, '2023-12-08 16:40:00', 4, 'COMPRA', 3, 9500.0000, 1),
	(9, 2, 5, 4, 'SALIDA', 2.000, '2024-01-11 11:20:00', 3, 'VENTA', 4, 3500.0000, 1),
	(10, 2, 7, 4, 'SALIDA', 3.000, '2024-01-11 11:20:00', 3, 'VENTA', 4, 1800.0000, 1),
	(11, 2, 6, 4, 'SALIDA', 1.000, '2024-01-13 14:30:00', 4, 'VENTA', 4, 9500.0000, 1),
	(12, 2, 8, 4, 'SALIDA', 1.000, '2024-01-13 14:30:00', 4, 'VENTA', 4, 6500.0000, 1);

-- Volcando estructura para tabla sistema_pos.metodos_pago
CREATE TABLE IF NOT EXISTS `metodos_pago` (
  `id_metodo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `requiere_referencia` tinyint(1) NOT NULL DEFAULT '0',
  `codigo_dian` varchar(10) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_metodo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.metodos_pago: ~6 rows (aproximadamente)
INSERT INTO `metodos_pago` (`id_metodo`, `nombre`, `descripcion`, `requiere_referencia`, `codigo_dian`, `activo`) VALUES
	(1, 'Efectivo', 'Pago en efectivo', 0, '01', 1),
	(2, 'Tarjeta Débito', 'Pago con tarjeta débito', 1, '02', 1),
	(3, 'Tarjeta Crédito', 'Pago con tarjeta crédito', 1, '03', 1),
	(4, 'Transferencia', 'Transferencia bancaria', 1, '04', 1),
	(5, 'Nequi', 'Pago por Nequi', 1, '05', 1),
	(6, 'Daviplata', 'Pago por Daviplata', 1, '06', 1);

-- Volcando estructura para tabla sistema_pos.permisos
CREATE TABLE IF NOT EXISTS `permisos` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(100) NOT NULL,
  PRIMARY KEY (`id_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.permisos: ~8 rows (aproximadamente)
INSERT INTO `permisos` (`id_permiso`, `nombre_permiso`) VALUES
	(1, 'GESTION_USUARIOS'),
	(2, 'GESTION_PRODUCTOS'),
	(3, 'REALIZAR_VENTAS'),
	(4, 'VER_REPORTES'),
	(5, 'GESTION_INVENTARIO'),
	(6, 'CONFIGURAR_SISTEMA'),
	(7, 'GESTION_COMPRAS'),
	(8, 'CIERRE_CAJA');

-- Volcando estructura para tabla sistema_pos.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_impuesto` int DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  `nombre_producto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `detalle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `control_stock` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Controla si el producto aparece en reportes de stock (1=Si, 0=No)',
  `inventariable` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Determina si el producto genera movimientos de inventario (1=Si, 0=No)',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_producto`),
  KEY `id_empresa` (`id_empresa`),
  KEY `fk_productos_impuestos` (`id_impuesto`),
  KEY `fk_productos_categorias` (`id_categoria`),
  KEY `idx_productos_nombre` (`nombre_producto`),
  CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `fk_productos_empresas_id_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_productos_impuestos` FOREIGN KEY (`id_impuesto`) REFERENCES `impuestos` (`id_impuesto`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos: ~8 rows (aproximadamente)
INSERT INTO `productos` (`id_producto`, `id_empresa`, `id_impuesto`, `id_categoria`, `nombre_producto`, `detalle`, `control_stock`, `inventariable`, `fecha_creacion`, `fecha_actualizacion`, `activo`) VALUES
	(1, 1, 1, 1, 'Laptop HP Pavilion', 'Laptop HP Pavilion 15.6", Intel i5, 8GB RAM, 512GB SSD', 1, 1, '2023-01-20 10:00:00', '2023-12-01 11:30:00', 1),
	(2, 1, 1, 1, 'Mouse Inalámbrico', 'Mouse inalámbrico Logitech M185, color negro', 1, 1, '2023-01-22 14:20:00', NULL, 1),
	(3, 1, 1, 2, 'Resma de Papel A4', 'Resma de papel bond A4, 500 hojas, 75g', 1, 1, '2023-02-05 09:15:00', NULL, 1),
	(4, 1, 1, 3, 'Escritorio Ejecutivo', 'Escritorio ejecutivo de madera, 120x60cm', 1, 1, '2023-02-10 16:40:00', NULL, 1),
	(5, 2, 1, 4, 'Arroz Diana', 'Arroz Diana premium, bolsa 5kg', 1, 1, '2023-03-25 11:20:00', NULL, 1),
	(6, 2, 1, 5, 'Jabón Ariel', 'Jabón en polvo Ariel, bolsa 1kg', 1, 1, '2023-03-26 14:35:00', NULL, 1),
	(7, 2, 1, 6, 'Gaseosa Coca-Cola', 'Gaseosa Coca-Cola, botella personal 400ml', 1, 1, '2023-03-28 10:50:00', NULL, 1),
	(8, 2, 1, 4, 'Aceite Gourmet', 'Aceite vegetal Gourmet, botella 900ml', 1, 1, '2023-04-02 15:10:00', NULL, 1);

-- Volcando estructura para tabla sistema_pos.productos_codigos
CREATE TABLE IF NOT EXISTS `productos_codigos` (
  `id_codigo` int NOT NULL AUTO_INCREMENT,
  `codigo_barras` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_empresa` int NOT NULL,
  `id_producto` int NOT NULL,
  `nombre_codigo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_codigo`),
  UNIQUE KEY `uq_codigo_empresa` (`id_empresa`,`codigo_barras`),
  KEY `id_empresa` (`id_empresa`) USING BTREE,
  KEY `id_producto` (`id_producto`) USING BTREE,
  CONSTRAINT `fk_productos_codigos_empresas_id_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_productos_codigos_productos_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_codigos: ~8 rows (aproximadamente)
INSERT INTO `productos_codigos` (`id_codigo`, `codigo_barras`, `id_empresa`, `id_producto`, `nombre_codigo`) VALUES
	(1, '1234567890123', 1, 1, 'EAN-13'),
	(2, '2345678901234', 1, 2, 'EAN-13'),
	(3, '3456789012345', 1, 3, 'EAN-13'),
	(4, '4567890123456', 1, 4, 'EAN-13'),
	(5, '5678901234567', 2, 5, 'EAN-13'),
	(6, '6789012345678', 2, 6, 'EAN-13'),
	(7, '7890123456789', 2, 7, 'EAN-13'),
	(8, '8901234567890', 2, 8, 'EAN-13');

-- Volcando estructura para tabla sistema_pos.productos_precios
CREATE TABLE IF NOT EXISTS `productos_precios` (
  `id_precio` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `id_almacen` int NOT NULL,
  `id_presentacion` int NOT NULL,
  `precio_venta` decimal(12,4) NOT NULL,
  `stock_equivalente` int DEFAULT NULL,
  `orden` int NOT NULL,
  PRIMARY KEY (`id_precio`),
  UNIQUE KEY `uq_precio_producto_almacen_ref` (`id_producto`,`id_almacen`,`id_presentacion`),
  KEY `fk_productos_precios_almacenes` (`id_almacen`),
  KEY `fk_productos_precios_productos_presentaciones` (`id_presentacion`),
  CONSTRAINT `fk_productos_precios_almacenes` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_productos_precios_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_productos_precios_productos_presentaciones` FOREIGN KEY (`id_presentacion`) REFERENCES `productos_presentaciones` (`id_presentacion`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_precios: ~16 rows (aproximadamente)
INSERT INTO `productos_precios` (`id_precio`, `id_producto`, `id_almacen`, `id_presentacion`, `precio_venta`, `stock_equivalente`, `orden`) VALUES
	(1, 1, 1, 1, 2500000.0000, 1, 1),
	(2, 1, 2, 1, 2550000.0000, 1, 1),
	(3, 2, 1, 2, 45000.0000, 1, 1),
	(4, 2, 2, 2, 48000.0000, 1, 1),
	(5, 3, 1, 3, 18000.0000, 1, 1),
	(6, 3, 2, 3, 18500.0000, 1, 1),
	(7, 4, 1, 4, 320000.0000, 1, 1),
	(8, 4, 2, 4, 335000.0000, 1, 1),
	(9, 5, 3, 5, 4500.0000, 1, 1),
	(10, 5, 4, 5, 4700.0000, 1, 1),
	(11, 6, 3, 6, 12500.0000, 1, 1),
	(12, 6, 4, 6, 12900.0000, 1, 1),
	(13, 7, 3, 7, 2500.0000, 1, 1),
	(14, 7, 4, 7, 2600.0000, 1, 1),
	(15, 8, 3, 8, 8500.0000, 1, 1),
	(16, 8, 4, 8, 8900.0000, 1, 1);

-- Volcando estructura para tabla sistema_pos.productos_precios_historial
CREATE TABLE IF NOT EXISTS `productos_precios_historial` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `id_presentacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `precio_anterior` decimal(12,4) DEFAULT NULL,
  `precio_nuevo` decimal(12,4) DEFAULT NULL,
  `fecha_cambio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `fk_productos_precios_historial_productos` (`id_producto`),
  KEY `fk_productos_precios_historial_productos_presentaciones` (`id_presentacion`),
  KEY `fk_productos_precios_historial_usuarios` (`id_usuario`),
  CONSTRAINT `fk_productos_precios_historial_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `fk_productos_precios_historial_productos_presentaciones` FOREIGN KEY (`id_presentacion`) REFERENCES `productos_presentaciones` (`id_presentacion`),
  CONSTRAINT `fk_productos_precios_historial_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_precios_historial: ~10 rows (aproximadamente)
INSERT INTO `productos_precios_historial` (`id_historial`, `id_producto`, `id_presentacion`, `id_usuario`, `precio_anterior`, `precio_nuevo`, `fecha_cambio`) VALUES
	(1, 1, 1, 1, 1950000.0000, 1950000.0000, '2025-08-20 18:22:36'),
	(2, 1, 1, 1, 1950000.0000, 1950000.0000, '2025-08-20 18:22:36'),
	(4, 4, 4, 2, 250000.0000, 250000.0000, '2025-08-20 18:22:36'),
	(5, 4, 4, 2, 250000.0000, 250000.0000, '2025-08-20 18:22:36'),
	(7, 5, 5, 3, 3500.0000, 3500.0000, '2025-08-20 18:22:36'),
	(8, 5, 5, 3, 3500.0000, 3500.0000, '2025-08-20 18:22:36'),
	(10, 6, 6, 4, 9500.0000, 9500.0000, '2025-08-20 18:22:36'),
	(11, 6, 6, 4, 9500.0000, 9500.0000, '2025-08-20 18:22:36'),
	(13, 1, 1, 1, 2400000.0000, 2500000.0000, '2023-12-01 11:30:00'),
	(14, 5, 5, 3, 4200.0000, 4500.0000, '2023-12-20 09:15:00');

-- Volcando estructura para tabla sistema_pos.productos_presentaciones
CREATE TABLE IF NOT EXISTS `productos_presentaciones` (
  `id_presentacion` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_presentaciones_unidades` int DEFAULT NULL,
  PRIMARY KEY (`id_presentacion`),
  KEY `id_producto` (`id_producto`) USING BTREE,
  KEY `id_empresa` (`id_empresa`) USING BTREE,
  KEY `id_presentaciones_unidades` (`id_presentaciones_unidades`),
  CONSTRAINT `fk_productos_presentaciones_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_productos_presentaciones_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `fk_productos_presentaciones_productos_presentaciones_unidades` FOREIGN KEY (`id_presentaciones_unidades`) REFERENCES `productos_presentaciones_unidades` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_presentaciones: ~8 rows (aproximadamente)
INSERT INTO `productos_presentaciones` (`id_presentacion`, `id_empresa`, `id_producto`, `id_presentaciones_unidades`) VALUES
	(1, 1, 1, 1),
	(2, 1, 2, 1),
	(3, 1, 3, 4),
	(4, 1, 4, 1),
	(5, 2, 5, 5),
	(6, 2, 6, 5),
	(7, 2, 7, 6),
	(8, 2, 8, 6);

-- Volcando estructura para tabla sistema_pos.productos_presentaciones_unidades
CREATE TABLE IF NOT EXISTS `productos_presentaciones_unidades` (
  `id_unidad` int NOT NULL AUTO_INCREMENT,
  `nombre_unidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_presentaciones_unidades: ~6 rows (aproximadamente)
INSERT INTO `productos_presentaciones_unidades` (`id_unidad`, `nombre_unidad`) VALUES
	(1, 'Unidad'),
	(2, 'Paquete'),
	(3, 'Caja'),
	(4, 'Resma'),
	(5, 'Kilogramo'),
	(6, 'Litro');

-- Volcando estructura para tabla sistema_pos.promociones
CREATE TABLE IF NOT EXISTS `promociones` (
  `id_promocion` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `tipo` enum('DESCUENTO','BONIFICACION','COMBO') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_promocion`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `fk_promociones_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.promociones: ~0 rows (aproximadamente)
INSERT INTO `promociones` (`id_promocion`, `id_empresa`, `nombre`, `descripcion`, `tipo`, `valor`, `fecha_inicio`, `fecha_fin`, `activo`) VALUES
	(1, 1, 'Descuento Laptops', '10% de descuento en todas las laptops', 'DESCUENTO', 10.00, '2024-01-01', '2024-01-31', 1),
	(2, 2, 'Combo Limpieza', 'Jabón + Aceite con 15% de descuento', 'COMBO', 15.00, '2024-01-01', '2024-01-31', 1);

-- Volcando estructura para tabla sistema_pos.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `nivel_permiso` int NOT NULL DEFAULT '1',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.roles: ~0 rows (aproximadamente)
INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`, `nivel_permiso`, `activo`) VALUES
	(1, 'Administrador', 'Acceso completo al sistema', 100, 1),
	(2, 'Vendedor', 'Puede realizar ventas', 50, 1),
	(3, 'Bodeguero', 'Gestiona inventario', 60, 1),
	(4, 'Gerente', 'Supervisa operaciones', 80, 1);

-- Volcando estructura para tabla sistema_pos.roles_permisos
CREATE TABLE IF NOT EXISTS `roles_permisos` (
  `id_rol` int NOT NULL,
  `id_permiso` int NOT NULL,
  PRIMARY KEY (`id_rol`,`id_permiso`),
  KEY `fk_roles_permisos_permisos` (`id_permiso`),
  CONSTRAINT `fk_roles_permisos_permisos` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`),
  CONSTRAINT `fk_roles_permisos_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.roles_permisos: ~0 rows (aproximadamente)
INSERT INTO `roles_permisos` (`id_rol`, `id_permiso`) VALUES
	(1, 1),
	(1, 2),
	(3, 2),
	(4, 2),
	(1, 3),
	(2, 3),
	(4, 3),
	(1, 4),
	(2, 4),
	(4, 4),
	(1, 5),
	(3, 5),
	(4, 5),
	(1, 6),
	(1, 7),
	(3, 7),
	(4, 7),
	(1, 8),
	(4, 8);

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
  CONSTRAINT `fk_series_facturacion_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.series_facturacion: ~0 rows (aproximadamente)
INSERT INTO `series_facturacion` (`id_serie`, `id_empresa`, `tipo_documento`, `serie`, `resolucion`, `fecha_resolucion`, `rango_inicial`, `rango_final`, `consecutivo_actual`, `prefijo`, `activo`) VALUES
	(1, 1, 'FACTURA', 'F001', '18760000001', '2023-01-10', 1, 1000, 125, 'PREF', 1),
	(2, 1, 'NOTA_CREDITO', 'NC01', '18760000002', '2023-01-10', 1, 1000, 3, 'PREF', 1),
	(3, 2, 'FACTURA', 'F002', '18760000003', '2023-03-25', 1, 1000, 89, 'PREF', 1),
	(4, 2, 'NOTA_CREDITO', 'NC02', '18760000004', '2023-03-25', 1, 1000, 2, 'PREF', 1);

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
  KEY `idx_terceros_documento` (`numero_documento`),
  KEY `idx_terceros_nombre_completo` (`nombre_completo`),
  KEY `idx_terceros_nombre_comercial` (`nombre_comercial`),
  KEY `idx_terceros_email` (`email`),
  CONSTRAINT `fk_terceros_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.terceros: ~0 rows (aproximadamente)
INSERT INTO `terceros` (`id_tercero`, `id_empresa`, `tipo_documento`, `numero_documento`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `nombre_completo`, `nombre_comercial`, `direccion`, `telefono`, `email`, `tipo_persona`, `responsabilidad_fiscal`, `fecha_registro`, `activo`) VALUES
	(1, 1, 'CC', '1234567890', 'Juan', 'Carlos', 'Rodríguez', 'Méndez', 'Juan Carlos Rodríguez Méndez', NULL, 'Calle 45 # 12-34, Bogotá', '3156789012', 'juan.rodriguez@email.com', 'NATURAL', 'Responsable de IVA', '2023-02-15 11:20:00', 1),
	(2, 1, 'CC', '2345678901', 'María', 'Alejandra', 'Gutiérrez', 'López', 'María Alejandra Gutiérrez López', NULL, 'Carrera 78 # 45-12, Bogotá', '3167890123', 'maria.gutierrez@email.com', 'NATURAL', 'Responsable de IVA', '2023-02-18 14:35:00', 1),
	(3, 1, 'NIT', '800111222-3', NULL, NULL, NULL, NULL, 'TecnoImport S.A.S.', 'TecnoImport S.A.S.', 'Carrera 50 # 80-90, Bogotá', '6019876543', 'proveedores@teconoimport.com', 'JURIDICA', 'Responsable de IVA', '2023-01-25 09:40:00', 1),
	(4, 1, 'NIT', '800222333-4', NULL, NULL, NULL, NULL, 'Muebles y Oficina Ltda', 'Muebles y Oficina Ltda', 'Avenida 68 # 25-40, Bogotá', '6018765432', 'contacto@mueblesoficina.com', 'JURIDICA', 'Responsable de IVA', '2023-01-28 16:20:00', 1),
	(5, 2, 'CC', '3456789012', 'Pedro', 'Antonio', 'Sánchez', 'Ramírez', 'Pedro Antonio Sánchez Ramírez', NULL, 'Calle 10 # 20-30, Medellín', '3178901234', 'pedro.sanchez@email.com', 'NATURAL', 'No responsable', '2023-04-10 10:15:00', 1),
	(6, 2, 'CC', '4567890123', 'Carolina', '', 'Vargas', 'Hernández', 'Carolina  Vargas Hernández', NULL, 'Carrera 35 # 40-50, Medellín', '3189012345', 'carolina.vargas@email.com', 'NATURAL', 'No responsable', '2023-04-12 13:50:00', 1),
	(7, 2, 'NIT', '900333444-5', NULL, NULL, NULL, NULL, 'Distribuciones Alimenticias S.A.', 'Distribuciones Alimenticias S.A.', 'Avenida 80 # 60-70, Medellín', '6047654321', 'ventas@distrialimentos.com', 'JURIDICA', 'Responsable de IVA', '2023-04-05 08:30:00', 1),
	(8, 2, 'NIT', '900444555-6', NULL, NULL, NULL, NULL, 'Productos de Aseo Ltda', 'Productos de Aseo Ltda', 'Calle 30 # 40-50, Medellín', '6046543210', 'info@productosaseo.com', 'JURIDICA', 'Responsable de IVA', '2023-04-08 15:45:00', 1);

-- Volcando estructura para tabla sistema_pos.tipos_documentos
CREATE TABLE IF NOT EXISTS `tipos_documentos` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.tipos_documentos: ~0 rows (aproximadamente)
INSERT INTO `tipos_documentos` (`id_tipo`, `nombre`, `codigo`, `descripcion`) VALUES
	(1, 'Factura de Venta', 'FV', 'Factura de venta nacional'),
	(2, 'Factura de Compra', 'FC', 'Factura de compra nacional'),
	(3, 'Nota Crédito', 'NC', 'Nota crédito'),
	(4, 'Nota Débito', 'ND', 'Nota débito'),
	(5, 'Recibo de Caja', 'RC', 'Recibo de caja');

-- Volcando estructura para tabla sistema_pos.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int DEFAULT NULL,
  `primer_nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `segundo_nombre` varchar(100) NOT NULL,
  `primer_apellido` varchar(100) NOT NULL,
  `segundo_apellido` varchar(100) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `ultimo_login` datetime DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `intentos_fallidos` tinyint NOT NULL DEFAULT '0',
  `fecha_bloqueo` datetime DEFAULT NULL,
  `ultimo_cambio_password` datetime DEFAULT NULL,
  `requiere_cambio_password` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `fk_usuarios_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios: ~0 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `id_empresa`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `nombre_completo`, `email`, `password_hash`, `telefono`, `ultimo_login`, `fecha_registro`, `activo`, `intentos_fallidos`, `fecha_bloqueo`, `ultimo_cambio_password`, `requiere_cambio_password`) VALUES
	(1, 1, 'Ana', 'María', 'Gómez', 'López', 'Ana María Gómez López', 'ana.gomez@tecnoshop.com', '$2y$10$rQ4Y2h5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7i8j9', '3101234567', '2024-01-15 08:30:00', '2023-01-15 10:00:00', 1, 0, NULL, '2023-12-01 09:00:00', 0),
	(2, 1, 'Carlos', 'Andrés', 'Mendoza', 'Pérez', 'Carlos Andrés Mendoza Pérez', 'carlos.mendoza@tecnoshop.com', '$2y$10$a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b', '3112345678', '2024-01-14 16:45:00', '2023-02-10 14:30:00', 1, 0, NULL, '2023-12-05 11:20:00', 0),
	(3, 2, 'Roberto', 'José', 'Díaz', 'García', 'Roberto José Díaz García', 'roberto.diaz@superdist.com', '$2y$10$c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d', '3123456789', '2024-01-14 09:15:00', '2023-03-20 08:00:00', 1, 0, NULL, '2023-12-10 15:40:00', 0),
	(4, 2, 'Laura', 'Isabel', 'Martínez', 'Rodríguez', 'Laura Isabel Martínez Rodríguez', 'laura.martinez@superdist.com', '$2y$10$e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f', '3134567890', '2024-01-13 13:20:00', '2023-04-05 11:45:00', 1, 0, NULL, '2023-12-15 10:10:00', 0);

-- Volcando estructura para tabla sistema_pos.usuarios_accesos
CREATE TABLE IF NOT EXISTS `usuarios_accesos` (
  `id_acceso` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `direccion_ip` varchar(45) NOT NULL,
  `exito` tinyint(1) NOT NULL,
  `user_agent` text,
  PRIMARY KEY (`id_acceso`),
  KEY `id_usuario` (`id_usuario`),
  KEY `idx_accesos_fecha` (`fecha`),
  CONSTRAINT `fk_accesos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios_accesos: ~0 rows (aproximadamente)
INSERT INTO `usuarios_accesos` (`id_acceso`, `id_usuario`, `email`, `fecha`, `direccion_ip`, `exito`, `user_agent`) VALUES
	(1, 1, 'ana.gomez@tecnoshop.com', '2024-01-15 08:30:00', '192.168.1.10', 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
	(2, 2, 'carlos.mendoza@tecnoshop.com', '2024-01-14 16:45:00', '192.168.1.11', 1, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
	(3, 3, 'roberto.diaz@superdist.com', '2024-01-14 09:15:00', '192.168.2.10', 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
	(4, 4, 'laura.martinez@superdist.com', '2024-01-13 13:20:00', '192.168.2.11', 1, 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15');

-- Volcando estructura para tabla sistema_pos.usuarios_password_historial
CREATE TABLE IF NOT EXISTS `usuarios_password_historial` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_cambio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_password_historial_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios_password_historial: ~0 rows (aproximadamente)
INSERT INTO `usuarios_password_historial` (`id_historial`, `id_usuario`, `password_hash`, `fecha_cambio`) VALUES
	(1, 1, '$2y$10$oldpasswordhash1oldpasswordhash1oldpasswo', '2023-06-01 09:00:00'),
	(2, 2, '$2y$10$oldpasswordhash2oldpasswordhash2oldpasswo', '2023-07-05 11:20:00'),
	(3, 3, '$2y$10$oldpasswordhash3oldpasswordhash3oldpasswo', '2023-08-10 15:40:00'),
	(4, 4, '$2y$10$oldpasswordhash4oldpasswordhash4oldpasswo', '2023-09-15 10:10:00');

-- Volcando estructura para tabla sistema_pos.usuarios_roles
CREATE TABLE IF NOT EXISTS `usuarios_roles` (
  `id_usuario` int NOT NULL,
  `id_rol` int NOT NULL,
  `id_almacen` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `id_rol` (`id_rol`),
  KEY `id_almacen` (`id_almacen`),
  CONSTRAINT `fk_usuarios_roles_almacenes` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `fk_usuarios_roles_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  CONSTRAINT `fk_usuarios_roles_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios_roles: ~0 rows (aproximadamente)
INSERT INTO `usuarios_roles` (`id_usuario`, `id_rol`, `id_almacen`) VALUES
	(1, 1, 1),
	(2, 2, 2),
	(3, 4, 3),
	(4, 2, 4);

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
  `total_exact` decimal(14,2) NOT NULL DEFAULT '0.00',
  `total_redondeo` decimal(14,2) NOT NULL DEFAULT '0.00',
  `total_final` decimal(14,2) NOT NULL DEFAULT '0.00',
  `estado` int DEFAULT NULL,
  `tipo_venta` enum('CONTADO','CREDITO') NOT NULL DEFAULT 'CONTADO' COMMENT 'Tipo de venta: CONTADO=pago inmediato, CREDITO=pago diferido',
  `fecha_vencimiento` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_venta`),
  KEY `id_tercero` (`id_tercero`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_serie` (`id_serie`),
  KEY `id_factura_electronica` (`id_factura_electronica`),
  KEY `idx_ventas_fecha` (`fecha`),
  KEY `fk_ventas_estados` (`estado`),
  KEY `idx_ventas_fecha_estado` (`fecha`,`estado`),
  KEY `idx_ventas_id_tercero_fecha` (`id_tercero`,`fecha`),
  KEY `idx_ventas_tipo_venta_fecha` (`tipo_venta`,`fecha`),
  CONSTRAINT `fk_ventas_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_ventas_estados` FOREIGN KEY (`estado`) REFERENCES `estados` (`id_estado`),
  CONSTRAINT `fk_ventas_facturas` FOREIGN KEY (`id_factura_electronica`) REFERENCES `facturas` (`id_factura`),
  CONSTRAINT `fk_ventas_series_facturacion` FOREIGN KEY (`id_serie`) REFERENCES `series_facturacion` (`id_serie`),
  CONSTRAINT `fk_ventas_terceros` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`),
  CONSTRAINT `fk_ventas_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas: ~0 rows (aproximadamente)
INSERT INTO `ventas` (`id_venta`, `id_empresa`, `id_tercero`, `id_usuario`, `id_serie`, `consecutivo`, `id_factura_electronica`, `fecha`, `subtotal`, `descuentos`, `impuestos`, `total`, `total_exact`, `total_redondeo`, `total_final`, `estado`, `tipo_venta`, `fecha_vencimiento`, `activo`) VALUES
	(1, 1, 1, 2, 1, 1, 1, '2024-01-10 10:30:00', 2598000.00, 0.00, 493620.00, 3091620.00, 3091620.00, 0.00, 3091620.00, 2, 'CONTADO', NULL, 1),
	(2, 1, 2, 2, 1, 2, 2, '2024-01-12 15:45:00', 353500.00, 0.00, 67165.00, 420665.00, 420665.00, 0.00, 420665.00, 2, 'CONTADO', NULL, 1),
	(3, 2, 5, 4, 3, 1, 3, '2024-01-11 11:20:00', 17200.00, 0.00, 3268.00, 20468.00, 20468.00, 0.00, 20468.00, 2, 'CONTADO', NULL, 1),
	(4, 2, 6, 4, 3, 2, 4, '2024-01-13 14:30:00', 21400.00, 0.00, 4066.00, 25466.00, 25466.00, 0.00, 25466.00, 2, 'CONTADO', NULL, 1);

-- Volcando estructura para tabla sistema_pos.ventas_detalles
CREATE TABLE IF NOT EXISTS `ventas_detalles` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `precio_unitario` decimal(12,4) NOT NULL,
  `descuento` decimal(12,2) NOT NULL DEFAULT '0.00',
  `impuesto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(14,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_detalle`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  KEY `idx_ventas_detalles_producto` (`id_producto`),
  KEY `idx_ventas_detalles_venta` (`id_venta`),
  CONSTRAINT `fk_ventas_detalles_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `fk_ventas_detalles_ventas` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_detalles: ~0 rows (aproximadamente)
INSERT INTO `ventas_detalles` (`id_detalle`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `descuento`, `impuesto`, `total`, `activo`) VALUES
	(1, 1, 1, 1.000, 2550000.0000, 0.00, 484500.00, 2550000.00, 1),
	(2, 1, 2, 2.000, 48000.0000, 0.00, 9120.00, 96000.00, 1),
	(3, 2, 3, 2.000, 18500.0000, 0.00, 7030.00, 37000.00, 1),
	(4, 2, 4, 1.000, 335000.0000, 0.00, 63650.00, 335000.00, 1),
	(5, 3, 5, 2.000, 4700.0000, 0.00, 1786.00, 9400.00, 1),
	(6, 3, 7, 3.000, 2600.0000, 0.00, 1482.00, 7800.00, 1),
	(7, 4, 6, 1.000, 12900.0000, 0.00, 2451.00, 12900.00, 1),
	(8, 4, 8, 1.000, 8900.0000, 0.00, 1691.00, 8900.00, 1);

-- Volcando estructura para tabla sistema_pos.ventas_espera
CREATE TABLE IF NOT EXISTS `ventas_espera` (
  `id_borrador` int NOT NULL AUTO_INCREMENT,
  `id_almacen` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','FINALIZADO','CANCELADO') NOT NULL DEFAULT 'ACTIVO',
  `tipo` enum('TEMPORAL','EN_ESPERA') NOT NULL DEFAULT 'TEMPORAL',
  `fecha_expiracion` datetime DEFAULT NULL,
  `id_tercero` int DEFAULT NULL,
  PRIMARY KEY (`id_borrador`),
  KEY `id_almacen` (`id_almacen`),
  KEY `id_usuario` (`id_usuario`),
  KEY `fk_ventas_espera_terceros` (`id_tercero`),
  CONSTRAINT `fk_ventas_espera_almacenes` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `fk_ventas_espera_terceros` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`),
  CONSTRAINT `fk_ventas_espera_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_espera: ~0 rows (aproximadamente)
INSERT INTO `ventas_espera` (`id_borrador`, `id_almacen`, `id_usuario`, `fecha`, `estado`, `tipo`, `fecha_expiracion`, `id_tercero`) VALUES
	(1, 2, 2, '2024-01-14 16:30:00', 'ACTIVO', 'TEMPORAL', '2024-01-15 16:30:00', 1),
	(2, 4, 4, '2024-01-14 17:45:00', 'ACTIVO', 'EN_ESPERA', '2024-01-16 17:45:00', 5);

-- Volcando estructura para tabla sistema_pos.ventas_espera_detalles
CREATE TABLE IF NOT EXISTS `ventas_espera_detalles` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_borrador` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` decimal(12,3) NOT NULL,
  `precio_unitario` decimal(12,4) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_borrador` (`id_borrador`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `fk_ventas_espera_detalle_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `fk_ventas_espera_detalle_ventas_espera` FOREIGN KEY (`id_borrador`) REFERENCES `ventas_espera` (`id_borrador`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_espera_detalles: ~0 rows (aproximadamente)
INSERT INTO `ventas_espera_detalles` (`id_detalle`, `id_borrador`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
	(1, 1, 2, 1.000, 48000.0000),
	(2, 1, 3, 2.000, 18500.0000),
	(3, 2, 7, 5.000, 2600.0000),
	(4, 2, 8, 2.000, 8900.0000);

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
  `id_cierre_caja` int DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_venta` (`id_venta`),
  KEY `id_metodo` (`id_metodo`),
  KEY `fk_ventas_pagos_cierres_caja` (`id_cierre_caja`),
  CONSTRAINT `fk_ventas_pagos_cierres_caja` FOREIGN KEY (`id_cierre_caja`) REFERENCES `cierres_caja` (`id_cierre_caja`),
  CONSTRAINT `fk_ventas_pagos_metodos_pago` FOREIGN KEY (`id_metodo`) REFERENCES `metodos_pago` (`id_metodo`),
  CONSTRAINT `fk_ventas_pagos_ventas` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_pagos: ~0 rows (aproximadamente)
INSERT INTO `ventas_pagos` (`id_pago`, `id_venta`, `id_metodo`, `monto`, `referencia`, `fecha`, `banco`, `cuenta`, `titular`, `activo`, `id_cierre_caja`) VALUES
	(1, 1, 1, 3091620.00, NULL, '2024-01-10 10:30:00', NULL, NULL, NULL, 1, 1),
	(2, 2, 2, 420665.00, '1234567890', '2024-01-12 15:45:00', 'Bancolombia', 'Ahorros', 'María Alejandra Gutiérrez López', 1, 2),
	(3, 3, 1, 20468.00, NULL, '2024-01-11 11:20:00', NULL, NULL, NULL, 1, 3),
	(4, 4, 4, 25466.00, 'TRF-00123456', '2024-01-13 14:30:00', 'Davivienda', 'Corriente', 'Carolina Vargas Hernández', 1, 4);

-- Volcando estructura para disparador sistema_pos.trg_actualizar_costo_promedio
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_actualizar_costo_promedio` AFTER INSERT ON `compras_detalles` FOR EACH ROW BEGIN
  UPDATE inventario i
  SET i.costo_promedio = (
    SELECT AVG(cd.precio_unitario)
    FROM compras_detalles cd
    JOIN compras c ON cd.id_compra = c.id_compra
    WHERE cd.id_producto = NEW.id_producto
    AND c.estado = 'COMPLETADA'
  )
  WHERE i.id_producto = NEW.id_producto;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador sistema_pos.trg_compras_detalles_historial_precios
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_compras_detalles_historial_precios` AFTER INSERT ON `compras_detalles` FOR EACH ROW BEGIN
  INSERT INTO productos_precios_historial (id_producto, id_presentacion, id_usuario, precio_anterior, precio_nuevo)
  SELECT id_producto, id_presentacion, NEW.id_compra, costo_promedio, NEW.precio_unitario
  FROM inventario
  WHERE id_producto = NEW.id_producto;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

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

-- Volcando estructura para disparador sistema_pos.trg_nombre_completo_usuarios
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_nombre_completo_usuarios` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN
  SET NEW.nombre_completo = CONCAT_WS(' ', 
    NEW.primer_nombre, 
    NEW.segundo_nombre, 
    NEW.primer_apellido, 
    NEW.segundo_apellido
  );
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador sistema_pos.trg_nombre_completo_usuarios_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_nombre_completo_usuarios_update` BEFORE UPDATE ON `usuarios` FOR EACH ROW BEGIN
  SET NEW.nombre_completo = CONCAT_WS(' ', 
    NEW.primer_nombre, 
    NEW.segundo_nombre, 
    NEW.primer_apellido, 
    NEW.segundo_apellido
  );
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
