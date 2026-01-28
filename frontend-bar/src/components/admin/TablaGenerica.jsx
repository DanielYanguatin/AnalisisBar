// import React, { useState, useEffect } from "react";
// import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

// export default function TablaGenerica({
//   columnas,
//   todasLasColumnas,
//   datos,
//   nombreTabla = "registro",
//   onCRUD,
//   loading = false,
//   ejemplosPlaceholder = {},
//   scrollToTopOnView = true,
//   idKey = "id",
//   formatearValorPersonalizado = null,
//   opcionesUnidadMedida = [
//     { value: "UNIDAD", label: "UNIDAD" },
//     { value: "PAQUETE", label: "PAQUETE" },
//     { value: "PACA", label: "PACA" },
//     { value: "CAJA", label: "CAJA" },
//     { value: "BULTO", label: "BULTO" }
//   ]
// }) {
//   const [busqueda, setBusqueda] = useState("");
//   const [campo, setCampo] = useState(columnas[0]?.key || "");
//   const [editando, setEditando] = useState(null);
//   const [viendo, setViendo] = useState(null);
//   const [nuevoElemento, setNuevoElemento] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState(null);
//   const [nextId, setNextId] = useState(null);

//   useEffect(() => {
//     if (datos.length > 0) {
//       const ids = datos.map(item => parseInt(item[idKey]) || 0);
//       const maxId = Math.max(...ids);
//       setNextId(maxId + 1);
//     } else {
//       setNextId(1);
//     }
//   }, [datos, idKey]);

//   const datosFiltrados = datos.filter(item =>
//     campo ? String(item[campo]).toLowerCase().includes(busqueda.toLowerCase()) : true
//   );

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value
//     });
//   };

//   const verDetalle = (item) => {
//     setViendo(item);
//     setEditando(null);
//     setNuevoElemento(false);
//     setError(null);
//     if (scrollToTopOnView) window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const iniciarEdicion = (item) => {
//     setEditando(item);
//     setFormData({ ...item });
//     setViendo(null);
//     setNuevoElemento(false);
//     setError(null);
//   };

//   const cancelarAccion = () => {
//     setEditando(null);
//     setViendo(null);
//     setNuevoElemento(false);
//     setFormData({});
//     setError(null);
//   };

//   const guardarCambios = async () => {
//     try {
//       const action = nuevoElemento ? "create" : "update";
//       await onCRUD(action, formData);
//       cancelarAccion();
//     } catch (err) {
//       setError("Error al guardar cambios. Por favor intente nuevamente.");
//     }
//   };

//   const eliminarElemento = async (id) => {
//     if (window.confirm(`¿Está seguro que desea eliminar este ${nombreTabla}?`)) {
//       try {
//         await onCRUD("delete", { [idKey]: id });
//       } catch (err) {
//         setError("Error al eliminar. Por favor intente nuevamente.");
//       }
//     }
//   };

//   const iniciarNuevoElemento = () => {
//     const nuevoElementoInicial = {};
//     todasLasColumnas.forEach(col => {
//       if (col.key === idKey) {
//         nuevoElementoInicial[col.key] = nextId || "Automático";
//       } else if (col.key === "activo") {
//         nuevoElementoInicial[col.key] = true;
//       } else if (col.key === "unidad_medida") {
//         nuevoElementoInicial[col.key] = "UNIDAD";
//       } else {
//         nuevoElementoInicial[col.key] = "";
//       }
//     });
//     setFormData(nuevoElementoInicial);
//     setNuevoElemento(true);
//     setEditando(null);
//     setViendo(null);
//     setError(null);
//   };

//   const formatearValor = (key, value) => {
//     if (formatearValorPersonalizado) {
//       const resultado = formatearValorPersonalizado(key, value);
//       if (resultado !== undefined) return resultado;
//     }

//     if (value === null || value === undefined || value === "") 
//       return <span className="text-gray-400">N/A</span>;
//     if (key === "activo") return value ? "Sí" : "No";
//     if (key.includes("fecha")) return new Date(value).toLocaleDateString();
//     if (key.includes("precio")) return `$${parseFloat(value).toFixed(2)}`;
//     return value;
//   };

