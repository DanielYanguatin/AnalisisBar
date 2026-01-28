import {pool} from "../db.js";

const obtenerTodos = async () => {
  const [rows] = await pool.query("SELECT * FROM almacenes");
  return rows;
};

const obtenerPorId = async (id) => {
  const [rows] = await pool.query("SELECT * FROM almacenes WHERE id_almacen = ?", [id]);
  return rows;
};

const crear = async ({ nombre, direccion, telefono, encargado, activo = 1 }) => {
  const [result] = await pool.query(
    `INSERT INTO almacenes (nombre, direccion, telefono, encargado, activo) 
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, direccion, telefono, encargado, activo]
  );
  return result;
};

const actualizar = async (id, datos) => {
  const { nombre, direccion, telefono, encargado, activo } = datos;
  const [result] = await pool.query(
    `UPDATE almacenes SET nombre = ?, direccion = ?, telefono = ?, encargado = ?, activo = ? WHERE id_almacen = ?`,
    [nombre, direccion, telefono, encargado, activo, id]
  );
  return result;
};

const eliminar = async (id) => {
  const [result] = await pool.query("DELETE FROM almacenes WHERE id_almacen = ?", [id]);
  return result;
};

export default {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
