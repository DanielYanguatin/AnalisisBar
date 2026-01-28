import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes, FaLock } from "react-icons/fa";

const API_URL = "http://localhost:5000/usuarios";

// Columnas para la vista previa en la tabla
const columnasVistaPrevia = [
  { key: "id_usuario", label: "ID", width: "0%", centrado: true },
  { key: "nombre", label: "Nombre", width: "15%" },
  { key: "correo", label: "Correo", width: "15%" },
  { key: "rol", label: "Rol", width: "15%" },
  { key: "estado", label: "Estado", width: "0%" },
];

// Todas las columnas para el detalle completo
const todasLasColumnas = [
  { key: "id_usuario", label: "ID Usuario" },
  { key: "nombre", label: "Nombre Completo" },
  { key: "correo", label: "Correo Electrónico" },
  { key: "rol", label: "Rol", type: "select" },
  { key: "estado", label: "Estado", type: "select" },
  { key: "contraseña", label: "Contraseña", type: "password" },
];

// Opciones para los selects
const opcionesRol = [
  { value: "admin", label: "Administrador" },
  { value: "cajero", label: "Cajero" }
];

const opcionesEstado = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" }
];

// Ejemplos de placeholders para los campos
const ejemplosPlaceholder = {
  nombre: "Ej: Juan Pérez",
  correo: "Ej: juan@ejemplo.com",
  contraseña: "••••••••"
};

export default function TablaUsuarios() {
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
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Calcular el próximo ID disponible
  useEffect(() => {
    if (usuarios.length > 0) {
      const maxId = Math.max(...usuarios.map(item => item.id_usuario || 0));
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }
  }, [usuarios]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      setError(`Error al cargar usuarios: ${err.message}`);
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar operaciones CRUD
  const handleCRUD = async (action, data) => {
    try {
      setLoading(true);
      let response;

      // Preparamos los datos para el servidor
      const datosParaServidor = { ...data };
      
      // Si es creación y no se proporcionó contraseña, generamos una por defecto
      if (action === "create" && !datosParaServidor.contraseña) {
        datosParaServidor.contraseña = "tempPassword123"; // En producción, generar algo más seguro
      }

      switch (action) {
        case "create":
          response = await axios.post(API_URL, datosParaServidor);
          break;
        case "update":
          // No actualizamos contraseña si no se modificó
          if (!datosParaServidor.contraseña || datosParaServidor.contraseña === "••••••••") {
            delete datosParaServidor.contraseña;
          }
          response = await axios.put(`${API_URL}/${data.id_usuario}`, datosParaServidor);
          break;
        case "delete":
          await axios.delete(`${API_URL}/${data.id_usuario}`);
          break;
        default:
          throw new Error("Acción no válida");
      }

      await cargarDatos(); // Recargar datos después de la operación
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
  const datosFiltrados = usuarios.filter((item) =>
    campo ? String(item[campo]).toLowerCase().includes(busqueda.toLowerCase()) : true
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
    setFormData({ 
      ...item,
      contraseña: "••••••••" // No mostrar la contraseña real
    });
    setViendo(null);
    setNuevoElemento(false);
    setError(null);
    setMostrarContraseña(false);
  };

  const cancelarAccion = () => {
    setEditando(null);
    setViendo(null);
    setNuevoElemento(false);
    setFormData({});
    setError(null);
    setMostrarContraseña(false);
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
    if (window.confirm(`¿Está seguro que desea eliminar este usuario?`)) {
      try {
        await handleCRUD("delete", { id_usuario: id });
      } catch (err) {
        setError("Error al eliminar. Por favor intente nuevamente.");
      }
    }
  };

  const iniciarNuevoElemento = () => {
    const nuevoElementoInicial = {};
    todasLasColumnas.forEach(col => {
      if (col.key === 'id_usuario') {
        nuevoElementoInicial[col.key] = nextId || 'Automático';
      } else if (col.key === 'rol') {
        nuevoElementoInicial[col.key] = 'cajero';
      } else if (col.key === 'estado') {
        nuevoElementoInicial[col.key] = 'activo';
      } else {
        nuevoElementoInicial[col.key] = '';
      }
    });
    setFormData(nuevoElementoInicial);
    setNuevoElemento(true);
    setEditando(null);
    setViendo(null);
    setError(null);
    setMostrarContraseña(false);
  };

  // Función para formatear valores
  const formatearValor = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">N/A</span>;
    }
    
    if (key === 'estado') {
      return value === 'activo' ? (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
          ACTIVO
        </span>
      ) : (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
          INACTIVO
        </span>
      );
    }
    
    if (key === 'rol') {
      return value === 'admin' ? 'Administrador' : 'Cajero';
    }
    
    if (key === 'contraseña') {
      return <span className="text-gray-500"><FaLock /></span>;
    }
    
    return value;
  };

  // Determinar el ancho de los inputs según el tipo de dato
  const getInputWidth = (key) => {
    if (key === 'id_usuario') return 'w-24';
    if (key === 'rol' || key === 'estado') return 'w-40';
    return 'w-full';
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
        <button
          onClick={cargarDatos}
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
            <FaPlus /> Agregar usuario
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
              {nuevoElemento ? `Nuevo usuario` : `Editando usuario`}
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
                {col.key === 'rol' || col.key === 'estado' ? (
                  <select
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={loading}
                  >
                    {col.key === 'rol' ? (
                      opcionesRol.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))
                    ) : (
                      opcionesEstado.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))
                    )}
                  </select>
                ) : col.key === 'contraseña' ? (
                  <div className="relative">
                    <input
                      type={mostrarContraseña ? "text" : "password"}
                      name={col.key}
                      value={formData[col.key] || ''}
                      onChange={handleInputChange}
                      placeholder={ejemplosPlaceholder[col.key] || ''}
                      className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarContraseña(!mostrarContraseña)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarContraseña ? <FaEye /> : <FaLock />}
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    name={col.key}
                    value={formData[col.key] || ''}
                    onChange={handleInputChange}
                    placeholder={ejemplosPlaceholder[col.key] || ''}
                    className={`p-1 px-2 border border-gray-300 rounded text-sm ${getInputWidth(col.key)}`}
                    disabled={(col.key === 'id_usuario') || loading}
                    readOnly={col.key === 'id_usuario'}
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
            <h3 className="text-lg font-semibold">Detalle Completo del Usuario</h3>
            <div className="flex gap-2">
              <button
                onClick={() => iniciarEdicion(viendo)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded text-sm flex items-center gap-1"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => eliminarElemento(viendo.id_usuario)}
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
              <tr key={`row-${item.id_usuario}`} className="hover:bg-gray-200">
                {columnasVistaPrevia.map((col) => (
                  <td
                    key={`cell-${item.id_usuario}-${col.key}`}
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

      {loading && usuarios.length > 0 && (
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