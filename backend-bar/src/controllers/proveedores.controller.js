import { Proveedor } from "../models/proveedores.model.js";

export const obtenerProveedores = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Proveedor.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener proveedores", error });
  }
};

export const crearProveedor = async (req, res) => {
  const { nombre, direccion, telefono, correo, activo = 1 } = req.body;

  try {
    const { insertId } = await Proveedor.crear({
      nombre,
      direccion,
      telefono,
      correo,
      activo,
    });

    res.json({
      id: insertId,
      nombre,
      direccion,
      telefono,
      correo,
      activo,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear proveedor", error });
  }
};

export const actualizarProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, correo, activo } = req.body;

  try {
    const result = await Proveedor.actualizar(id, {
      nombre,
      direccion,
      telefono,
      correo,
      activo,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.json({
      id,
      nombre,
      direccion,
      telefono,
      correo,
      activo,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar proveedor", error });
  }
};

export const eliminarProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Proveedor.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el proveedor" });
    }

    res.json({
      mensaje: "Proveedor eliminado",
      id,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar proveedor", error });
  }
};

// import { Proveedor } from "../models/proveedores.model.js";

// export const obtenerProveedores = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const resultado = await Proveedor.obtener(id);

//     if (id && resultado.length === 0) {
//       return res.status(404).json({ mensaje: "Proveedor no encontrado" });
//     }

//     res.json(id ? resultado[0] : resultado);
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al obtener proveedores", error });
//   }
// };

// export const crearProveedor = async (req, res) => {
//   const { nombreP, apellidoP, direccion, telefono, correo } = req.body;

//   try {
//     const { insertId } = await Proveedor.crear({
//       nombreP,
//       apellidoP,
//       direccion,
//       telefono,
//       correo,
//     });

//     res.json({
//       id: insertId,
//       nombreP,
//       apellidoP,
//       direccion,
//       telefono,
//       correo,
//     });
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al crear proveedor", error });
//   }
// };

// export const actualizarProveedor = async (req, res) => {
//   const { id } = req.params;
//   const { nombreP, apellidoP, direccion, telefono, correo } = req.body;

//   try {
//     const result = await Proveedor.actualizar(id, {
//       nombreP,
//       apellidoP,
//       direccion,
//       telefono,
//       correo,
//     });

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ mensaje: "Proveedor no encontrado" });
//     }

//     res.json({
//       id,
//       nombreP,
//       apellidoP,
//       direccion,
//       telefono,
//       correo,
//     });
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al actualizar proveedor", error });
//   }
// };

// export const eliminarProveedor = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await Proveedor.eliminar(id);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ mensaje: "No se encontró el proveedor" });
//     }

//     res.json({
//       mensaje: "Proveedor eliminado",
//       id,
//     });
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al eliminar proveedor", error });
//   }
// };
