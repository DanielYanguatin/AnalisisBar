import { Cliente } from "../models/clientes.model.js";
import { pool } from "../db.js";


// Función para formatear fechas en formato "YYYY-MM-DD"
const formatearFecha = (fecha) => {
  if (!fecha) return null;
  const d = new Date(fecha);
  return d.toISOString().split("T")[0]; 
};

export const obtenerClientes = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Cliente.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error });
  }
};

export const crearCliente = async (req, res) => {
  const { nombre, telefono, direccion, correo, estado = 1 } = req.body;

  try {
    const { insertId } = await Cliente.crear({
      nombre,
      telefono,
      direccion,
      correo,
      estado,
    });

    res.json({
      id: insertId,
      nombre,
      telefono,
      direccion,
      correo,
      estado,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear cliente", error });
  }
};

export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, direccion, correo, estado } = req.body;

  try {
    const result = await Cliente.actualizar(id, {
      nombre,
      telefono,
      direccion,
      correo,
      estado,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json({
      id,
      nombre,
      telefono,
      direccion,
      correo,
      estado,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar cliente", error });
  }
};

export const eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Cliente.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el cliente" });
    }

    res.json({
      mensaje: "Cliente eliminado",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error });
  }
};

export class ClientesController {
  // Buscar clientes por nombre (para autocompletar)
  static async buscarClientes(req, res) {
    const { termino } = req.query;
    try {
      const [clientes] = await pool.query(
        "SELECT id_cliente, nombre, telefono FROM clientes WHERE nombre LIKE ? LIMIT 10",
        [`%${termino}%`]
      );
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
/* import { Cliente } from "../models/clientes.model.js";

export const obtenerClientes = async (req, res) => {
  const { id } = req.params;
 
  try {
    const resultado = await Cliente.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error });
  }
};

export const crearCliente = async (req, res) => {
  const { nombreC, apellidoC, direccion, telefono, correo } = req.body;

  try {
    const { insertId } = await Cliente.crear({
      nombreC,
      apellidoC,
      direccion,
      telefono,
      correo,
    });

    res.json({
      id: insertId,
      nombreC,
      apellidoC,
      direccion,
      telefono,
      correo,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear cliente", error });
  }
};

export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombreC, apellidoC, direccion, telefono, correo } = req.body;

  try {
    const result = await Cliente.actualizar(id, {
      nombreC,
      apellidoC,
      direccion,
      telefono,
      correo,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json({
      id,
      nombreC,
      apellidoC,
      direccion,
      telefono,
      correo,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar cliente", error });
  }
};

export const eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Cliente.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el cliente" });
    }

    res.json({
      mensaje: "Cliente eliminado",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error });
  }
};
 */