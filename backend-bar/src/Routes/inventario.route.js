import { Router } from "express";
import {
  obtenerInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
  obtenerPorCodigoBarras,
  actualizarStock,
  obtenerProductosBajoStockMinimo,
  buscarInventario,
  InventarioController
} from "../controllers/inventario.controller.js";

const router = Router();

// Rutas básicas CRUD
// router.get("/buscar", InventarioController.buscarProductos);
router.get("/buscar", InventarioController.buscarProductos);

router.get("/apiiiii/buscar", buscarInventario);


router.get("/", obtenerInventario);
router.get("/:id", obtenerInventario);
router.post("/", crearInventario);
router.put("/:id", actualizarInventario);
router.delete("/:id", eliminarInventario);

// Nuevas rutas para funcionalidades extendidas
router.get("/codigo-barras/:codigo", obtenerPorCodigoBarras);
router.patch("/:id/stock", actualizarStock);
router.get("/alertas/stock-minimo", obtenerProductosBajoStockMinimo);

export default router;

/* import { Router } from "express";
import {
  obtenerInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
} from "../controllers/inventario.controller.js";

const router = Router();

router.get("/", obtenerInventario);
router.get("/:id", obtenerInventario);
router.post("/", crearInventario);
router.put("/:id", actualizarInventario);
router.delete("/:id", eliminarInventario);

export default router;
 */