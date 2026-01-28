import { DetalleCompra } from "../models/detalleCompra.model.js";

export const obtenerDetalleCompras = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await DetalleCompra.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Detalle de compra no encontrado" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener detalles de compra", error });
  }
};

export const crearDetalleCompra = async (req, res) => {
  const { idCompra, idProducto, cantidad, precio } = req.body;

  try {
    const { insertId } = await DetalleCompra.crear({
      idCompra,
      idProducto,
      cantidad,
      precio,
    });

    res.json({
      id: insertId,
      idCompra,
      idProducto,
      cantidad,
      precio,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear detalle de compra", error });
  }
};

export const actualizarDetalleCompra = async (req, res) => {
  const { id } = req.params;
  const { idCompra, idProducto, cantidad, precio } = req.body;

  try {
    const result = await DetalleCompra.actualizar(id, {
      idCompra,
      idProducto,
      cantidad,
      precio,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Detalle de compra no encontrado" });
    }

    res.json({
      id,
      idCompra,
      idProducto,
      cantidad,
      precio,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar detalle de compra", error });
  }
};

export const eliminarDetalleCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await DetalleCompra.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el detalle de compra" });
    }

    res.json({
      mensaje: "Detalle de compra eliminado",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar detalle de compra", error });
  }
};
