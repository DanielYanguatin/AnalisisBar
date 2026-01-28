import { pool } from "../db.js";

export class Inventario {
  static async obtener(id = null) {
    if (id) {
      const [result] = await pool.query(
        "SELECT * FROM inventario WHERE id_inventario = ?;",
        [id]
      );
      return result;
    } else {
      const [result] = await pool.query("SELECT * FROM inventario;");
      return result;
    }
  }

  static async crear({
    nombre,
    detalle,
    precio_venta,
    precio_compra,
    precio_mayorista,
    cantidad_mayorista_minima,
    stock,
    stock_minimo,
    stock_maximo,
    unidad_medida,
    /*     codigo_barras,
     */ ean_8,
    ean_13,
    codigo_inventario,
    id_categoria,
    id_proveedor,
    id_almacen,
    fecha_ingreso,
    fecha_vencimiento,
    activo = 1,
    comentarios,
  }) {
    const [result] = await pool.query(
      `INSERT INTO inventario 
        (nombre, detalle, precio_venta, precio_compra, precio_mayorista, 
         cantidad_mayorista_minima, stock, stock_minimo, stock_maximo, 
         unidad_medida, ean_8, ean_13, codigo_inventario, 
         id_categoria, id_proveedor, id_almacen, fecha_ingreso, 
         fecha_vencimiento, activo, comentarios)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        nombre,
        detalle,
        precio_venta,
        precio_compra,
        precio_mayorista,
        cantidad_mayorista_minima,
        stock,
        stock_minimo,
        stock_maximo,
        unidad_medida,
        /*         codigo_barras codigo_barras,,
         */ ean_8,
        ean_13,
        codigo_inventario,
        id_categoria,
        id_proveedor,
        id_almacen,
        fecha_ingreso,
        fecha_vencimiento,
        activo,
        comentarios,
      ]
    );
    return { insertId: result.insertId };
  }

  static async actualizar(
    id,
    {
      nombre,
      detalle,
      precio_venta,
      precio_compra,
      precio_mayorista,
      cantidad_mayorista_minima,
      stock,
      stock_minimo,
      stock_maximo,
      unidad_medida,
      /*     codigo_barras,
       */ ean_8,
      ean_13,
      codigo_inventario,
      id_categoria,
      id_proveedor,
      id_almacen,
      fecha_ingreso,
      fecha_vencimiento,
      activo,
      comentarios,
    }
  ) {
    const [result] = await pool.query(
      `UPDATE inventario
       SET 
         nombre = ?, 
         detalle = ?, 
         precio_venta = ?, 
         precio_compra = ?, 
         precio_mayorista = ?,
         cantidad_mayorista_minima = ?,
         stock = ?, 
         stock_minimo = ?,
         stock_maximo = ?,
         unidad_medida = ?,
         ean_8 = ?,
         ean_13 = ?,
         codigo_inventario = ?,
         id_categoria = ?,
         id_proveedor = ?,
         id_almacen = ?,
         fecha_ingreso = ?,
         fecha_vencimiento = ?,
         activo = ?,
         comentarios = ?,
         ultima_actualizacion = CURRENT_TIMESTAMP
       WHERE id_inventario = ?;`,
      [
        nombre,
        detalle,
        precio_venta,
        precio_compra,
        precio_mayorista,
        cantidad_mayorista_minima,
        stock,
        stock_minimo,
        stock_maximo,
        unidad_medida,
        /*         codigo_barras AGREGAR AL SQL,
         */ ean_8,
        ean_13,
        codigo_inventario,
        id_categoria,
        id_proveedor,
        id_almacen,
        fecha_ingreso,
        fecha_vencimiento,
        activo,
        comentarios,
        id,
      ]
    );
    return result;
  }

  static async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM inventario WHERE id_inventario = ?;",
      [id]
    );
    return result;
  }

  // Métodos adicionales útiles
  static async obtenerPorCodigoBarras(codigo) {
    const [result] = await pool.query(
      "SELECT * FROM inventario WHERE ean_13 = ?;",
      [codigo]
    );
    return result;
  }

  static async actualizarStock(id, cantidad) {
    const [result] = await pool.query(
      "UPDATE inventario SET stock = stock + ? WHERE id_inventario = ?;",
      [cantidad, id]
    );
    return result;
  }

  static async obtenerProductosBajoStockMinimo() {
    const [result] = await pool.query(
      "SELECT * FROM inventario WHERE stock < stock_minimo;"
    );
    return result;
  }
  // Modifica el método buscar en models/Inventario.js
  static async buscar(termino) {
    try {
      // Busca en código, nombre, EAN-13 y EAN-8
      const sql = `
SELECT * FROM inventario 
      WHERE codigo_inventario LIKE ? 
         OR nombre LIKE ? 
         OR ean_13 LIKE ? 
         OR ean_8 LIKE ?
      LIMIT 10`;

      const [result] = await pool.query(sql, [
        `%${termino}%`,
        `%${termino}%`,
        `%${termino}%`,
        `%${termino}%`,
      ]);

      return result;
    } catch (error) {
      console.error("Error en Inventario.buscar:", error);
      throw error;
    }
  }
}
