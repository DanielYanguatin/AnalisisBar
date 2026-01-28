import { pool } from "../db.js";

export class DetalleVenta {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM detalle_venta WHERE id_detalle_venta = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM detalle_venta;");
      return result;
    }
  }

  static async crear({
    idVenta,
    idProducto,
    cantidad,
    precio_unitario,
    descuento = 0,
  }) {
    const [result] = await pool.query(
      `INSERT INTO detalle_venta 
       (id_venta, id_producto, cantidad, precio_unitario, descuento)
       VALUES (?, ?, ?, ?, ?)`,
      [idVenta, idProducto, cantidad, precio_unitario, descuento]
    );
    return { insertId: result.insertId };
  }

  static async actualizarStock(idProducto, cantidadVendida) {
    await pool.query(
      `UPDATE inventario SET cantidad = cantidad - ? WHERE id_inventario = ?`,
      [cantidadVendida, idProducto]
    );
  }

  static async obtenerStock(idProducto) {
    const [rows] = await pool.query(
      `SELECT cantidad FROM inventario WHERE id_inventario = ?`,
      [idProducto]
    );
    return rows[0];
  }

  static async obtenerPorVenta(idVenta) {
    const [rows] = await pool.query(
      `SELECT * FROM detalle_venta WHERE id_venta = ?`,
      [idVenta]
    );
    return rows;
  }

  static async actualizar(id, { idVenta, idProducto, cantidad, precio }) {
    const [result] = await pool.query(
      `UPDATE detalle_venta
       SET id_venta = ?, idProducto = ?, cantidad = ?, precio = ?
       WHERE id_detalle_venta = ?;`,
      [idVenta, idProducto, cantidad, precio, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM detalle_venta WHERE id_detalle_venta = ?;",
      [id]
    );
    return result;
  }
  
   static async obtenerDetalleCompletoVenta(idVenta) {
  const [result] = await pool.query(
    `SELECT 
      v.id_venta,
      v.fecha,
      v.id_cliente,
      c.nombre AS nombre_cliente,
      c.telefono AS telefono_cliente,
      c.direccion AS direccion_cliente,
      c.correo AS correo_cliente,
      v.id_usuario,
      v.total,
      v.estado,

      dv.id_detalle_venta,
      p.nombre AS producto,
      dv.cantidad,
      dv.precio_unitario,
      dv.descuento,
      (dv.cantidad * dv.precio_unitario - dv.descuento) AS subtotal,

      pa.id_pago,
      pa.tipo_pago,
      pa.monto,
      pa.referencia

    FROM ventas v
    INNER JOIN clientes c ON v.id_cliente = c.id_cliente
    INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    INNER JOIN inventario p ON dv.id_producto = p.id_inventario
    LEFT JOIN pagos pa ON v.id_venta = pa.id_venta

    WHERE v.id_venta = ?`,
    [idVenta]
  );
  return result;
}

}
// En models/detalleVenta.model.js

