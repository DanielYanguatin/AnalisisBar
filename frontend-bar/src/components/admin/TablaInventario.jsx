import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const API_URL = "http://localhost:5000/inventario";

const columnasVistaPrevia = [
  { key: "id_inventario", label: "ID", width: "0%", centrado: true },
  { key: "ean_13", label: "Código", width: "0%" },
  { key: "nombre", label: "Nombre", width: "20%" },
  { key: "detalle", label: "Detalle", width: "10%" },
  { key: "precio_venta", label: "Precio", width: "0%" },
  { key: "stock", label: "Stock", width: "0%"},
  { key: "unidad_medida", label: "Unidad", width: "0%" },
  { key: "activo", label: "Estado", width: "0%" },
];

const todasLasColumnas = [
  { key: "id_inventario", label: "ID Inventario" },
  { key: "nombre", label: "Nombre Producto" },
  { key: "detalle", label: "Descripción Completa" },
  { key: "precio_venta", label: "Precio Venta", type: "number" },
  { key: "precio_mayorista", label: "Precio Mayorista", type: "number" },
  { key: "precio_compra", label: "Precio Compra", type: "number" },
  { key: "stock", label: "Stock Actual", type: "number" },
  { key: "stock_minimo", label: "Stock Mínimo", type: "number" },
  { key: "stock_maximo", label: "Stock Máximo", type: "number" },
  { key: "cantidad_mayorista_minima", label: "Cant. Mín. Mayorista", type: "number" },
  { key: "id_categoria", label: "Categoria" },
  { key: "unidad_medida", label: "Unidad de Medida", type: "select" },
  { key: "ean_8", label: "Código EAN-8" },
  { key: "ean_13", label: "Código EAN-13" },
  { key: "codigo_inventario", label: "Código Interno" },
  { key: "id_proveedor", label: "Proveedor" },
  { key: "id_almacen", label: "Almacen" },
  { key: "comentarios", label: "Comentarios", type: "textarea" },
  { key: "fecha_ingreso", label: "Fecha Ingreso", type: "date" },
  { key: "fecha_vencimiento", label: "Fecha Vencimiento", type: "date" },
  { key: "activo", label: "Activo", type: "checkbox" },
];

const ejemplosPlaceholder = {
  nombre: "GTA MUUU LECHE *12GR",
  detalle: "*12GR PQ*18 CJ*30 ",
  precio_venta: "600.00",
  precio_mayorista: "500.00",
  precio_compra: "357.00",
  stock: "24",
  stock_minimo: "1",
  stock_maximo: "40",
  cantidad_mayorista_minima: "MONTO DE COMPRA PARA APLICAR DESCUENTO",
  id_categoria: "GALLETAS",
  ean_8: "NULL",
  ean_13: "758546665269",
  codigo_inventario: "NULL",
  id_proveedor: "GALLETAS DEL VALLE",
  id_almacen: "ALMACEN 01",
  fecha_vencimiento: "NULL",
  comentarios: "NULL"
};

export default function TablaInventario() {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para la tabla genérica
  const [busqueda, setBusqueda] = useState("");
  const [campo, setCampo] = useState(columnasVistaPrevia[0]?.key || "");
  const [editando, setEditando] = useState(null);
  const [viendo, setViendo] = useState(null);
  const [nuevoElemento, setNuevoElemento] = useState(false);
  const [formData, setFormData] = useState({});
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Calcular el próximo ID disponible
  useEffect(() => {
    if (inventario.length > 0) {
      const maxId = Math.max(...inventario.map(item => item.id_inventario || 0));
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }
  }, [inventario]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setInventario(response.data);
      setError(null);
    } catch (err) {
      setError(`Error al cargar inventario: ${err.message}`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCRUD = async (action, data) => {
    try {
      setLoading(true);
      
      if (action === "create") {
        await axios.post(API_URL, data);
      } else if (action === "update") {
        await axios.put(`${API_URL}/${data.id_inventario}`, data);
      } else if (action === "delete") {
        await axios.delete(`${API_URL}/${data.id_inventario}`);
      }
      
      await cargarDatos();
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const buscarEnInventario = async (termino, campo) => {
  try {
    const response = await axios.get("http://localhost:5000/inventario/buscar", {
      params: { 
        termino: termino.trim(), // Limpia espacios en blanco
        campo 
      },
      validateStatus: (status) => status < 500 // Para manejar 404 como respuesta válida
    });
    
    if (response.status === 404) {
      setInventario([]); // Limpia los resultados si no encuentra nada
      setError("No se encontraron resultados");
    } else {
      setInventario(response.data);
      setError(null);
      console.log("Petición REAL enviada con:", termino, "al campo:", campo);
    }
  } catch (error) {
    console.error("Error al buscar:", error);
    setError(`Error: ${error.response?.data?.mensaje || error.message}`);
    setInventario([]); // Limpia los resultados en caso de error
  }
}


  // Filtrar datos según búsqueda
  const datosFiltrados = inventario.filter((item) =>
    campo ? String(item[campo]).toLowerCase().includes(busqueda.toLowerCase()) : true
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Aplicar reemplazo de comas y mayúsculas SOLO a 'detalle' y 'nombre'
    const processedValue = ['detalle', 'nombre'].includes(name)
      ? value.replace(/,/g, '.').toUpperCase()
      : value;

    // Actualizar el estado
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      await handleCRUD(action, formData);
      cancelarAccion();
    } catch (err) {
      setError("Error al guardar cambios. Por favor intente nuevamente.");
    }
  };
  

  const eliminarElemento = async (id) => {
    if (window.confirm(`¿Está seguro que desea eliminar este producto?`)) {
      try {
        await handleCRUD("delete", { id_inventario: id });
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
        nuevoElementoInicial[col.key] = 'UNIDAD';
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
    
    if (key === "activo") {
      return value ? (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
          ACTIVO
        </span>
      ) : (
        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
          INACTIVO
        </span>
      );
    }
    
    if (key.includes('precio')) return `$${parseFloat(value).toFixed(2)}`;
    if (key === 'unidad_medida') return value?.toUpperCase() || "UNIDAD";
    if (key.includes('fecha')) return new Date(value).toLocaleDateString();
    
    return value;
  };



useEffect(() => {
  // Llamada falsa solo para que VS Code detecte uso
  const _ = () => buscarEnInventario;
  _();
}, []);



  
  // Determinar el ancho de los inputs según el tipo de dato
  const getInputWidth = (key) => {
    if (key.includes('fecha')) return 'w-32';
    if (key.includes('precio') || key.includes('stock')) return 'w-[30%]';
    if (key === 'activo' || key === 'unidad_medida') return 'w-full';
    if (key === 'id_inventario') return 'w-8';
    return 'w-full';
  };

  if (loading && !inventario.length) {
    return <div className="p-4 text-center">Cargando inventario...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex justify-between">
          <div>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={cargarDatos}
            className="text-red-700 hover:text-red-900"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
            {columnasVistaPrevia.map((col) => (
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
            <FaPlus /> Agregar producto
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
        <div className="bg-yellow-100 p-2 border-b border-gray-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">
              {nuevoElemento ? `Nuevo producto` : `Editando producto`}
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
              {columnasVistaPrevia.map((col) => (
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
              <th className="p-2 border border-gray-300 text-center" style={{ width: "0%" }}>
                Ver
              </th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item) => (
              <tr key={`row-${item.id_inventario}`} className="hover:bg-gray-200">
                {columnasVistaPrevia.map((col) => (
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