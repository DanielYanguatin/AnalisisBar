import axios from "axios";

const API_URL_PRODUCTS = "http://localhost:3000/productos";

// Obtener todos los productos (GET)
export const obtenerProductos = async () => {
  try {
    const res = await axios.get(API_URL_PRODUCTS);
    return res.data;
  } catch (err) {
    throw new Error("Error al obtener productos");
  }
};

// Crear un nuevo producto (POST)
export const crearProducto = async (nuevoProducto) => {
  try {
    const res = await axios.post(API_URL_PRODUCTS, nuevoProducto);
    return res.data;
  } catch (err) {
    throw new Error("Error al crear producto");
  }
};

// Actualizar un producto (PUT)
export const actualizarProducto = async (id, datosActualizados) => {
  try {
    const res = await axios.put(`${API_URL_PRODUCTS}/${id}`, datosActualizados);
    return res.data;
  } catch (err) {
    throw new Error("Error al actualizar producto");
  }
};

// Eliminar un producto (DELETE)
export const eliminarProducto = async (id) => {
  try {
    const res = await axios.delete(`${API_URL_PRODUCTS}/${id}`);
    return res.data;
  } catch (err) {
    throw new Error("Error al eliminar producto");
  }
};
