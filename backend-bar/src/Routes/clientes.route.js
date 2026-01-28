import { Router } from "express";
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  ClientesController
} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/buscar", ClientesController.buscarClientes);
  

router.get("/", obtenerClientes);
router.get("/:id", obtenerClientes);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

export default router;
