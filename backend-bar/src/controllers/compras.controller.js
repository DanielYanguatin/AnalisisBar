
import { Compra } from "../models/compras.model.js";

export const obtenerCompras = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Compra.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener compras", error });
  }
};

export const crearCompra = async (req, res) => {
  const { fecha, total, idProveedor } = req.body;

  try {
    const { insertId } = await Compra.crear({
      fecha,
      total,
      idProveedor,
    });

    res.json({
      id: insertId,
      fecha,
      total,
      idProveedor,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear compra", error });
  }
};

export const actualizarCompra = async (req, res) => {
  const { id } = req.params;
  const { fecha, total, idProveedor } = req.body;

  try {
    const result = await Compra.actualizar(id, {
      fecha,
      total,
      idProveedor,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    res.json({
      id,
      fecha,
      total,
      idProveedor,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar compra", error });
  }
};

export const eliminarCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Compra.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró la compra" });
    }

    res.json({
      mensaje: "Compra eliminada",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar compra", error });
  }
};
