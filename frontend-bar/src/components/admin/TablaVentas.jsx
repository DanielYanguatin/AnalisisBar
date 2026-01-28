import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes, FaSearch, FaUser, FaCashRegister } from "react-icons/fa";

const API_URL = "http://localhost:5000/ventas";
const CLIENTES_URL = "http://localhost:5000/clientes";
const USUARIOS_URL = "http://localhost:5000/usuarios";

// Columnas para la vista previa en la tabla
const columnasVistaPrevia = [
  { key: "id_venta", label: "ID", width: "80px", centrado: true },
  { key: "fecha", label: "Fecha", width: "20%" },
  { key: "cliente_nombre", label: "Cliente", width: "25%" },
  { key: "usuario_nombre", label: "Vendedor", width: "20%" },
  { key: "total", label: "Total", width: "15%", centrado: true },
  { key: "estado", label: "Estado", width: "15%", centrado: true },
];

// Todas las columnas para el detalle completo
const todasLasColumnas = [
  { key: "id_venta", label: "ID Venta" },
  { key: "fecha", label: "Fecha", type: "datetime-local" },
  { key: "id_cliente", label: "Cliente", type: "select" },
  { key: "id_usuario", label: "Vendedor", type: "select" },
  { key: "total", label: "Total", type: "number" },
  { key: "estado", label: "Estado", type: "select" },
];

// Opciones para los selects
const opcionesEstado = [
  { value: "completada", label: "Completada" },
  { value: "anulada", label: "Anulada" }
];

