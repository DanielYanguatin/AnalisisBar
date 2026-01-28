import { Inventario } from "../Models/invetario.model.js";

const formatearFecha = (fecha) => {
  if (!fecha) return null;
  const d = new Date(fecha);
  return d.toISOString().split("T")[0]; // devuelve solo YYYY-MM-DD
}; 

export const obtenerInventario = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Inventario.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Inventario no encontrado" });
    }

    // Función para formatear los datos del inventario
    const formatearFechasInventario = (item) => ({
      ...item,
      fecha_ingreso: formatearFecha(item.fecha_ingreso),
      fecha_vencimiento: formatearFecha(item.fecha_vencimiento),
      ultima_actualizacion: formatearFecha(item.ultima_actualizacion),
    });

    if (id) {
      return res.json(formatearFechasInventario(resultado[0]));
    } else {
      const datosFormateados = resultado.map(formatearFechasInventario);
      return res.json(datosFormateados);
    }

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener inventarios", error });
  }
};

export const crearInventario = async (req, res) => {
  const {
    nombre,
    detalle,
    precio_venta,
    precio_compra,
    precio_mayorista,
    cantidad_mayorista_minima,
    stock,
    stock_minimo,
    stock_maximo,
    unidad_medida,
/*     codigo_barras,
 */    ean_8,
    ean_13,
    codigo_inventario,
    id_categoria,
    id_proveedor,
    id_almacen,
    fecha_ingreso,
    fecha_vencimiento,
    activo = 1,
    comentarios
  } = req.body;

  try {
    const { insertId } = await Inventario.crear({
      nombre,
      detalle,
      precio_venta,
      precio_compra,
      precio_mayorista,
      cantidad_mayorista_minima,
      stock,
      stock_minimo,
      stock_maximo,
      unidad_medida,
/*       codigo_barras,
 */      ean_8,
      ean_13,
      codigo_inventario,
      id_categoria,
      id_proveedor,
      id_almacen,
      fecha_ingreso,
      fecha_vencimiento,
      activo,
      comentarios
    });

    res.status(201).json({
      id: insertId,
      nombre,
      detalle,
      precio_venta,
      precio_compra,
      precio_mayorista,
      cantidad_mayorista_minima,
      stock,
      stock_minimo,
      stock_maximo,
      unidad_medida,
/*       codigo_barras,
 */      ean_8,
      ean_13,
      codigo_inventario,
      id_categoria,
      id_proveedor,
      id_almacen,
      fecha_ingreso: formatearFecha(fecha_ingreso),
      fecha_vencimiento: formatearFecha(fecha_vencimiento),
      activo,
      comentarios
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear inventario", error });
  }
};

export const actualizarInventario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    detalle,
    precio_venta,
    precio_compra,
    precio_mayorista,
    cantidad_mayorista_minima,
    stock,
    stock_minimo,
    stock_maximo,
    unidad_medida,
/*     codigo_barras,
 */    ean_8,
    ean_13,
    codigo_inventario,
    id_categoria,
    id_proveedor,
    id_almacen,
    fecha_ingreso,
    fecha_vencimiento,
    activo,
    comentarios
  } = req.body;

  try {
    const result = await Inventario.actualizar(id, {
      nombre,
      detalle,
      precio_venta,
      precio_compra,
      precio_mayorista,
      cantidad_mayorista_minima,
      stock,
      stock_minimo,
      stock_maximo,
      unidad_medida,
/*       codigo_barras,
 */      ean_8,
      ean_13,
      codigo_inventario,
      id_categoria,
      id_proveedor,
      id_almacen,
      fecha_ingreso,
      fecha_vencimiento,
      activo,
      comentarios
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Inventario no encontrado" });
    }

    res.json({
      id,
      nombre,
      detalle,
      precio_venta,
      precio_compra,
      precio_mayorista,
      cantidad_mayorista_minima,
      stock,
      stock_minimo,
      stock_maximo,
      unidad_medida,
/*       codigo_barras,
 */      ean_8,
      ean_13,
      codigo_inventario,
      id_categoria,
      id_proveedor,
      id_almacen,
      fecha_ingreso: formatearFecha(fecha_ingreso),
      fecha_vencimiento: formatearFecha(fecha_vencimiento),
      activo,
      comentarios
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar inventario", error });
  }
};

export const eliminarInventario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Inventario.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Inventario no encontrado" });
    }

    res.json({
      mensaje: "Inventario eliminado",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar inventario", error });
  }
};

// Métodos adicionales
export const obtenerPorCodigoBarras = async (req, res) => {
  const { codigo } = req.params;

  try {
    const resultado = await Inventario.obtenerPorCodigoBarras(codigo);

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(formatearFechasInventario(resultado[0]));
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar producto", error });
  }
};

export const actualizarStock = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    const result = await Inventario.actualizarStock(id, cantidad);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Inventario no encontrado" });
    }

    res.json({
      mensaje: "Stock actualizado",
      id,
      cantidad
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar stock", error });
  }
};

export const obtenerProductosBajoStockMinimo = async (req, res) => {
  try {
    const resultado = await Inventario.obtenerProductosBajoStockMinimo();
    const datosFormateados = resultado.map(formatearFechasInventario);
    res.json(datosFormateados);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos con bajo stock", error });
  }
};

// Función auxiliar para formatear fechas (repetida para claridad)
function formatearFechasInventario(item) {
  return {
    ...item,
    fecha_ingreso: formatearFecha(item.fecha_ingreso),
    fecha_vencimiento: formatearFecha(item.fecha_vencimiento),
    ultima_actualizacion: formatearFecha(item.ultima_actualizacion),
  };
}
export const buscarInventario = async (req, res) => {
  try {
    const { termino, campo } = req.query;

    // Validaciones
    if (!termino || !campo) {
      return res.status(400).json({ mensaje: "El término de búsqueda y el campo son requeridos" });
    }

    const camposPermitidos = [
      "id_inventario", "ean_13", "nombre", "detalle", 
      "precio_venta", "stock", "unidad_medida", "activo"
    ];

    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({ mensaje: "Campo de búsqueda no válido" });
    }

    const resultados = await Inventario.buscar(termino, campo);
    
    // Manejo cuando no hay resultados
    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron resultados" });
    }
    
    return res.json(resultados);

  } catch (error) {
    console.error("Error al buscar en inventario:", error);
    return res.status(500).json({ 
      mensaje: "Error interno al buscar en el inventario",
      error: error.message 
    });
  }
}
// controllers/inventarioController.js
export class InventarioController {
  static async buscarProductos(req, res) {
    const { termino } = req.query;
    
    if (!termino || termino.length < 2) {
      return res.json([]);
    }

    try {
      const productos = await Inventario.buscar(termino);
      
      const resultados = productos.map(p => ({
        id: p.id_inventario,
        codigo: p.codigo_inventario || p.ean_13 || p.ean_8, // Prioriza código, luego EANs
        nombre: p.nombre,
        precio_venta: p.precio_venta,
        stock: p.stock,
        unidad_medida: p.unidad_medida,
        ean_13: p.ean_13,
        ean_8: p.ean_8
      }));

      res.json(resultados);
    } catch (error) {
      console.error("Error buscando productos:", error);
      res.status(500).json({ 
        error: "Error al buscar productos",
        detalles: error.message 
      });
    }
  }
}
// export class InventarioController {
//   // Buscar productos por código (para autocompletar)
//   static async buscarProductos(req, res) {
//     const { termino } = req.query;
//     try {
//       const productos = await Inventario.buscar(termino, 'codigo_inventario');
//       res.json(productos.map(p => ({
//         id: p.id_inventario,
//         codigo: p.codigo_inventario,
//         nombre: p.nombre,
//         precio: p.precio_venta,
//         stock: p.stock
//       })));
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }