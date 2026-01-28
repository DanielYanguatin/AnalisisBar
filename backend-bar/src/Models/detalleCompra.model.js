import { pool } from "../db.js";

export class DetalleCompra {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM detalle_compra WHERE idDetalleCompra = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM detalle_compra;");
      return result;
    }
  }

  static async crear({ idCompra, idProducto, cantidad, precio }) {
    const [result] = await pool.query(
      `INSERT INTO detalle_compra (idCompra, idProducto, cantidad, precio)
       VALUES (?, ?, ?, ?);`,
      [idCompra, idProducto, cantidad, precio]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { idCompra, idProducto, cantidad, precio }) {
    const [result] = await pool.query(
      `UPDATE detalle_compra
       SET idCompra = ?, idProducto = ?, cantidad = ?, precio = ?
       WHERE idDetalleCompra = ?;`,
      [idCompra, idProducto, cantidad, precio, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM detalle_compra WHERE idDetalleCompra = ?;",
      [id]
    );
    return result;
  }
}
