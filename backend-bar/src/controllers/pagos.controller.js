import Pago from "../models/pagos.model.js";

export const obtenerPagos = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await Pago.obtener(id);
    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pagos", error });
  }
};

export const crearPago = async (req, res) => {
  const { id_venta, tipo_pago, monto, referencia } = req.body;
  try {
    const { insertId } = await Pago.crear({ id_venta, tipo_pago, monto, referencia });
    res.json({ id_pago: insertId, id_venta, tipo_pago, monto, referencia });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear pago", error });
  }
};

export const actualizarPago = async (req, res) => {
  const { id } = req.params;
  const { id_venta, tipo_pago, monto, referencia } = req.body;
  try {
    const result = await Pago.actualizar(id, { id_venta, tipo_pago, monto, referencia });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json({ id_pago: id, id_venta, tipo_pago, monto, referencia });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar pago", error });
  }
};

export const eliminarPago = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Pago.eliminar(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json({ mensaje: "Pago eliminado", id_pago: id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar pago", error });
  }
};



// import { Pago } from "../models/pagos.model.js";

// export const obtenerPagos = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const resultado = await Pago.obtener(id);

//     if (id && resultado.length === 0) {
//       return res.status(404).json({ mensaje: "Pago no encontrado" });
//     }

//     res.json(id ? resultado[0] : resultado);
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al obtener pagos", error });
//   }
// };

// export const crearPago = async (req, res) => {
//   const { fechaPago, monto, metodoPago, idVenta } = req.body;

//   try {
//     const { insertId } = await Pago.crear({
//       fechaPago,
//       monto,
//       metodoPago,
//       idVenta,
//     });

//     res.json({
//       id: insertId,
//       fechaPago,
//       monto,
//       metodoPago,
//       idVenta,
//     });
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al crear pago", error });
//   }
// };

// export const actualizarPago = async (req, res) => {
//   const { id } = req.params;
//   const { fechaPago, monto, metodoPago, idVenta } = req.body;

//   try {
//     const result = await Pago.actualizar(id, {
//       fechaPago,
//       monto,
//       metodoPago,
//       idVenta,
//     });

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ mensaje: "Pago no encontrado" });
//     }

//     res.json({
//       id,
//       fechaPago,
//       monto,
//       metodoPago,
//       idVenta,
//     });
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al actualizar pago", error });
//   }
// };

// export const eliminarPago = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await Pago.eliminar(id);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ mensaje: "No se encontró el pago" });
//     }

//     res.json({
//       mensaje: "Pago eliminado",
//       id,
//     });
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al eliminar pago", error });
//   }
// };
