import { Router } from "express";
import {
  obtenerDetalleVentas,
  crearDetalleVenta,
  actualizarDetalleVenta,
  eliminarDetalleVenta,
  obtenerDetalleCompletoVenta  
} from "../controllers/detalleVenta.controller.js";

const router = Router();




router.get("/completo/:id", obtenerDetalleCompletoVenta);
router.get("/", obtenerDetalleVentas);
router.get("/:id", obtenerDetalleVentas);
router.post("/", crearDetalleVenta);
router.put("/:id", actualizarDetalleVenta);
router.delete("/:id", eliminarDetalleVenta);

export default router;
