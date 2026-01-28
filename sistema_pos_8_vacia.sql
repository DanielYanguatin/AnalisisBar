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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.almacenes: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.auditoria: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.categorias: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.compras: ~0 rows (aproximadamente)

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
  CONSTRAINT `fk_configuracion_tickets_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.configuracion_tickets: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.devoluciones: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.devoluciones_detalles: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.empresas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.estados
CREATE TABLE IF NOT EXISTS `estados` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL COMMENT 'Descripción del estado',
  `tipo_estado` varchar(50) DEFAULT NULL COMMENT 'Tipo de estado (VENTA, COMPRA, etc)',
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.estados: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.facturas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.impuestos
CREATE TABLE IF NOT EXISTS `impuestos` (
  `id_impuesto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `porcentaje` decimal(5,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_impuesto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.impuestos: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.inventario: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro de todos los movimientos de inventario con su tipo y referencia';

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

-- Volcando estructura para tabla sistema_pos.permisos
CREATE TABLE IF NOT EXISTS `permisos` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(100) NOT NULL,
  PRIMARY KEY (`id_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.permisos: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_codigos: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_precios: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_precios_historial: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_presentaciones: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.productos_presentaciones_unidades
CREATE TABLE IF NOT EXISTS `productos_presentaciones_unidades` (
  `id_unidad` int NOT NULL AUTO_INCREMENT,
  `nombre_unidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_unidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.productos_presentaciones_unidades: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.promociones: ~0 rows (aproximadamente)

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
  KEY `idx_terceros_documento` (`numero_documento`),
  KEY `idx_terceros_nombre_completo` (`nombre_completo`),
  KEY `idx_terceros_nombre_comercial` (`nombre_comercial`),
  KEY `idx_terceros_email` (`email`),
  CONSTRAINT `fk_terceros_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.terceros: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.tipos_documentos
CREATE TABLE IF NOT EXISTS `tipos_documentos` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.tipos_documentos: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios_accesos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_pos.usuarios_password_historial
CREATE TABLE IF NOT EXISTS `usuarios_password_historial` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_cambio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_password_historial_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.usuarios_password_historial: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas: ~0 rows (aproximadamente)

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
  `id_tercero` int DEFAULT NULL,
  PRIMARY KEY (`id_borrador`),
  KEY `id_almacen` (`id_almacen`),
  KEY `id_usuario` (`id_usuario`),
  KEY `fk_ventas_espera_terceros` (`id_tercero`),
  CONSTRAINT `fk_ventas_espera_almacenes` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  CONSTRAINT `fk_ventas_espera_terceros` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`),
  CONSTRAINT `fk_ventas_espera_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_espera: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_espera_detalles: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_pos.ventas_pagos: ~0 rows (aproximadamente)

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
