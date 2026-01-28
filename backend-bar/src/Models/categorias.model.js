import { pool } from "../db.js";

export class Categoria {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM categorias WHERE idCategoria = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM categorias;");
      return result;
    }
  }

  static async crear({ nombreCategoria, descripcion }) {
    const [result] = await pool.query(
      `INSERT INTO categorias (nombreCategoria, descripcion)
       VALUES (?, ?);`,
      [nombreCategoria, descripcion]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { nombreCategoria, descripcion }) {
    const [result] = await pool.query(
      `UPDATE categorias
       SET nombreCategoria = ?, descripcion = ?
       WHERE idCategoria = ?;`,
      [nombreCategoria, descripcion, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM categorias WHERE idCategoria = ?;",
      [id]
    );
    return result;
  }
}
