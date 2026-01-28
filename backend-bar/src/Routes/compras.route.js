
import { Router } from "express";
import {
  obtenerCompras,
  crearCompra,
  actualizarCompra,
  eliminarCompra,
} from "../controllers/compras.controller.js";

const router = Router();

router.get("/", obtenerCompras);
router.get("/:id", obtenerCompras);
router.post("/", crearCompra);
router.put("/:id", actualizarCompra);
router.delete("/:id", eliminarCompra);

export default router;
