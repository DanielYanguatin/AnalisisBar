import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Cajero from "./pages/Cajero";
import Login from "./pages/Login";
import { Example } from "./pages/ExampleContent";
import Facturar from "./components/shared/Facturar";
import Facturas from "./components/shared/Facturas";

// Componentes para admin
import FacturaVenta from "./components/admin/Home";
import TablaInventario from "./components/admin/TablaInventario";
import TablaCompras from "./components/admin/TablaCompras";
import TablaUsuarios from "./components/admin/TablaUsuario";
import TablaClientes from "./components/admin/TablaCliente";
import TablaProveedores from "./components/admin/TablaProveedores";
import TablaVentas from "./components/admin/TablaVentas";
import TablaAlmacenes from "./components/admin/TablaAlmacen";
import TablaCategorias from "./components/admin/TablaCategorias";
import TablaPagos from "./components/admin/TablaPagos";
import CerrarCaja from "./components/shared/CerrarCaja";

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarios"));
    if (usuario) {
      setAutenticado(true);
      setRol(usuario.rol);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login setAutenticado={setAutenticado} setRol={setRol} />} />

      {autenticado ? (
        <>
          {rol === "admin" && (
            <Route path="/admin" element={<Example />}>
              <Route index element={<TablaInventario />} />
              <Route path="inventario" element={<TablaInventario />} />
              <Route path="facturaventa" element={<FacturaVenta />} />
              <Route path="compras" element={<TablaCompras />} />
              <Route path="usuarios" element={<TablaUsuarios />} />
              <Route path="clientes" element={<TablaClientes />} />
              <Route path="proveedores" element={<TablaProveedores />} />
              <Route path="ventas" element={<TablaVentas />} />
              <Route path="almacen" element={<TablaAlmacenes />} />
              <Route path="categorias" element={<TablaCategorias />} />
              <Route path="pagos" element={<TablaPagos />} />
            </Route>
          )}
          {rol === "cajero" && (
            <Route path="/cajero" element={<Cajero />}>
              <Route index element={<Facturar />} />
              <Route path="facturar" element={<Facturar />} />
              <Route path="facturas" element={<Facturas />} />
              <Route path="cerrar-caja" element={<CerrarCaja />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}

export default App;