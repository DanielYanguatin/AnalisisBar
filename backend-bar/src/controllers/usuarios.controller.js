import Usuario from "../models/usuarios.model.js";
import bcrypt from "bcrypt";

const validarContrasena = (contraseña) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(contraseña);
};

export const obtenerUsuarios = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Usuario.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

// En tu controlador
export const crearUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol, estado = "activo" } = req.body;

  if (!validarContrasena(contraseña)) {
    return res.status(400).json({
      mensaje:
        "La contraseña debe tener mínimo 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un símbolo.",
    });
  }

  try {
    const correoExiste = await Usuario.existeCorreo(correo);
    if (correoExiste) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const saltRounds = 10;
    const contrasenaHasheada = await bcrypt.hash(contraseña, saltRounds);

    const { insertId } = await Usuario.crear({
      nombre,
      contraseña: contrasenaHasheada, // Se pasa ya hasheada
      rol,
      correo,
      estado,
    });

    res.json({
      id: insertId,
      nombre,
      rol,
      correo,
      estado,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear usuario", error });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contraseña, rol, estado } = req.body;

  try {
    const datosActualizados = { nombre, rol, correo };

    if (estado) {
      datosActualizados.estado = estado;
    }

    if (contraseña) {
      if (!validarContrasena(contraseña)) {
        return res.status(400).json({
          mensaje:
            "La contraseña debe tener mínimo 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un símbolo.",
        });
      }

      const saltRounds = 10;
      datosActualizados.contraseña = await bcrypt.hash(contraseña, saltRounds);
    }

    const result = await Usuario.actualizar(id, datosActualizados);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ id, ...datosActualizados });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario", error });
  }
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Usuario.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado", id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario", error });
  }
};

export const iniciarSesion = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
  }

  try {
    const resultados = await Usuario.buscarUsuarioLogin(correo);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no registrado" });
    }

    const usuario = resultados[0];

    if (usuario.estado === "inactivo") {
      return res.status(403).json({ mensaje: "Usuario inactivo, no puede iniciar sesión" });
    }

    const contrasenaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    req.session.usuario = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      estado: usuario.estado,
    };

    res.json({ mensaje: "Inicio de sesión exitoso", usuario: req.session.usuario });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};

export const cerrarSesion = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al cerrar sesión:", err);
        return res.status(500).json({ mensaje: "Error al cerrar sesión", error: err });
      }
      res.json({ mensaje: "Sesión cerrada exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cerrar sesión", error });
  }
};

/* import Usuario from "../models/usuarios.model.js";
import bcrypt from "bcrypt";

const validarContrasena = (contrasena) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(contrasena);
};

export const obtenerUsuarios = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Usuario.obtener(id);

    if (id && resultado.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(id ? resultado[0] : resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

export const crearUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  if (!validarContrasena(contraseña)) {
    return res.status(400).json({
      mensaje:
        "La contraseña debe tener mínimo 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un símbolo.",
    });
  }

  try {
    const correoExiste = await Usuario.existeCorreo(correo);
    if (correoExiste) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const saltRounds = 10;
    const contrasenaHasheada = await bcrypt.hash(contraseña, saltRounds);

    const { insertId } = await Usuario.crear({
      nombre,
      contrasena: contrasenaHasheada,
      rol,
      correo,
    });

    res.json({
      id: insertId,
      nombre,
      rol,
      correo,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear usuario", error });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasena, rol } = req.body;

  try {
    const datosActualizados = { nombre, rol, correo };

    if (contrasena) {
      if (!validarContrasena(contrasena)) {
        return res.status(400).json({
          mensaje:
            "La contraseña debe tener mínimo 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un símbolo.",
        });
      }

      const saltRounds = 10;
      datosActualizados.contrasena = await bcrypt.hash(contrasena, saltRounds);
    }

    const result = await Usuario.actualizar(id, datosActualizados);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ id, ...datosActualizados });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario", error });
  }
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Usuario.eliminar(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado", id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario", error });
  }
};

export const iniciarSesion = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
  }

  try {
    const resultados = await Usuario.buscarUsuarioLogin(correo);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no registrado" });
    }

    const usuario = resultados[0];

    const contrasenaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    req.session.usuario = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    res.json({ mensaje: "Inicio de sesión exitoso", usuario: req.session.usuario });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};

export const cerrarSesion = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al cerrar sesión:", err);
        return res.status(500).json({ mensaje: "Error al cerrar sesión", error: err });
      }
      res.json({ mensaje: "Sesión cerrada exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cerrar sesión", error });
  }
};

 */