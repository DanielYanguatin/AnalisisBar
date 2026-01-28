import { Router } from "express";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  iniciarSesion,
  cerrarSesion,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarios);

router.post("/", crearUsuario);

router.put("/:id", actualizarUsuario);

router.delete("/:id", eliminarUsuario);
router.post("/ingresar", iniciarSesion);
router.post("/cerrar", cerrarSesion);
export default router;