export default function TablaVentas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para la tabla
  const [busqueda, setBusqueda] = useState("");
  const [campo, setCampo] = useState(columnasVistaPrevia[0]?.key || "");
  const [editando, setEditando] = useState(null);
  const [viendo, setViendo] = useState(null);
  const [nuevoElemento, setNuevoElemento] = useState(false);
  const [formData, setFormData] = useState({});
  const [nextId, setNextId] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarTodosLosDatos = async () => {
      try {
        setLoading(true);
        const [ventasRes, clientesRes, usuariosRes] = await Promise.all([
          axios.get(API_URL),
          axios.get(CLIENTES_URL),
          axios.get(USUARIOS_URL)
        ]);
        
        // Enriquecer datos de ventas con nombres de clientes y usuarios
        const ventasEnriquecidas = ventasRes.data.map(venta => {
          const cliente = clientesRes.data.find(c => c.id_cliente === venta.id_cliente);
          const usuario = usuariosRes.data.find(u => u.id_usuario === venta.id_usuario);
          
          return {
            ...venta,
            cliente_nombre: cliente ? cliente.nombre : 'Consumidor final',
            usuario_nombre: usuario ? usuario.nombre : 'Desconocido'
          };
        });

        setVentas(ventasEnriquecidas);
        setClientes(clientesRes.data);
        setUsuarios(usuariosRes.data);
        setError(null);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarTodosLosDatos();
  }, []);

  // Calcular el próximo ID disponible
  useEffect(() => {
    if (ventas.length > 0) {
      const maxId = Math.max(...ventas.map(item => item.id_venta || 0));
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }
  }, [ventas]);

  // Manejar operaciones CRUD
  const handleCRUD = async (action, data) => {
    try {
      setLoading(true);
      let response;

      switch (action) {
        case "create":
          response = await axios.post(API_URL, data);
          break;
        case "update":
          response = await axios.put(`${API_URL}/${data.id_venta}`, data);
          break;
        case "delete":
          await axios.delete(`${API_URL}/${data.id_venta}`);
          break;
        default:
          throw new Error("Acción no válida");
      }

      // Recargar datos después de la operación
      const ventasRes = await axios.get(API_URL);
      const ventasEnriquecidas = ventasRes.data.map(venta => {
        const cliente = clientes.find(c => c.id_cliente === venta.id_cliente);
        const usuario = usuarios.find(u => u.id_usuario === venta.id_usuario);
        
        return {
          ...venta,
          cliente_nombre: cliente ? cliente.nombre : 'Consumidor final',
          usuario_nombre: usuario ? usuario.nombre : 'Desconocido'
        };
      });

      setVentas(ventasEnriquecidas);
      return response?.data;
    } catch (err) {
      setError(
        `Error en operación ${action}: ${
          err.response?.data?.message || err.message
        }`
      );
      console.error(`Error en ${action}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filtrar datos según búsqueda
  const datosFiltrados = ventas.filter((item) =>
    campo ? String(item[campo]).toLowerCase().includes(busqueda.toLowerCase()) : true
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    if (window.confirm(`¿Está seguro que desea anular esta venta?`)) {
      try {
        // Al "eliminar" una venta, en realidad la marcamos como anulada
        await handleCRUD("update", { 
          id_venta: id, 
          estado: "anulada",
          // Mantener el resto de los datos igual
          ...ventas.find(v => v.id_venta === id)
        });
      } catch (err) {
        setError("Error al anular la venta. Por favor intente nuevamente.");
      }
    }
  };

  const iniciarNuevaVenta = () => {
    const nuevoElementoInicial = {};
    todasLasColumnas.forEach(col => {
      if (col.key === 'id_venta') {
        nuevoElementoInicial[col.key] = nextId || 'Automático';
      } else if (col.key === 'estado') {
        nuevoElementoInicial[col.key] = 'completada';
      } else if (col.key === 'fecha') {
        nuevoElementoInicial[col.key] = new Date().toISOString().slice(0, 16);
      } else if (col.key === 'id_usuario') {
        // Asignar el usuario actual por defecto
        nuevoElementoInicial[col.key] = 1; // Esto debería ser el ID del usuario logueado
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
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">N/A</span>;
    }
    
    if (key === 'estado') {
      return value === 'completada' ? (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
          COMPLETADA
        </span>
      ) : (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
          ANULADA
        </span>
      );
    }
    
    if (key === 'fecha') {
      return new Date(value).toLocaleString();
    }
    
    if (key === 'total') {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    
    return value;
  };

  // Determinar el ancho de los inputs según el tipo de dato
  const getInputWidth = (key) => {
    if (key === 'id_venta') return 'w-24';
    if (key === 'total') return 'w-32';
    if (key === 'estado' || key === 'id_cliente' || key === 'id_usuario') return 'w-40';
    if (key === 'fecha') return 'w-48';
    return 'w-full';
  };

  if (loading && ventas.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Cargando ventas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Reintentar
        </button>
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
            onClick={iniciarNuevaVenta}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center gap-1"
            disabled={loading}
          >
            <FaCashRegister /> Nueva venta
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
              {nuevoElemento ? `Nueva venta` : `Editando venta`}
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
                {col.key === 'estado' ? (
                  <select
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={loading}
                  >
                    {opcionesEstado.map(opcion => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                ) : col.key === 'id_cliente' ? (
                  <select
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={loading}
                  >
                    <option value="">Consumidor final</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>
                        {cliente.nombre} - {cliente.telefono}
                      </option>
                    ))}
                  </select>
                ) : col.key === 'id_usuario' ? (
                  <select
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={loading}
                  >
                    {usuarios.filter(u => u.rol === 'cajero' || u.rol === 'admin').map(usuario => (
                      <option key={usuario.id_usuario} value={usuario.id_usuario}>
                        {usuario.nombre} ({usuario.rol})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={col.key === 'total' ? 'number' : 
                          col.key === 'fecha' ? 'datetime-local' : 'text'}
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={(col.key === 'id_venta') || loading}
                    readOnly={col.key === 'id_venta'}
                    step={col.key === 'total' ? '0.01' : undefined}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Aquí iría el detalle de productos vendidos en una implementación real */}
          
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
            <h3 className="text-lg font-semibold">Detalle Completo de la Venta</h3>
            <div className="flex gap-2">
              <button
                onClick={() => iniciarEdicion(viendo)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
                disabled={viendo.estado === 'anulada'}
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => eliminarElemento(viendo.id_venta)}
                className="bg-red-500 hover:bg-red-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
                disabled={viendo.estado === 'anulada'}
              >
                <FaTrash /> Anular
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
                  {col.key === 'id_cliente' ? (
                    clientes.find(c => c.id_cliente === viendo.id_cliente)?.nombre || 'Consumidor final'
                  ) : col.key === 'id_usuario' ? (
                    usuarios.find(u => u.id_usuario === viendo.id_usuario)?.nombre || 'Desconocido'
                  ) : (
                    formatearValor(col.key, viendo[col.key])
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Aquí iría el detalle de productos vendidos en una implementación real */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Productos vendidos</h4>
            <div className="bg-gray-100 p-2 rounded text-sm text-gray-600">
              En una implementación completa aquí se mostrarían los productos de esta venta
            </div>
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
              <tr key={`row-${item.id_venta}`} className={`hover:bg-gray-200 ${
                item.estado === 'anulada' ? 'bg-red-50' : ''
              }`}>
                {columnasVistaPrevia.map((col) => (
                  <td
                    key={`cell-${item.id_venta}-${col.key}`}
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

      {loading && ventas.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Procesando cambios...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mt-2"></div>
          </div>
        </div>
      )}
    </div>
  );
}