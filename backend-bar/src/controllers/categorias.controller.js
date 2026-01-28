import { Categoria } from "../models/categorias.model.js";

export const obtenerCategorias = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Categoria.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener categorías", error });
  }
};

export const crearCategoria = async (req, res) => {
  const { nombreCategoria, descripcion } = req.body;

  try {
    const { insertId } = await Categoria.crear({
      nombreCategoria,
      descripcion,
    });

    res.json({
      id: insertId,
      nombreCategoria,
      descripcion,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear categoría", error });
  }
};

export const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombreCategoria, descripcion } = req.body;

  try {
    const result = await Categoria.actualizar(id, {
      nombreCategoria,
      descripcion,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json({
      id,
      nombreCategoria,
      descripcion,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar categoría", error });
  }
};

export const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Categoria.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró la categoría" });
    }

    res.json({
      mensaje: "Categoría eliminada",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar categoría", error });
  }
};
