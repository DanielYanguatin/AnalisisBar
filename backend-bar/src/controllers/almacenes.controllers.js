import Almacenes from "../models/almacenes.model.js";

export const obtenerAlmacenes = async (req, res) => {
  try {
    const almacenes = await Almacenes.obtenerTodos();
    res.json(almacenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener almacenes", error });
  }
};

export const obtenerAlmacenPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const almacen = await Almacenes.obtenerPorId(id);
    if (almacen.length === 0) {
      return res.status(404).json({ mensaje: "Almacén no encontrado" });
    }
    res.json(almacen[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener almacén", error });
  }
};

export const crearAlmacen = async (req, res) => {
  const { nombre, direccion, telefono, encargado, activo } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: "El nombre es obligatorio" });
  }

  try {
    const result = await Almacenes.crear({ nombre, direccion, telefono, encargado, activo });
    res.status(201).json({ id: result.insertId, nombre, direccion, telefono, encargado, activo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear almacén", error });
  }
};

export const actualizarAlmacen = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, encargado, activo } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: "El nombre es obligatorio" });
  }

  try {
    const result = await Almacenes.actualizar(id, { nombre, direccion, telefono, encargado, activo });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Almacén no encontrado" });
    }

    res.json({ id, nombre, direccion, telefono, encargado, activo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar almacén", error });
  }
};

export const eliminarAlmacen = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Almacenes.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Almacén no encontrado" });
    }

    res.json({ mensaje: "Almacén eliminado", id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar almacén", error });
  }
};
