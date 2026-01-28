import express from 'express'
import cors from 'cors';
import session from 'express-session';

const app = express()
app.use(express.json()) 
app.use(cors()); // Permite todo (no recomendado en producción)

// Esto va antes de tus rutas
app.use(session({
  secret: 'secreto_super_seguro', // puedes cambiar esto
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // si estás en producción y usas HTTPS, pon true
}));

// Configurar carpeta de imágenes estáticas
app.use('/imagenes', express.static('public/imagenes'));

import categoriasRoutes from "./Routes/categorias.route.js"
import clientesRoutes from "./Routes/clientes.route.js"
import comprasRoutes from "./Routes/compras.route.js"
import detalleCompraRoutes from "./Routes/detalleCompra.route.js"
import detalleVentaRoutes from "./Routes/detalleVenta.route.js"
import pagosRoutes from "./Routes/pagos.route.js"
import proveedoresRoutes from "./Routes/proveedores.route.js"
import usuariosRoutes from "./Routes/usuarios.route.js"
import ventasRoutes from "./Routes/ventas.route.js"
import inventarioRoutes from "./Routes/inventario.route.js"
import almacenesRoutes from "./Routes/almacenes.route.js"

app.use("/categorias", categoriasRoutes)
app.use("/clientes", clientesRoutes)
app.use("/compras", comprasRoutes)
app.use("/detalleCompra", detalleCompraRoutes)
app.use("/detalle-venta", detalleVentaRoutes)
app.use("/pagos", pagosRoutes)
app.use("/proveedores", proveedoresRoutes)
app.use("/usuarios", usuariosRoutes)
app.use("/ventas", ventasRoutes)
app.use("/inventario", inventarioRoutes)
app.use("/almacenes", almacenesRoutes)

// Ruta base
app.get("/", (req, res) => {
    res.send("API del sistema de ventas funcionando.");
});

// Iniciar servidor
app.listen(5000, () => {
    console.log("Servidor corriendo en http://localhost:5000");
});