//   const getInputWidth = (key) => {
//     if (key.includes("fecha")) return "w-32";
//     if (key.includes("precio") || key.includes("stock")) return "w-24";
//     if (key === "activo" || key === "unidad_medida") return "w-32";
//     if (key === idKey) return "w-24";
//     return "w-full";
//   };

//   const getInputType = (key) => {
//     if (key.includes("fecha")) return "date";
//     if (key.includes("precio") || key.includes("stock")) return "number";
//     return "text";
//   };

//   return (
//     <div className="w-full border border-gray-400 rounded shadow-lg">
//       <div className="sticky top-0 z-20 bg-blue-300 p-1">
//         <div className="flex flex-wrap gap-2 mb-2">
//           <select
//             value={campo}
//             onChange={(e) => setCampo(e.target.value)}
//             className="p-2 border border-gray-300 rounded"
//             disabled={loading}
//           >
//             {columnas.map((col) => (
//               <option key={col.key} value={col.key}>
//                 {col.label}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder={`Buscar por ${campo}`}
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//             className="flex-grow p-2 border border-gray-300 rounded"
//             disabled={loading}
//           />
//           <button
//             onClick={iniciarNuevoElemento}
//             className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center gap-1"
//             disabled={loading}
//           >
//             <FaPlus /> Agregar {nombreTabla}
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2">
//           {error}
//         </div>
//       )}

//       {(editando || nuevoElemento) && (
//         <div className="bg-yellow-100 p-4 border-b border-gray-300">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold">
//               {nuevoElemento ? `Nuevo ${nombreTabla}` : `Editando ${nombreTabla}`}
//               {loading && <span className="ml-2 text-blue-500">Guardando...</span>}
//             </h3>
//             <button onClick={cancelarAccion} className="text-gray-600 hover:text-gray-800">
//               <FaTimes />
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//             {todasLasColumnas.map((col) => (
//               <div key={`form-${col.key}`} className="mb-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {col.label}
//                 </label>
//                 {col.key === "unidad_medida" ? (
//                   <select
//                     name={col.key}
//                     value={formData[col.key] || ""}
//                     onChange={handleInputChange}
//                     className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
//                     disabled={loading}
//                   >
//                     {opcionesUnidadMedida.map(opcion => (
//                       <option key={opcion.value} value={opcion.value}>
//                         {opcion.label}
//                       </option>
//                     ))}
//                   </select>
//                 ) : col.key === "activo" ? (
//                   <label className="inline-flex items-center mt-1">
//                     <input
//                       type="checkbox"
//                       name={col.key}
//                       checked={formData[col.key] || false}
//                       onChange={handleInputChange}
//                       className="form-checkbox h-4 w-4 text-blue-600"
//                       disabled={loading}
//                     />
//                     <span className="ml-2">Activo</span>
//                   </label>
//                 ) : (
//                   <input
//                     type={getInputType(col.key)}
//                     name={col.key}
//                     value={formData[col.key] || ""}
//                     onChange={handleInputChange}
//                     placeholder={ejemplosPlaceholder[col.key] || ""}
//                     className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
//                     disabled={col.key === idKey || loading}
//                     step={getInputType(col.key) === "number" ? "0.01" : undefined}
//                     readOnly={col.key === idKey}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-end gap-2 mt-2">
//             <button
//               onClick={cancelarAccion}
//               className="bg-gray-500 hover:bg-gray-600 text-white p-1 px-3 rounded text-sm"
//               disabled={loading}
//             >
//               Cancelar
//             </button>
//             <button
//               onClick={guardarCambios}
//               className="bg-blue-500 hover:bg-blue-600 text-white p-1 px-3 rounded text-sm"
//               disabled={loading}
//             >
//               {loading ? "Guardando..." : "Guardar"}
//             </button>
//           </div>
//         </div>
//       )}

