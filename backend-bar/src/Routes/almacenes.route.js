import { Router } from "express";
import {
  obtenerAlmacenes,
  obtenerAlmacenPorId,
  crearAlmacen,
  actualizarAlmacen,
  eliminarAlmacen,
} from "../controllers/almacenes.controllers.js";

const router = Router();

router.get("/", obtenerAlmacenes);           // Obtener todos los almacenes
router.get("/:id", obtenerAlmacenPorId);     // Obtener un almacén por ID
router.post("/", crearAlmacen);               // Crear un nuevo almacén
router.put("/:id", actualizarAlmacen);        // Actualizar un almacén existente
router.delete("/:id", eliminarAlmacen);       // Eliminar un almacén

export default router;
