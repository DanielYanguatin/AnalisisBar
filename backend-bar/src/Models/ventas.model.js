import { pool } from "../db.js";

export class Venta {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM ventas WHERE id_venta = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM ventas;");
      return result;
    }
  }

/*   static async crear({ fecha, total, idCliente }) {
    const [result] = await pool.query(
      `INSERT INTO ventas (fecha, total, idCliente)
       VALUES (?, ?, ?);`,
      [fecha, total, idCliente]
    );
    return { insertId: result.insertId };
  }
 */
  static async actualizar(id, { fecha, total, idCliente }) {
    const [result] = await pool.query(
      `UPDATE ventas
       SET fecha = ?, total = ?, idCliente = ?
       WHERE id_venta = ?;`,
      [fecha, total, idCliente, id]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM ventas WHERE id_venta = ?;",
      [id]
    );
    return result;
  }


static async crear(ventaData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insertar en tabla ventas
        const [ventaResult] = await connection.query(
            `INSERT INTO ventas 
             (id_usuario, id_cliente, fecha, total, estado) 
             VALUES (?, ?, NOW(), ?, ?)`,
            [
                ventaData.venta.id_usuario,
                ventaData.venta.id_cliente,
                ventaData.venta.total,
                ventaData.venta.estado
            ]
        );

        const idVenta = ventaResult.insertId;

        // 2. Insertar detalles de venta
        for (const producto of ventaData.productos) {
            await connection.query(
                `INSERT INTO detalle_venta 
                 (id_venta, id_producto, cantidad, precio_unitario, descuento) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    idVenta,
                    producto.id_producto,
                    producto.cantidad,
                    producto.precio_unitario,
                    producto.descuento
                ]
            );
        }

        // 3. Insertar pago (con referencia personalizada)
        if (ventaData.venta.forma_pago) {
            let referencia = "";

            switch (ventaData.venta.forma_pago) {
                case "efectivo":
                    referencia = "EF-" + idVenta;
                    break;
                case "tarjeta":
                    referencia = "TC-" + idVenta;
                    break;
                case "transferencia":
                    referencia = "TRF-" + idVenta;
                    break;
                default:
                    referencia = "OTRO-" + idVenta; // en caso de que se agreguen más formas en el futuro
                    break;
            }

            await connection.query(
                `INSERT INTO pagos 
                 (id_venta, tipo_pago, monto, referencia) 
                 VALUES (?, ?, ?, ?)`,
                [
                    idVenta,
                    ventaData.venta.forma_pago,
                    ventaData.venta.monto_recibido || ventaData.venta.total,
                    referencia
                ]
            );
        }

        await connection.commit();
        return { success: true, id_venta: idVenta };
    } catch (error) {
        await connection.rollback();
        console.error("Error en transacción de venta:", error);
        throw error;
    } finally {
        connection.release();
    }
}
}
