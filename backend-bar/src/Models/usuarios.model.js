import { pool } from "../db.js";
import bcrypt from "bcrypt";

export class Usuario {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM usuarios WHERE id_usuario = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM usuarios;");
      return result;
    }
  } 

// En Usuario.js
static async crear({ nombre, contraseña, rol, correo, estado }) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, contraseña, rol, correo, estado)
     VALUES (?, ?, ?, ?, ?);`,
    [nombre, contraseña, rol, correo, estado]
  );
  return { insertId: result.insertId };
}


  static async actualizar(id, { nombre, contrasena, rol, correo, estado }) {
    const [result] = await pool.query(
      `UPDATE usuarios
       SET nombre = ?, contraseña = ?, rol = ?, correo = ?, estado = ?
       WHERE id_usuario = ?;`,
      [nombre, contrasena, rol, correo, estado, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = ?;",
      [id]
    );
    return result;
  }

  static async buscarUsuarioLogin(correo) {
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ?;",
      [correo]
    );
    return result;
  }

  static async existeCorreo(correo) {
    const [rows] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ?;",
      [correo]
    );
    return rows.length > 0;
  }
}
export default Usuario;

/* import { pool } from "../db.js";
import bcrypt from "bcrypt";

export class Usuario {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM usuarios WHERE id_usuario = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM usuarios;");
      return result;
    }
  } 

  static async crear({ nombre, contrasena, rol, correo }) {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, contraseña, rol, correo)
       VALUES (?, ?, ?, ?);`,
      [nombre, contrasena, rol, correo]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { nombre, contrasena, rol, correo }) {
    const [result] = await pool.query(
      `UPDATE usuarios
       SET nombre = ?, contraseña = ?, rol = ?, correo = ?
       WHERE id_usuario = ?;`,
      [nombre, contrasena, rol, correo, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = ?;",
      [id]
    );
    return result;
  }

  static async buscarUsuarioLogin(correo) {
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ?;",
      [correo]
    );
    return result;
  }

  static async existeCorreo(correo) {
    const [rows] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ?;",
      [correo]
    );
    return rows.length > 0;
  }
}
export default Usuario;
 */