//       {viendo && (
//         <div className="bg-blue-50 p-4 border-b border-gray-300">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold">Detalle Completo</h3>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => iniciarEdicion(viendo)}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
//               >
//                 <FaEdit /> Editar
//               </button>
//               <button
//                 onClick={() => eliminarElemento(viendo[idKey])}
//                 className="bg-red-500 hover:bg-red-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
//               >
//                 <FaTrash /> Eliminar
//               </button>
//               <button
//                 onClick={cancelarAccion}
//                 className="bg-gray-500 hover:bg-gray-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
//               >
//                 <FaTimes /> Cerrar
//               </button>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//             {todasLasColumnas.map((col) => (
//               <div key={`view-${col.key}`} className="mb-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {col.label}
//                 </label>
//                 <div className="p-1 px-2 bg-white border border-gray-200 rounded w-full text-sm min-h-[32px]">
//                   {formatearValor(col.key, viendo[col.key])}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto overflow-y-auto max-h-[630px] w-full">
//         <table className="min-w-full border-collapse bg-white" style={{ tableLayout: "fixed" }}>
//           <thead className="bg-gray-300 sticky top-0 z-10">
//             <tr>
//               {columnas.map((col) => (
//                 <th
//                   key={`th-${col.key}`}
//                   className={`p-2 border border-gray-300 ${col.centrado ? "text-center" : "text-left"}`}
//                   style={{ width: col.width || "auto" }}
//                 >
//                   {col.label}
//                 </th>
//               ))}
//               <th className="p-2 border border-gray-300 text-center" style={{ width: "0%" }}>
//                 Ver
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {datosFiltrados.map((item) => (
//               <tr key={`row-${item[idKey]}`} className="hover:bg-gray-200">
//                 {columnas.map((col) => (
//                   <td
//                     key={`cell-${item[idKey]}-${col.key}`}
//                     className={`p-2 border border-gray-300 ${col.centrado ? "text-center" : "text-left"}`}
//                     style={{ width: col.width || "auto", wordWrap: "break-word" }}
//                   >
//                     {formatearValor(col.key, item[col.key])}
//                   </td>
//                 ))}
//                 <td className="p-1 border border-gray-300 text-center">
//                   <button
//                     onClick={() => verDetalle(item)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center justify-center w-8 h-8 mx-auto"
//                     title="Ver detalle completo"
//                   >
//                     <FaEye />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

export default function TablaGenerica({
  columnas, // Columnas para la vista previa
  todasLasColumnas, // Todas las columnas para el detalle completo
  datos,
  nombreTabla = "producto",
  onCRUD,
  loading = false,
  ejemplosPlaceholder = {}, // Placeholders recibidos como prop
  scrollToTopOnView = true // Nueva prop para controlar el scroll
}) {
  const [busqueda, setBusqueda] = useState("");
  const [campo, setCampo] = useState(columnas[0]?.key || "");
  const [editando, setEditando] = useState(null);
  const [viendo, setViendo] = useState(null);
  const [nuevoElemento, setNuevoElemento] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [nextId, setNextId] = useState(null);

  // Calcular el próximo ID disponible
  useEffect(() => {
    if (datos.length > 0) {
      const maxId = Math.max(...datos.map(item => item.id_inventario || 0));
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }
  }, [datos]);

  // Filtrar datos según búsqueda
  const datosFiltrados = datos.filter((item) =>
    campo ? String(item[campo]).toLowerCase().includes(busqueda.toLowerCase()) : true
  );

const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  // 1. Aplicar reemplazo de comas y mayúsculas SOLO a 'detalle' y 'nombre'
  const processedValue = ['detalle', 'nombre'].includes(name)
    ? value.replace(/,/g, '.').toUpperCase()
    : value;

  // 2. Actualizar el estado
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked :
            type === 'text' ? processedValue :
            processedValue
  });
};

  const verDetalle = (item) => {
    setViendo(item);
    setEditando(null);
    setNuevoElemento(false);
    setError(null);

    // Scroll al formulario si está habilitado
    if (scrollToTopOnView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const iniciarEdicion = (item) => {
    setEditando(item);
    setFormData({ ...item });
    setViendo(null);
    setNuevoElemento(false);
    setError(null);
  };

  const cancelarAccion = () => {
    setEditando(null);
    setViendo(null);
    setNuevoElemento(false);
    setFormData({});
    setError(null);
  };

  const guardarCambios = async () => {
    try {
      const action = nuevoElemento ? "create" : "update";
      await onCRUD(action, formData);
      cancelarAccion();
    } catch (err) {
      setError("Error al guardar cambios. Por favor intente nuevamente.");
    }
  };

  const eliminarElemento = async (id) => {
    if (window.confirm(`¿Está seguro que desea eliminar este ${nombreTabla}?`)) {
      try {
        await onCRUD("delete", { id_inventario: id });
      } catch (err) {
        setError("Error al eliminar. Por favor intente nuevamente.");
      }
    }
  };

  const iniciarNuevoElemento = () => {
    const nuevoElementoInicial = {};
    todasLasColumnas.forEach(col => {
      if (col.key === 'id_inventario') {
        nuevoElementoInicial[col.key] = nextId || 'Automático';
      } else if (col.key === 'activo') {
        nuevoElementoInicial[col.key] = true;
      } else if (col.key === 'unidad_medida') {
        nuevoElementoInicial[col.key] = 'unidad';
      } else {
        nuevoElementoInicial[col.key] = '';
      }
    });
    setFormData(nuevoElementoInicial);
    setNuevoElemento(true);
    setEditando(null);
    setViendo(null);
    setError(null);
  };

  // Función para formatear valores
  const formatearValor = (key, value) => {
    if (value === null || value === undefined || value === '') return <span className="text-gray-400">N/A</span>;
    if (key === 'activo') return value ? 'Sí' : 'No';
    if (key.includes('fecha')) return new Date(value).toLocaleDateString();
    if (key.includes('precio')) return `$${parseFloat(value).toFixed(2)}`;
    return value;
  };

  // Determinar el ancho de los inputs según el tipo de dato
  const getInputWidth = (key) => {
    if (key.includes('fecha')) return 'w-32';
    if (key.includes('precio') || key.includes('stock')) return 'w-24';
    if (key === 'activo' || key === 'unidad_medida') return 'w-32';
    if (key === 'id_inventario') return 'w-24';
    return 'w-full';
  };

  return (
    <div className="w-full border border-gray-400 rounded shadow-lg">
      {/* Header de filtro y botones */}
      <div className="sticky top-0 z-20 bg-blue-300 p-1">
        <div className="flex flex-wrap gap-2 mb-2">
          <select
            value={campo}
            onChange={(e) => setCampo(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            disabled={loading}
          >
            {columnas.map((col) => (
              <option key={col.key} value={col.key}>
                {col.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder={`Buscar por ${campo}`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded"
            disabled={loading}
          />
          <button
            onClick={iniciarNuevoElemento}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center gap-1"
            disabled={loading}
          >
            <FaPlus /> Agregar {nombreTabla}
          </button>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2">
          {error}
        </div>
      )}

      {/* Formulario de edición/creación */}
      {(editando || nuevoElemento) && (
        <div className="bg-yellow-100 p-4 border-b border-gray-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">
              {nuevoElemento ? `Nuevo ${nombreTabla}` : `Editando ${nombreTabla}`}
              {loading && <span className="ml-2 text-blue-500">Guardando...</span>}
            </h3>
            <button onClick={cancelarAccion} className="text-gray-600 hover:text-gray-800">
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {todasLasColumnas.map((col) => (
              <div key={`form-${col.key}`} className="mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {col.label}
                </label>
                {col.key === 'unidad_medida' ? (
                  <select
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={loading}
                  >
                    <option value="UNIDAD">UNIDAD</option>
                    <option value="PAQUETE">PAQUETE</option>
                    <option value="PACA">PACA</option>
                    <option value="CAJA">CAJA</option>
                    <option value="BULTO">BULTO</option>
                  </select>
                ) : col.key === 'activo' ? (
                  <label className="inline-flex items-center mt-1">
                    <input
                      type="checkbox"
                      name={col.key}
                      checked={formData[col.key] || false}
                      onChange={handleInputChange}
                      className="form-checkbox h-4 w-4 text-blue-600"
                      disabled={loading}
                    />
                    <span className="ml-2">Activo</span>
                  </label>
                ) : (
                  <input
                    type={col.key.includes("precio") || col.key.includes("stock") ? "number" :
                         col.key.includes("fecha") ? "date" : "text"}
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    placeholder={ejemplosPlaceholder[col.key] || ''}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={(col.key === 'id_inventario') || loading}
                    step={col.key.includes("precio") ? "0.01" : undefined}
                    readOnly={col.key === 'id_inventario'}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={cancelarAccion}
              className="bg-gray-500 hover:bg-gray-600 text-white p-1 px-3 rounded text-sm"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={guardarCambios}
              className="bg-blue-500 hover:bg-blue-600 text-white p-1 px-3 rounded text-sm"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Vista de detalle */}
      {viendo && (
        <div className="bg-blue-50 p-4 border-b border-gray-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Detalle Completo del Producto</h3>
            <div className="flex gap-2">
              <button
                onClick={() => iniciarEdicion(viendo)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => eliminarElemento(viendo.id_inventario)}
                className="bg-red-500 hover:bg-red-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
              >
                <FaTrash /> Eliminar
              </button>
              <button
                onClick={cancelarAccion}
                className="bg-gray-500 hover:bg-gray-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
              >
                <FaTimes /> Cerrar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {todasLasColumnas.map((col) => (
              <div key={`view-${col.key}`} className="mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {col.label}
                </label>
                <div className="p-1 px-2 bg-white border border-gray-200 rounded w-full text-sm min-h-[32px]">
                  {formatearValor(col.key, viendo[col.key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenedor de la tabla */}
      <div className="overflow-x-auto overflow-y-auto max-h-[630px] w-full">
        <table className="min-w-full border-collapse bg-white" style={{ tableLayout: "fixed" }}>
          <thead className="bg-gray-300 sticky top-0 z-10">
            <tr>
              {columnas.map((col) => (
                <th
                  key={`th-${col.key}`}
                  className={`p-2 border border-gray-300 ${
                    col.centrado ? "text-center" : "text-left"
                  }`}
                  style={{ width: col.width || "auto" }}
                >
                  {col.label}
                </th>
              ))}
              <th className="p-2 border border-gray-300 text-center" style={{ width: "0%"  }}>{/* "48px" */}
                Ver
              </th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item) => (
              <tr key={`row-${item.id_inventario}`} className="hover:bg-gray-200">
                {columnas.map((col) => (
                  <td
                    key={`cell-${item.id_inventario}-${col.key}`}
                    className={`p-2 border border-gray-300 ${
                      col.centrado ? "text-center" : "text-left"
                    }`}
                    style={{ width: col.width || "auto", wordWrap: "break-word" }}
                  >
                    {formatearValor(col.key, item[col.key])}
                  </td>
                ))}
                <td className="p-1 border border-gray-300 text-center">
                  <button
                    onClick={() => verDetalle(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center justify-center w-8 h-8 mx-auto"
                    title="Ver detalle completo"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

// export default function TablaGenerica({
//   columnas, // Columnas para la vista previa
//   todasLasColumnas, // Todas las columnas para el detalle completo
//   datos,
//   nombreTabla = "producto",
//   onCRUD,
//   loading = false
// }) {
//   const [busqueda, setBusqueda] = useState("");
//   const [campo, setCampo] = useState(columnas[0]?.key || "");
//   const [editando, setEditando] = useState(null);
//   const [viendo, setViendo] = useState(null);
//   const [nuevoElemento, setNuevoElemento] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState(null);

//   // Filtrar datos según búsqueda
//   const datosFiltrados = datos.filter((item) =>
//     campo ? String(item[campo]).toLowerCase().includes(busqueda.toLowerCase()) : true
//   );

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const verDetalle = (item) => {
//     setViendo(item);
//     setEditando(null);
//     setNuevoElemento(false);
//     setError(null);
//   };

//   const iniciarEdicion = (item) => {
//     setEditando(item);
//     setFormData({ ...item });
//     setViendo(null);
//     setNuevoElemento(false);
//     setError(null);
//   };

//   const cancelarAccion = () => {
//     setEditando(null);
//     setViendo(null);
//     setNuevoElemento(false);
//     setFormData({});
//     setError(null);
//   };

//   const guardarCambios = async () => {
//     try {
//       const action = nuevoElemento ? "create" : "update";
//       await onCRUD(action, formData);
//       cancelarAccion();
//     } catch (err) {
//       setError("Error al guardar cambios. Por favor intente nuevamente.");
//     }
//   };

//   const eliminarElemento = async (id) => {
//     if (window.confirm(`¿Está seguro que desea eliminar este ${nombreTabla}?`)) {
//       try {
//         await onCRUD("delete", { id_inventario: id });
//       } catch (err) {
//         setError("Error al eliminar. Por favor intente nuevamente.");
//       }
//     }
//   };

//   const iniciarNuevoElemento = () => {
//     const nuevoElementoInicial = {};
//     todasLasColumnas.forEach(col => {
//       nuevoElementoInicial[col.key] = col.key === 'id_inventario' ? 'Automático' :
//                                      col.key === 'activo' ? true :
//                                      col.key === 'unidad_medida' ? 'unidad' : '';
//     });
//     setFormData(nuevoElementoInicial);
//     setNuevoElemento(true);
//     setEditando(null);
//     setViendo(null);
//     setError(null);
//   };

//   // Función para formatear valores
//   const formatearValor = (key, value) => {
//     if (value === null || value === undefined || value === '') return <span className="text-gray-400">N/A</span>;
//     if (key === 'activo') return value ? 'Sí' : 'No';
//     if (key.includes('fecha')) return new Date(value).toLocaleDateString();
//     if (key.includes('precio')) return `$${parseFloat(value).toFixed(2)}`;
//     return value;
//   };

//   return (
//     <div className="w-full border border-gray-400 rounded shadow-lg">
//       {/* Header de filtro y botones */}
//       <div className="sticky top-0 z-20 bg-blue-300 p-1">
//         <div className="flex flex-wrap gap-2 mb-2">
//           <select
//             value={campo}
//             onChange={(e) => setCampo(e.target.value)}
//             className="p-2 border border-gray-300 rounded"
//             disabled={loading}
//           >
//             {columnas.map((col) => (
//               <option key={col.key} value={col.key}>
//                 {col.label}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder={`Buscar por ${campo}`}
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//             className="flex-grow p-2 border border-gray-300 rounded"
//             disabled={loading}
//           />
//           <button
//             onClick={iniciarNuevoElemento}
//             className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center gap-1"
//             disabled={loading}
//           >
//             <FaPlus /> Agregar {nombreTabla}
//           </button>
//         </div>
//       </div>

//       {/* Mensajes de error */}
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2">
//           {error}
//         </div>
//       )}

//       {/* Formulario de edición/creación */}
//       {(editando || nuevoElemento) && (
//         <div className="bg-yellow-100 p-4 border-b border-gray-300">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold">
//               {nuevoElemento ? `Nuevo ${nombreTabla}` : `Editando ${nombreTabla}`}
//               {loading && <span className="ml-2 text-blue-500">Guardando...</span>}
//             </h3>
//             <button onClick={cancelarAccion} className="text-gray-600 hover:text-gray-800">
//               <FaTimes />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//             {todasLasColumnas.map((col) => (
//               <div key={`form-${col.key}`} className="mb-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {col.label}
//                 </label>
//                 {col.key === 'unidad_medida' ? (
//                   <select
//                     name={col.key}
//                     value={formData[col.key] || ''}
//                     onChange={handleInputChange}
//                     className="p-1 px-2 border border-gray-300 rounded w-full text-sm"
//                     disabled={loading}
//                   >
//                     <option value="unidad">Unidad</option>
//                     <option value="kilo">Kilo</option>
//                     <option value="litro">Litro</option>
//                     <option value="paquete">Paquete</option>
//                   </select>
//                 ) : col.key === 'activo' ? (
//                   <label className="inline-flex items-center mt-1">
//                     <input
//                       type="checkbox"
//                       name={col.key}
//                       checked={formData[col.key] || false}
//                       onChange={handleInputChange}
//                       className="form-checkbox h-4 w-4 text-blue-600"
//                       disabled={loading}
//                     />
//                   </label>
//                 ) : (
//                   <input
//                     type={col.key.includes("precio") || col.key.includes("stock") ? "number" :
//                          col.key.includes("fecha") ? "date" : "text"}
//                     name={col.key}
//                     value={formData[col.key] || ''}
//                     onChange={handleInputChange}
//                     className="p-1 px-2 border border-gray-300 rounded w-full text-sm"
//                     disabled={(col.key === 'id_inventario' && !nuevoElemento) || loading}
//                     step={col.key.includes("precio") ? "0.01" : undefined}
//                     readOnly={col.key === 'id_inventario' && !nuevoElemento}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-end gap-2 mt-2">
//             <button
//               onClick={cancelarAccion}
//               className="bg-gray-500 hover:bg-gray-600 text-white p-1 px-3 rounded text-sm"
//               disabled={loading}
//             >
//               Cancelar
//             </button>
//             <button
//               onClick={guardarCambios}
//               className="bg-blue-500 hover:bg-blue-600 text-white p-1 px-3 rounded text-sm"
//               disabled={loading}
//             >
//               {loading ? 'Guardando...' : 'Guardar'}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Vista de detalle */}
//       {viendo && (
//         <div className="bg-blue-50 p-4 border-b border-gray-300">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold">Detalle Completo del Producto</h3>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => iniciarEdicion(viendo)}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
//               >
//                 <FaEdit /> Editar
//               </button>
//               <button
//                 onClick={() => eliminarElemento(viendo.id_inventario)}
//                 className="bg-red-500 hover:bg-red-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
//               >
//                 <FaTrash /> Eliminar
//               </button>
//               <button
//                 onClick={cancelarAccion}
//                 className="bg-gray-500 hover:bg-gray-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
//               >
//                 <FaTimes /> Cerrar
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//             {todasLasColumnas.map((col) => (
//               <div key={`view-${col.key}`} className="mb-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {col.label}
//                 </label>
//                 <div className="p-1 px-2 bg-white border border-gray-200 rounded w-full text-sm min-h-[32px]">
//                   {formatearValor(col.key, viendo[col.key])}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Contenedor de la tabla */}
//       <div className="overflow-x-auto overflow-y-auto max-h-[630px] w-full">
//         <table className="min-w-full border-collapse bg-white" style={{ tableLayout: "fixed" }}>
//           <thead className="bg-gray-300 sticky top-0 z-10">
//             <tr>
//               {columnas.map((col) => (
//                 <th
//                   key={`th-${col.key}`}
//                   className={`p-2 border border-gray-300 ${
//                     col.centrado ? "text-center" : "text-left"
//                   }`}
//                   style={{ width: col.width || "auto" }}
//                 >
//                   {col.label}
//                 </th>
//               ))}
//               <th className="p-2 border border-gray-300 text-center" style={{ width: "0%" }}>
//                 Ver
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {datosFiltrados.map((item) => (
//               <tr key={`row-${item.id_inventario}`} className="hover:bg-gray-200">
//                 {columnas.map((col) => (
//                   <td
//                     key={`cell-${item.id_inventario}-${col.key}`}
//                     className={`p-2 border border-gray-300 ${
//                       col.centrado ? "text-center" : "text-left"
//                     }`}
//                     style={{ width: col.width || "auto", wordWrap: "break-word" }}
//                   >
//                     {formatearValor(col.key, item[col.key])}
//                   </td>
//                 ))}
//                 <td className="p-2 border border-gray-300 text-center">
//                   <button
//                     onClick={() => verDetalle(item)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-sm flex items-center justify-center w-full"
//                     title="Ver detalle completo"
//                   >
//                     <FaEye />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
