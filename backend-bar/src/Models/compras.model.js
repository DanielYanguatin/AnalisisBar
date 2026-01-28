
import { pool } from "../db.js";

export class Compra {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM compras WHERE idCompra = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM compras;");
      return result;
    }
  }

  static async crear({ fecha, total, idProveedor }) {
    const [result] = await pool.query(
      `INSERT INTO compras (fecha, total, idProveedor)
       VALUES (?, ?, ?);`,
      [fecha, total, idProveedor]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { fecha, total, idProveedor }) {
    const [result] = await pool.query(
      `UPDATE compras
       SET fecha = ?, total = ?, idProveedor = ?
       WHERE idCompra = ?;`,
      [fecha, total, idProveedor, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM compras WHERE idCompra = ?;",
      [id]
    );
    return result;
  }
}
