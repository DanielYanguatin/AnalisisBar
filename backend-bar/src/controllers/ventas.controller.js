import { Venta } from "../models/ventas.model.js";

// Función para formatear fechas a "YYYY-MM-DD"
const formatearFecha = (fecha) => {
  if (!fecha) return null;
  const d = new Date(fecha);
  return d.toISOString().split("T")[0];
};

export const obtenerVentas = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Venta.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ventas", error });
  }
};

export const actualizarVenta = async (req, res) => {
  const { id } = req.params;
  const { fecha, total, idCliente } = req.body;

  try {
    const result = await Venta.actualizar(id, {
      fecha: formatearFecha(fecha),
      total,
      idCliente,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    res.json({
      id,
      fecha: formatearFecha(fecha),
      total,
      idCliente,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar venta", error });
  }
};

export const eliminarVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Venta.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró la venta" });
    }

    res.json({
      mensaje: "Venta eliminada",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar venta", error });
  }
};





export const crearVenta = async (req, res) => {
    try {
        const ventaData = req.body;

        // Validación 1: Estructura básica del request
        if (!ventaData.venta || !ventaData.productos || ventaData.productos.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos: Se requieren objeto venta y al menos un producto"
            });
        }

        // Validación 2: Campos obligatorios
        if (!ventaData.venta.id_usuario || !ventaData.venta.id_cliente) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos: Se requieren id_usuario e id_cliente"
            });
        }

        // Validación 3: Total positivo
        if (ventaData.venta.total <= 0) {
            return res.status(400).json({
                success: false,
                message: "El total debe ser un valor positivo"
            });
        }

        // Validación 4: Cantidades de productos
        if (ventaData.productos.some(p => p.cantidad <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Las cantidades de productos deben ser positivas"
            });
        }

        // Validación 5: Monto recibido en efectivo
        if (ventaData.venta.forma_pago === 'efectivo' && ventaData.venta.monto_recibido < ventaData.venta.total) {
            return res.status(400).json({
                success: false,
                message: "El monto recibido no cubre el total de la venta"
            });
        }

        // Validación 6: Precios unitarios válidos
        if (ventaData.productos.some(p => p.precio_unitario <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Los precios unitarios deben ser positivos"
            });
        }

        // Si pasa todas las validaciones, proceder con la creación
        const resultado = await Venta.crear(ventaData);

        res.json({
            success: true,
            id_venta: resultado.id_venta,
            message: "Venta registrada correctamente"
        });
    } catch (error) {
        console.error("Error en crearVenta:", error);
        
        // Manejo específico de errores de MySQL
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: "Error de referencia: Verifique IDs de usuario, cliente o productos"
            });
        }

        // Manejo de errores de validación de la base de datos
        if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return res.status(400).json({
                success: false,
                message: "Error de validación: " + error.sqlMessage
            });
        }

        res.status(500).json({
            success: false,
            message: "Error al registrar la venta",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
// export const crearVenta = async (req, res) => {
//     try {
//         const ventaData = req.body;

//         // Validación simplificada pero efectiva
//         if (!ventaData.venta?.id_usuario || !ventaData.venta?.id_cliente || 
//             !ventaData.productos?.length) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Datos incompletos: Se requieren id_usuario, id_cliente y productos"
//             });
//         }

//         const resultado = await Venta.crear(ventaData);

//         res.json({
//             success: true,
//             id_venta: resultado.id_venta,
//             message: "Venta registrada correctamente"
//         });
//     } catch (error) {
//         console.error("Error en crearVenta:", error);
        
//         // Manejo específico de errores de MySQL
//         if (error.code === 'ER_NO_REFERENCED_ROW_2') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Error de referencia: Verifique IDs de usuario, cliente o productos"
//             });
//         }

//         res.status(500).json({
//             success: false,
//             message: "Error al registrar la venta"
//         });
//     }
// };