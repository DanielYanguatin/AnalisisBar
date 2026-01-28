import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiTruck,
  FiDollarSign,
  FiShoppingCart,
  FiShoppingBag,
  FiBox,
  FiChevronsRight
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const Example = () => {
  const [selected, setSelected] = useState("FacturaVenta");
  const location = useLocation();
  const navigate = useNavigate();

  // Sincronizar el estado selected con la URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const routeMap = {
      'facturaventa': 'FacturaVenta',
      'inventario': 'Inventario',
      'compras': 'Compras',
      'usuarios': 'Usuarios',
      'clientes': 'Clientes',
      'proveedores': 'Proveedores',
      'ventas': 'Ventas',
      'almacen': 'Almacen',
      'categorias': 'Categorias',
      'pagos': 'Pagos',
      'admin': 'FacturaVenta' // Ruta por defecto
    };
    
    if (routeMap[path]) {
      setSelected(routeMap[path]);
    }
  }, [location]);

  const handleSelection = (title) => {
    setSelected(title);
    const routeMap = {
      'FacturaVenta': 'facturaventa',
      'Inventario': 'inventario',
      'Compras': 'compras',
      'Usuarios': 'usuarios',
      'Clientes': 'clientes',
      'Proveedores': 'proveedores',
      'Ventas': 'ventas',
      'Almacen': 'almacen',
      'Categorias': 'categorias',
      'Pagos': 'pagos'
    };
    
    if (routeMap[title]) {
      navigate(`/admin/${routeMap[title]}`);
    }
  };

  return (
    <div className="flex gap-[0.5cm] p-[0.5cm] bg-gray-300">
      <Sidebar selected={selected} setSelected={handleSelection} />
      <div className="flex-1 p-2 bg-white rounded shadow">
        <Outlet />
      </div>
    </div>
  );
};

const Sidebar = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(true);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-[92vh] shrink-0 border-r border-slate-500 bg-blue-300 p-2 flex flex-col shadow-lg"
      style={{ width: open ? "210px" : "fit-content" }}
    >
      <TitleSection open={open} />

      <div className="flex-1 overflow-y-auto space-y-1">
        <Option Icon={FiBox} title="Inventario" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FiHome} title="Almacen" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FiUsers} title="Usuarios" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FiUsers} title="Clientes" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FiTruck} title="Proveedores" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FiDollarSign} title="Pagos" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FiShoppingCart} title="Ventas" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FiShoppingBag} title="Compras" selected={selected} setSelected={setSelected} open={open} />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => (
  <motion.button
    layout
    onClick={() => setSelected(title)}
    className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
      selected === title ? "bg-indigo-100 text-indigo-800" : "text-black-700 hover:bg-slate-100"
    }`}
  >
    <motion.div layout className="grid h-full w-10 place-content-center text-lg">
      <Icon />
    </motion.div>
    {open && (
      <motion.span
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.125 }}
        className="text-sm font-medium"
      >
        {title}
      </motion.span>
    )}
    {notifs && open && (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ y: "-50%" }}
        transition={{ delay: 0.5 }}
        className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
      >
        {notifs}
      </motion.span>
    )}
  </motion.button>
);

const TitleSection = ({ open }) => (
  <div className="mb-1 border-b border-slate-700 pb-2">
    <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
      <div className="flex items-center gap-2">
        <Logo />
        {open && (
          <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.125 }}>
            <span className="block text-3xl font-semibold">Effi</span>
            <span className="block text-2xs text-slate-500">Administrador</span>
          </motion.div>
        )}
      </div>
    </div>
  </div>
);

const Logo = () => (
  <motion.div layout className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600">
    <svg width="44" height="44" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-slate-100">
      <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"></path>
      <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"></path>
    </svg>
  </motion.div>
);

const ToggleClose = ({ open, setOpen }) => (
  <motion.button
    layout
    onClick={() => setOpen((pv) => !pv)}
    className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
  >
    <div className="flex items-center p-2">
      <motion.div layout className="grid size-10 place-content-center text-lg">
        <FiChevronsRight className={`transition-transform ${open && "rotate-180"}`} />
      </motion.div>
      {open && (
        <motion.span 
          layout 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.125 }} 
          className="text-xs font-medium"
        >
          Hide
        </motion.span>
      )}
    </div>
  </motion.button>
);
