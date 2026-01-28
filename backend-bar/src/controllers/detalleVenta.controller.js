import { DetalleVenta } from "../models/detalleVenta.model.js";

export const obtenerDetalleVentas = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await DetalleVenta.obtener(id);

    if (id && resultado.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "Detalle de venta no encontrado" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener detalles de venta", error });
  }
};

export const crearDetalleVenta = async (req, res) => {
  const detalles = req.body;

  if (!Array.isArray(detalles)) {
    return res.status(400).json({ error: "Se esperaba un array de detalles" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const idVenta = detalles[0]?.id_venta;

    if (!detalles.every((d) => d.id_venta === idVenta)) {
      throw new Error("Todos los detalles deben pertenecer a la misma venta");
    }

    for (const detalle of detalles) {
      const { id_producto, cantidad, precio_unitario, descuento } = detalle;

      if (!id_producto || !cantidad || !precio_unitario) {
        throw new Error(`Detalle incompleto para el producto ${id_producto}`);
      }

      const stock = await DetalleVentaModel.obtenerStock(id_producto);

      if (!stock || stock.cantidad < cantidad) {
        throw new Error(
          `Stock insuficiente para el producto ID: ${id_producto}`
        );
      }

      await DetalleVentaModel.crear({
        id_venta,
        idProducto: id_producto,
        cantidad,
        precio_unitario,
        descuento,
      });

      await DetalleVentaModel.actualizarStock(id_producto, cantidad);
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      message: "Detalles de venta registrados correctamente",
      id_venta: id_venta,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
};

export const actualizarDetalleVenta = async (req, res) => {
  const { id } = req.params;
  const { idVenta, idProducto, cantidad, precio } = req.body;

  try {
    const result = await DetalleVenta.actualizar(id, {
      idVenta,
      idProducto,
      cantidad,
      precio,
    });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ mensaje: "Detalle de venta no encontrado" });
    }

    res.json({
      id,
      idVenta,
      idProducto,
      cantidad,
      precio,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar detalle de venta", error });
  }
};

export const eliminarDetalleVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await DetalleVenta.eliminar(id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró el detalle de venta" });
    }

    res.json({
      mensaje: "Detalle de venta eliminado",
      id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar detalle de venta", error });
  }
};
export const obtenerDetalleCompletoVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await DetalleVenta.obtenerDetalleCompletoVenta(id);

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    const respuesta = {
      venta: {
        id_venta: resultado[0].id_venta,
        fecha: resultado[0].fecha,
        total: resultado[0].total,
        estado: resultado[0].estado,
        id_cliente: resultado[0].id_cliente,
        cliente: {
          nombre: resultado[0].nombre_cliente,
          telefono: resultado[0].telefono_cliente,
          direccion: resultado[0].direccion_cliente,
          correo: resultado[0].correo_cliente
        },
        id_usuario: resultado[0].id_usuario
      },
      detalles: resultado.map(item => ({
        id_detalle_venta: item.id_detalle_venta,
        producto: item.producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        descuento: item.descuento,
        subtotal: item.subtotal
      })),
      pagos: resultado.filter(item => item.id_pago).map(item => ({
        id_pago: item.id_pago,
        tipo_pago: item.tipo_pago,
        monto: item.monto,
        referencia: item.referencia
      }))
    };

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener detalle completo de venta", error });
  }
};

// En controllers/detalleVenta.controller.js
// export const obtenerDetalleCompletoVenta = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const resultado = await DetalleVenta.obtenerDetalleCompletoVenta(id);

//     if (resultado.length === 0) {
//       return res.status(404).json({ mensaje: "Venta no encontrada" });
//     }

//     // Puedes estructurar la respuesta como prefieras
//     const respuesta = {
//       venta: {
//         id_venta: resultado[0].id_venta,
//         fecha: resultado[0].fecha,
//         id_cliente: resultado[0].id_cliente,
//         id_usuario: resultado[0].id_usuario,
//         total: resultado[0].total,
//         estado: resultado[0].estado,
//       },
//       detalles: resultado.map(item => ({
//         id_detalle_venta: item.id_detalle_venta,
//         producto: item.producto,
//         cantidad: item.cantidad,
//         precio_unitario: item.precio_unitario,
//         descuento: item.descuento,
//         subtotal: item.subtotal
//       })),
//       pagos: resultado.filter(item => item.id_pago).map(item => ({
//         id_pago: item.id_pago,
//         tipo_pago: item.tipo_pago,
//         monto: item.monto,
//         referencia: item.referencia
//       }))
//     };

//     res.json(respuesta);
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al obtener detalle completo de venta", error });
//   }
// };