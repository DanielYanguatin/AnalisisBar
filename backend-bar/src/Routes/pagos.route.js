import { Router } from "express";
import {
  obtenerPagos,
  crearPago,
  actualizarPago,
  eliminarPago,
} from "../controllers/pagos.controller.js";

const router = Router();

router.get("/", obtenerPagos);
router.get("/:id", obtenerPagos);
router.post("/", crearPago);
router.put("/:id", actualizarPago);
router.delete("/:id", eliminarPago);

export default router;

// import { Router } from "express";
// import {
//   obtenerPagos,
//   crearPago,
//   actualizarPago,
//   eliminarPago,
// } from "../controllers/pagos.controller.js";

// const router = Router();

// router.get("/", obtenerPagos);
// router.get("/:id", obtenerPagos);
// router.post("/", crearPago);
// router.put("/:id", actualizarPago);
// router.delete("/:id", eliminarPago);

// export default router;
