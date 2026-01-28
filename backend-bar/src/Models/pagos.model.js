import { pool } from "../db.js";

const Pago = {
  async obtener(id) {
    const [rows] = id 
      ? await pool.query("SELECT * FROM pagos WHERE id_pago = ?", [id]) 
      : await pool.query("SELECT * FROM pagos");
    return rows;
  },

  async crear({ id_venta, tipo_pago, monto, referencia }) {
    const [result] = await pool.query(
      "INSERT INTO pagos (id_venta, tipo_pago, monto, referencia) VALUES (?, ?, ?, ?)",
      [id_venta, tipo_pago, monto, referencia]
    );
    return result;
  },

  async actualizar(id, { id_venta, tipo_pago, monto, referencia }) {
    const [result] = await pool.query(
      "UPDATE pagos SET id_venta = ?, tipo_pago = ?, monto = ?, referencia = ? WHERE id_pago = ?",
      [id_venta, tipo_pago, monto, referencia, id]
    );
    return result;
  },

  async eliminar(id) {
    const [result] = await pool.query("DELETE FROM pagos WHERE id_pago = ?", [id]);
    return result;
  }
};

export default Pago;

/* import { pool } from "../db.js";

export class Pago {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM pagos WHERE idPago = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM pagos;");
      return result;
    }
  }

  static async crear({ fechaPago, monto, metodoPago, idVenta }) {
    const [result] = await pool.query(
      `INSERT INTO pagos (fechaPago, monto, metodoPago, idVenta)
       VALUES (?, ?, ?, ?);`,
      [fechaPago, monto, metodoPago, idVenta]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { fechaPago, monto, metodoPago, idVenta }) {
    const [result] = await pool.query(
      `UPDATE pagos
       SET fechaPago = ?, monto = ?, metodoPago = ?, idVenta = ?
       WHERE idPago = ?;`,
      [fechaPago, monto, metodoPago, idVenta, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM pagos WHERE idPago = ?;",
      [id]
    );
    return result;
  }
}
 */