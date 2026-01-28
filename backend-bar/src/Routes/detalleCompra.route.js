import { Router } from "express";
import {
  obtenerDetalleCompras,
  crearDetalleCompra,
  actualizarDetalleCompra,
  eliminarDetalleCompra,
  
} from "../controllers/detalleCompra.controller.js";

const router = Router();

router.get("/", obtenerDetalleCompras);
router.get("/:id", obtenerDetalleCompras);
router.post("/", crearDetalleCompra);
router.put("/:id", actualizarDetalleCompra);
router.delete("/:id", eliminarDetalleCompra);

export default router;
