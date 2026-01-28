import { pool } from "../db.js";

export class Cliente {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM clientes WHERE id_cliente = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM clientes;");
      return result;
    }
  }

  static async crear({ nombre, telefono, direccion, correo, estado = 1 }) {
    const [result] = await pool.query(
      `INSERT INTO clientes (nombre, telefono, direccion, correo, estado)
       VALUES (?, ?, ?, ?, ?);`,
      [nombre, telefono, direccion, correo, estado]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { nombre, telefono, direccion, correo, estado }) {
    const [result] = await pool.query(
      `UPDATE clientes
       SET nombre = ?, telefono = ?, direccion = ?, correo = ?, estado = ?
       WHERE id_cliente = ?;`,
      [nombre, telefono, direccion, correo, estado, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM clientes WHERE id_cliente = ?;",
      [id]
    );
    return result;
  }
}


/* import { pool } from "../db.js";

export class Cliente {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM clientes WHERE idCliente = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM clientes;");
      return result;
    }
  }

  static async crear({ nombreC, apellidoC, direccion, telefono, correo }) {
    const [result] = await pool.query(
      `INSERT INTO clientes (nombreC, apellidoC, direccion, telefono, correo)
       VALUES (?, ?, ?, ?, ?);`,
      [nombreC, apellidoC, direccion, telefono, correo]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { nombreC, apellidoC, direccion, telefono, correo }) {
    const [result] = await pool.query(
      `UPDATE clientes
       SET nombreC = ?, apellidoC = ?, direccion = ?, telefono = ?, correo = ?
       WHERE idCliente = ?;`,
      [nombreC, apellidoC, direccion, telefono, correo, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM clientes WHERE idCliente = ?;",
      [id]
    );
    return result;
  }
}
 */