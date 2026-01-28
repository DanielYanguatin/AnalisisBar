import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes, FaMoneyBillWave, FaCreditCard, FaExchangeAlt } from "react-icons/fa";

const API_URL = "http://localhost:5000/pagos";
const VENTAS_URL = "http://localhost:5000/ventas";

// Columnas para la vista previa en la tabla
const columnasVistaPrevia = [
  { key: "id_pago", label: "ID", width: "0%", centrado: true },
  { key: "venta_id", label: "Venta ID", width: "10%", centrado: true },
  { key: "tipo_pago", label: "Tipo de Pago", width: "10%" },
  { key: "monto", label: "Monto", width: "10%", centrado: true },
  { key: "referencia", label: "Referencia", width: "0%" },
];

// Todas las columnas para el detalle completo
const todasLasColumnas = [
  { key: "id_pago", label: "ID Pago" },
  { key: "id_venta", label: "Venta", type: "select" },
  { key: "tipo_pago", label: "Tipo de Pago", type: "select" },
  { key: "monto", label: "Monto", type: "number" },
  { key: "referencia", label: "Referencia/Número" },
];

// Opciones para los selects
const opcionesTipoPago = [
  { value: "efectivo", label: "Efectivo", icon: <FaMoneyBillWave className="inline mr-2" /> },
  { value: "tarjeta", label: "Tarjeta", icon: <FaCreditCard className="inline mr-2" /> },
  { value: "transferencia", label: "Transferencia", icon: <FaExchangeAlt className="inline mr-2" /> }
];

export default function TablaPagos() {
  const [pagos, setPagos] = useState([]);
  const [ventas, setVentas] = useState([]);
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
        const [pagosRes, ventasRes] = await Promise.all([
          axios.get(API_URL),
          axios.get(VENTAS_URL)
        ]);
        
        // Enriquecer datos de pagos con información de ventas
        const pagosEnriquecidos = pagosRes.data.map(pago => {
          const venta = ventasRes.data.find(v => v.id_venta === pago.id_venta);
          
          return {
            ...pago,
            venta_id: pago.id_venta,
            venta_total: venta ? venta.total : null
          };
        });

        setPagos(pagosEnriquecidos);
        setVentas(ventasRes.data);
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
    if (pagos.length > 0) {
      const maxId = Math.max(...pagos.map(item => item.id_pago || 0));
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }
  }, [pagos]);

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
          response = await axios.put(`${API_URL}/${data.id_pago}`, data);
          break;
        case "delete":
          await axios.delete(`${API_URL}/${data.id_pago}`);
          break;
        default:
          throw new Error("Acción no válida");
      }

      // Recargar datos después de la operación
      const pagosRes = await axios.get(API_URL);
      const ventasRes = await axios.get(VENTAS_URL);
      
      const pagosEnriquecidos = pagosRes.data.map(pago => {
        const venta = ventasRes.data.find(v => v.id_venta === pago.id_venta);
        
        return {
          ...pago,
          venta_id: pago.id_venta,
          venta_total: venta ? venta.total : null
        };
      });

      setPagos(pagosEnriquecidos);
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
  const datosFiltrados = pagos.filter((item) =>
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
    if (window.confirm(`¿Está seguro que desea eliminar este pago?`)) {
      try {
        await handleCRUD("delete", { id_pago: id });
      } catch (err) {
        setError("Error al eliminar. Por favor intente nuevamente.");
      }
    }
  };

  const iniciarNuevoElemento = () => {
    const nuevoElementoInicial = {};
    todasLasColumnas.forEach(col => {
      if (col.key === 'id_pago') {
        nuevoElementoInicial[col.key] = nextId || 'Automático';
      } else if (col.key === 'tipo_pago') {
        nuevoElementoInicial[col.key] = 'efectivo';
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
    
    if (key === 'monto') {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    
    if (key === 'tipo_pago') {
      const tipo = opcionesTipoPago.find(op => op.value === value);
      return (
        <span>
          {tipo?.icon || ''} {tipo?.label || value}
        </span>
      );
    }
    
    return value;
  };

  // Determinar el ancho de los inputs según el tipo de dato
  const getInputWidth = (key) => {
    if (key === 'id_pago') return 'w-24';
    if (key === 'monto') return 'w-32';
    if (key === 'tipo_pago' || key === 'id_venta') return 'w-40';
    return 'w-full';
  };

  if (loading && pagos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Cargando pagos...</span>
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
            onClick={iniciarNuevoElemento}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center gap-1"
            disabled={loading}
          >
            <FaMoneyBillWave /> Nuevo pago
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
              {nuevoElemento ? `Nuevo pago` : `Editando pago`}
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
                {col.key === 'tipo_pago' ? (
                  <select
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={loading}
                  >
                    {opcionesTipoPago.map(opcion => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.icon} {opcion.label}
                      </option>
                    ))}
                  </select>
                ) : col.key === 'id_venta' ? (
                  <select
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={loading}
                  >
                    <option value="">Seleccione una venta</option>
                    {ventas.map(venta => (
                      <option key={venta.id_venta} value={venta.id_venta}>
                        Venta #{venta.id_venta} - ${venta.total} ({venta.estado})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={col.key === 'monto' ? 'number' : 'text'}
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={(col.key === 'id_pago') || loading}
                    readOnly={col.key === 'id_pago'}
                    step={col.key === 'monto' ? '0.01' : undefined}
                    placeholder={col.key === 'referencia' ? 'Ej: Número de transacción' : ''}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Información adicional para el usuario */}
          {formData.tipo_pago === 'tarjeta' && (
            <div className="mt-2 bg-blue-50 p-2 rounded text-sm text-blue-800">
              <FaCreditCard className="inline mr-2" />
              Para pagos con tarjeta, ingrese los últimos 4 dígitos de la tarjeta como referencia.
            </div>
          )}
          
          {formData.tipo_pago === 'transferencia' && (
            <div className="mt-2 bg-blue-50 p-2 rounded text-sm text-blue-800">
              <FaExchangeAlt className="inline mr-2" />
              Para transferencias, ingrese el número de referencia bancaria.
            </div>
          )}

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
            <h3 className="text-lg font-semibold">Detalle Completo del Pago</h3>
            <div className="flex gap-2">
              <button
                onClick={() => iniciarEdicion(viendo)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => eliminarElemento(viendo.id_pago)}
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
                  {col.key === 'id_venta' ? (
                    `Venta #${viendo.id_venta} - $${viendo.venta_total || 'N/A'}`
                  ) : (
                    formatearValor(col.key, viendo[col.key])
                  )}
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
              <tr key={`row-${item.id_pago}`} className="hover:bg-gray-200">
                {columnasVistaPrevia.map((col) => (
                  <td
                    key={`cell-${item.id_pago}-${col.key}`}
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

      {loading && pagos.length > 0 && (
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