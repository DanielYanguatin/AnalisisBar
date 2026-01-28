import { Router } from "express";
import {
  obtenerVentas,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
} from "../controllers/ventas.controller.js";

const router = Router();
router.post("/crear-venta", crearVenta);

router.get("/", obtenerVentas);
router.get("/:id", obtenerVentas);
router.post("/", crearVenta);
router.put("/:id", actualizarVenta);
router.delete("/:id", eliminarVenta);

export default router;
