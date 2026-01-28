import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { RiSearch2Line } from "react-icons/ri";

const Cajero = () => {
  return (
    <div className="bg-[#ededed] min-h-screen p-4 md:p-6">
      <CajeroHeader />
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

const CajeroHeader = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === `/cajero/${path}` || 
           location.pathname === `/cajero/${path}/` ||
           (path === 'facturar' && location.pathname === '/cajero');
  };

  return (
    <header className="mb-6">
      {/* Título y búsqueda */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2196f3]">EFFI</h1>
          <div className="hidden md:block h-10 w-px bg-gray-200"></div>
          <div>
            <p className="text-sm font-semibold text-[#212121]">CAJERO: <span className="text-[#72cf44]">CAMILA ARTEAGA</span></p>
            <p className="text-sm font-semibold text-[#212121]">CAJA: <span className="text-[#72cf44]">1</span></p>
          </div>
        </div>
        
        {/* <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <RiSearch2Line className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196f3] focus:border-[#2196f3] w-full md:w-64"
          />
        </div> */}
      </div>

      {/* Pestañas */}
      <nav className="flex items-center border-b border-gray-200">
        <Link
          to="facturar"
          className={`px-4 py-3 font-medium text-sm md:text-base relative ${
            isActive("facturar")
              ? "text-[#2196f3] font-semibold"
              : "text-[#666666] hover:text-[#2196f3]"
          }`}
        >
          Facturar
          {isActive("facturar") && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#2196f3] rounded-t-md"></span>
          )}
        </Link>
        <Link
          to="facturas"
          className={`px-4 py-3 font-medium text-sm md:text-base relative ${
            isActive("facturas")
              ? "text-[#2196f3] font-semibold"
              : "text-[#666666] hover:text-[#2196f3]"
          }`}
        >
          Historial de Facturas
          {isActive("facturas") && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#2196f3] rounded-t-md"></span>
          )}
        </Link>
        <Link
          to="cerrar-caja"
          className={`px-4 py-3 font-medium text-sm md:text-base relative ${
            isActive("cerrar-caja")
              ? "text-[#2196f3] font-semibold"
              : "text-[#666666] hover:text-[#2196f3]"
          }`}
        >
          Cierre de Caja
          {isActive("cerrar-caja") && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#2196f3] rounded-t-md"></span>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default Cajero;
// import React from "react";
// import { Outlet, Link, useLocation } from "react-router-dom";
// import { RiSearch2Line } from "react-icons/ri";

// const Cajero = () => {
//   return (
//     <div className="bg-white min-h-screen p-4">
//       <CajeroHeader />
//       <Outlet />
//     </div>
//   );
// };

// const CajeroHeader = () => {
//   const location = useLocation();

//   const isActive = (path) => {
//     return location.pathname.includes(path);
//   };

//   return (
//     <header>
//       {/* Título y búsqueda */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
//         <div>
//           <h1 className="text-6xl font-bold text-blue-500">Effi</h1>
//         </div>
//         <form>
//           <div className="w-full relative">
//             <p className="text-sm font-bold mt-2 ">CAJERO: CAMILA ARTEAGA</p>
//             <p className="text-sm font-bold mt-2 ">CAJA: 1</p>

           
//           </div>
//         </form>
//       </div>

//       {/* Pestañas */}
//       <nav className="text-blue-600 flex items-center justify-between md:justify-start md:gap-2 border-b border-gray-500  mb-4">
//         <Link
//           to="facturar"
//           className={`relative py-2 pr-4 font-medium ${
//             isActive("facturar")
//               ? "before:w-full before:h-[3px] before:absolute before:bg-blue-500 before:left-0 before:rounded-full before:-bottom-[1px] text-blue-500"
//               : "hover:text-blue-500"
//           }`}
//         >
//           Facturar
//         </Link>
//         <Link
//           to="facturas"
//           className={`py-2 pr-3 font-medium ${
//             isActive("facturas")
//               ? "relative before:w-full before:h-[3px] before:absolute before:bg-blue-500 before:left-0 before:rounded-full before:-bottom-[1px] text-blue-500"
//               : "hover:text-blue-500"
//           }`}
//         >
//           Facturas (Últimas facturas realizadas)
//         </Link>
//       </nav>
//     </header>
//   );
// };

// export default Cajero;
