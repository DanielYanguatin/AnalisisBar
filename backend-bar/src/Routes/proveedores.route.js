import { Router } from "express";
import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../controllers/proveedores.controller.js";

const router = Router();

router.get("/", obtenerProveedores);
router.get("/:id", obtenerProveedores);
router.post("/", crearProveedor);
router.put("/:id", actualizarProveedor);
router.delete("/:id", eliminarProveedor);

export default router;
