import { pool } from "../db.js";

export class Proveedor {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM proveedores WHERE id_proveedor = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM proveedores;");
      return result;
    }
  }

  static async crear({ nombre, direccion, telefono, correo, activo = 1 }) {
    const [result] = await pool.query(
      `INSERT INTO proveedores (nombre, direccion, telefono, correo, activo)
       VALUES (?, ?, ?, ?, ?);`,
      [nombre, direccion, telefono, correo, activo]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(id, { nombre, direccion, telefono, correo, activo }) {
    const [result] = await pool.query(
      `UPDATE proveedores
       SET nombre = ?, direccion = ?, telefono = ?, correo = ?, activo = ?
       WHERE id_proveedor = ?;`,
      [nombre, direccion, telefono, correo, activo, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM proveedores WHERE id_proveedor = ?;",
      [id]
    );
    return result;
  }
}

// import { pool } from "../db.js";

// export class Proveedor {
//   static async obtener(id = null) {
//     if (id) {
//       const [result] = await pool.query(
//         "SELECT * FROM proveedores WHERE idProveedor = ?;",
//         [id]
//       );
//       return result;
//     } else {
//       const [result] = await pool.query("SELECT * FROM proveedores;");
//       return result;
//     }
//   }

//   static async crear({ nombreP, apellidoP, direccion, telefono, correo }) {
//     const [result] = await pool.query(
//       `INSERT INTO proveedores (nombreP, apellidoP, direccion, telefono, correo)
//        VALUES (?, ?, ?, ?, ?);`,
//       [nombreP, apellidoP, direccion, telefono, correo]
//     );
//     return { insertId: result.insertId };
//   }

//   static async actualizar(id, { nombreP, apellidoP, direccion, telefono, correo }) {
//     const [result] = await pool.query(
//       `UPDATE proveedores
//        SET nombreP = ?, apellidoP = ?, direccion = ?, telefono = ?, correo = ?
//        WHERE idProveedor = ?;`,
//       [nombreP, apellidoP, direccion, telefono, correo, id]
//     );
//     return result;
//   }

//   static async eliminar(id) {
//     const [result] = await pool.query(
//       "DELETE FROM proveedores WHERE idProveedor = ?;",
//       [id]
//     );
//     return result;
//   }
// }
