import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

function Facturar() {
  // Estados para los datos generales
  const [cliente, setCliente] = useState("");
  const [idCliente, setIdCliente] = useState(null);
  const [contacto, setContacto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [numeroFactura] = useState(`FAC-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`);
  const [formaPago, setFormaPago] = useState("");
  const [montoRecibido, setMontoRecibido] = useState(0);
  const [inputValue, setInputValue] = useState("0,00");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [idUsuario] = useState(1);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalProducts, setModalProducts] = useState([]);
  const [modalActiveIndex, setModalActiveIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeField, setActiveField] = useState({ row: 0, col: 0 });

  const [productos, setProductos] = useState([
    {
      codigo: "",
      nombre: "",
      id_producto: null,
      cantidad: 1,
      valorUnitario: 0,
      descuento: 0,
    },
  ]);

  // Formatear números al formato colombiano
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Convertir formato colombiano a número
  const parseNumber = (str) => {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  };

  const handleMontoChange = (e) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      setInputValue("");
      return;
    }

    if (/^[\d.]*,?\d{0,2}$/.test(rawValue)) {
      setInputValue(rawValue);
      const numericValue = parseNumber(rawValue) || 0;
      setMontoRecibido(numericValue);
    }
  };

  const handleBlur = () => {
    if (inputValue === "" || isNaN(parseNumber(inputValue))) {
      setInputValue("0,00");
      setMontoRecibido(0);
    } else {
      const formatted = formatNumber(parseNumber(inputValue));
      setInputValue(formatted);
      setMontoRecibido(parseNumber(formatted));
    }
  };

  const seleccionarCliente = (cli) => {
    setCliente(cli.nombre);
    setIdCliente(cli.id_cliente);
    setContacto(cli.telefono || cli.correo || "");
    setClienteSeleccionado(cli);
    setClientes([]);
  };

  const handleKeyDown = (e) => {
    if (clientes.length === 0) return;

    if (e.key === "Enter") {
      e.preventDefault();
      seleccionarCliente(clientes[0]);
    } else if (e.key === "Escape") {
      setClientes([]);
    }
  };

  const buscarClientes = async (termino) => {
    try {
      const response = await axios.get(`http://localhost:5000/clientes/buscar?termino=${termino}`);
      setClientes(response.data);
    } catch (error) {
      console.error("Error buscando clientes:", error);
      mostrarMensaje("Error al buscar clientes", "error");
    }
  };

  const buscarProductosModal = async (termino) => {
    if (termino.length < 2) {
      setModalProducts([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/inventario/buscar?termino=${termino}`);
      setModalProducts(response.data);
      setModalActiveIndex(0);
    } catch (error) {
      console.error("Error buscando productos:", error);
      mostrarMensaje("Error al buscar productos", "error");
    }
  };

  const seleccionarProducto = (prod, index) => {
    const nuevosProductos = [...productos];
    
    nuevosProductos[index] = {
      ...nuevosProductos[index],
      codigo: prod.codigo,
      nombre: prod.nombre,
      valorUnitario: prod.precio_venta,
      id_producto: prod.id,
      cantidad: 1,
    };

    setProductos(nuevosProductos);
    setActiveField({ row: index, col: 2 }); // Mover a cantidad
    setShowProductModal(false);
  };

  const handleModalKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (modalProducts.length > 0) {
        seleccionarProducto(modalProducts[modalActiveIndex], activeField.row);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setModalActiveIndex(prev => prev <= 0 ? modalProducts.length - 1 : prev - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setModalActiveIndex(prev => prev >= modalProducts.length - 1 ? 0 : prev + 1);
    } else if (e.key === "Escape") {
      setShowProductModal(false);
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000);
  };

  const calcularTotalProducto = (producto) => {
    const subtotal = producto.cantidad * producto.valorUnitario;
    const totalDescuento = subtotal * (producto.descuento / 100);
    return subtotal - totalDescuento;
  };

  const totalNeto = productos.reduce((sum, producto) => sum + calcularTotalProducto(producto), 0);

  const devuelta = montoRecibido - totalNeto > 0 ? montoRecibido - totalNeto : 0;

  const agregarProducto = () => {
    setProductos([...productos, { codigo: "", nombre: "", id_producto: null, cantidad: 1, valorUnitario: 0, descuento: 0 }]);
    setActiveField({ row: productos.length, col: 0 });
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][campo] = valor;
    setProductos(nuevosProductos);
  };

  const eliminarProducto = (index) => {
    if (productos.length <= 1) {
      mostrarMensaje("Debe haber al menos un producto", "error");
      return;
    }
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    setActiveField({ row: Math.min(index, nuevosProductos.length - 1), col: 0 });
  };

  const validarFormulario = () => {
    const productosValidos = productos.filter((p) => p.id_producto);

    if (totalNeto <= 0) {
      mostrarMensaje("El total debe ser mayor a cero", "error");
      return false;
    }

    if (productos.some((p) => p.valorUnitario < 0 || p.descuento < 0)) {
      mostrarMensaje("Los valores unitarios y descuentos no pueden ser negativos", "error");
      return false;
    }

    if (productos.some((p) => p.cantidad <= 0)) {
      mostrarMensaje("Las cantidades deben ser positivas", "error");
      return false;
    }

    if (!clienteSeleccionado || !idCliente) {
      mostrarMensaje("Por favor seleccione un cliente válido", "error");
      return false;
    }

    if (productosValidos.length === 0) {
      mostrarMensaje("Por favor ingrese al menos un producto válido", "error");
      return false;
    }

    if (!formaPago) {
      mostrarMensaje("Por favor seleccione una forma de pago", "error");
      return false;
    }

    if (formaPago === "efectivo" && montoRecibido < totalNeto) {
      mostrarMensaje(`El monto recibido (${formatNumber(montoRecibido)}) no puede ser menor al total (${formatNumber(totalNeto)})`, "error");
      return false;
    }

    return true;
  };

  const guardarFactura = async () => {
    const productosValidos = productos.filter((p) => p.id_producto);

    if (!validarFormulario()) return;

    try {
      const datosFactura = {
        venta: {
          id_usuario: idUsuario,
          id_cliente: idCliente,
          total: totalNeto,
          estado: "completada",
          forma_pago: formaPago,
          monto_recibido: formaPago === "efectivo" ? parseFloat(montoRecibido) : parseFloat(totalNeto),
          devuelta: formaPago === "efectivo" ? parseFloat(devuelta) : null,
        },
        productos: productosValidos.map((producto) => ({
          id_producto: producto.id_producto,
          cantidad: parseInt(producto.cantidad),
          precio_unitario: parseFloat(producto.valorUnitario),
          descuento: parseFloat(producto.descuento),
        })),
      };

      const response = await axios.post("http://localhost:5000/ventas/crear-venta", datosFactura);

      if (response.data.success) {
        // Mostrar modal de éxito
        let mensajeExito = "FACTURA GUARDADA EXITOSAMENTE!";
        if (formaPago === "efectivo") {
          mensajeExito += `\n\nDevuelta: $${formatNumber(devuelta)}`;
        }
        setSuccessMessage(mensajeExito);
        setShowSuccessModal(true);

        // Limpiar formulario
        setCliente("");
        setContacto("");
        setIdCliente(null);
        setClienteSeleccionado(null);
        setProductos([
          {
            codigo: "",
            nombre: "",
            id_producto: null,
            cantidad: 1,
            valorUnitario: 0,
            descuento: 0,
          },
        ]);
        setFormaPago("");
        setMontoRecibido(0);
        setInputValue("0,00");
        setActiveField({ row: 0, col: 0 });
      } else {
        mostrarMensaje("Error al guardar la factura: " + response.data.message, "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido al guardar la factura";
      mostrarMensaje(errorMessage, "error");
    }
  };

  // Efecto para manejar el evento global de teclado para F1
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        setShowProductModal(true);
        setModalSearchTerm("");
        buscarProductosModal("");
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Efecto para manejar la navegación con teclado
  useEffect(() => {
    const handleKeyNavigation = (e) => {
      if (showProductModal || showSuccessModal) return;

      const currentRow = activeField.row;
      const currentCol = activeField.col;
      const lastRow = productos.length - 1;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentCol < 5) {
          setActiveField({ row: currentRow, col: currentCol + 1 });
        } else if (currentRow < lastRow) {
          setActiveField({ row: currentRow + 1, col: 0 });
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentCol > 0) {
          setActiveField({ row: currentRow, col: currentCol - 1 });
        } else if (currentRow > 0) {
          setActiveField({ row: currentRow - 1, col: 5 });
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentRow < lastRow) {
          setActiveField({ row: currentRow + 1, col: currentCol });
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentRow > 0) {
          setActiveField({ row: currentRow - 1, col: currentCol });
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentCol === 5 && currentRow === lastRow) {
          agregarProducto();
        } else if (currentCol < 5) {
          setActiveField({ row: currentRow, col: currentCol + 1 });
        } else if (currentRow < lastRow) {
          setActiveField({ row: currentRow + 1, col: 0 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyNavigation);
    return () => {
      window.removeEventListener('keydown', handleKeyNavigation);
    };
  }, [activeField, productos.length]);

  // Efecto para enfocar el campo activo
  useEffect(() => {
    const focusActiveField = () => {
      const rows = document.querySelectorAll('tbody tr');
      if (rows.length > activeField.row) {
        const cells = rows[activeField.row].querySelectorAll('td');
        if (cells.length > activeField.col + 1) { // +1 porque la primera columna es el número
          const input = cells[activeField.col + 1].querySelector('input');
          if (input) {
            input.focus();
            input.select();
          }
        }
      }
    };

    focusActiveField();
  }, [activeField]);

  return (
    <div className='bg-white rounded-lg shadow-2xl p-4 md:p-6'>
      {mensaje.texto && (
        <div className={`mb-4 p-3 rounded-md ${mensaje.tipo === "error" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Modal de búsqueda de productos */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[80vh] flex flex-col"
            onKeyDown={handleModalKeyDown}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">"F1 para buscar" (F1)</h2>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              className="p-3 border border-gray-400 rounded-md text-lg w-full mb-4"
              value={modalSearchTerm}
              onChange={(e) => {
                setModalSearchTerm(e.target.value);
                buscarProductosModal(e.target.value);
              }}
              autoFocus
              placeholder="Buscar producto por código o nombre..."
            />
            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-md">
              {modalProducts.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {modalProducts.map((prod, index) => (
                    <li
                      key={prod.id}
                      className={`p-3 cursor-pointer ${index === modalActiveIndex ? "bg-[#2196f3] text-white" : "hover:bg-gray-100"}`}
                      onClick={() => {
                        seleccionarProducto(prod, activeField.row);
                        setShowProductModal(false);
                      }}
                      onMouseEnter={() => setModalActiveIndex(index)}
                    >
                      <div className="flex justify-between font-medium">
                        <span className="truncate">{prod.codigo}</span>
                        <span>${formatNumber(prod.precio_venta || 0)}</span>
                      </div>
                      <div className="text-gray-700 truncate">{prod.nombre}</div>
                      <div className="text-xs">
                        Stock: {prod.stock} | {prod.unidad_medida}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {modalSearchTerm.length >= 2 ? "No se encontraron productos" : "Ingrese al menos 2 caracteres para buscar"}
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>↑ ↓ para navegar | Enter para seleccionar | Esc para salir</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Operación exitosa</h3>
              <div className="mt-2 text-sm text-gray-500 whitespace-pre-line">
                {successMessage}
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#72cf44] border border-transparent rounded-md hover:bg-[#5cb82e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col md:flex-row justify-between mb-4 gap-4'>
        <div className='w-full md:w-1/3 space-y-4'>
          <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
            <label className='text-[#212121] w-32 md:w-20 text-sm font-medium'>Tipo</label>
            <select className='flex-1 p-2 border border-gray-400 rounded-md text-sm w-full'>
              <option>Factura</option>
              <option>Recibo</option>
              <option>Nota de crédito</option>
            </select>
          </div>

          <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center relative'>
            <label className='text-[#212121] w-32 md:w-20 text-sm font-medium'>Cliente</label>
            <div className='flex-1 relative w-full'>
              <input
                type='text'
                className='flex-1 p-2 border border-gray-400 rounded-md text-sm w-full'
                value={cliente}
                onChange={(e) => {
                  setCliente(e.target.value);
                  if (e.target.value.length > 1) {
                    buscarClientes(e.target.value);
                  } else {
                    setClientes([]);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder='Buscar cliente...'
              />
              {clientes.length > 0 && (
                <ul className='absolute z-10 w-full mt-1 bg-white border border-gray-400 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {clientes.map((cli, index) => (
                    <li
                      key={cli.id_cliente}
                      className={`p-2 cursor-pointer text-sm ${index === 0 ? "bg-[#2196f3] text-white" : "hover:bg-gray-100"}`}
                      onClick={() => seleccionarCliente(cli)}
                    >
                      {cli.nombre} - {cli.telefono || cli.correo || "Sin contacto"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
            <label className='text-[#212121] w-32 md:w-20 text-sm font-medium'>Contacto</label>
            <input
              type='text'
              className='flex-1 p-2 border border-gray-400 rounded-md text-sm w-full'
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              placeholder='Se autocompletará al seleccionar cliente'
            />
          </div>
        </div>

        <div className='w-full md:w-1/2 flex justify-end'>
          <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full md:w-auto'>
            <label className='text-[#212121] w-32 md:w-20 text-sm font-medium'>Fecha</label>
            <input type='date' className='flex-1 p-2 border border-gray-400 rounded-md text-sm w-full' value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
        </div>
      </div>

      <div className='mb-4 overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-[#ededed] text-sm'>
              <th className='p-2 text-left w-8'>#</th>
              <th className='p-2 text-left w-28'>Código</th>
              <th className='p-2 text-left'>Producto</th>
              <th className='p-2 text-left w-16'>Cantidad</th>
              <th className='p-2 text-left w-24'>Precio</th>
              <th className='p-2 text-left w-16'>Desc.%</th>
              <th className='p-2 text-left w-20'>Total</th>
              <th className='p-2 text-left w-10'>
                <FaTrash className='text-red-500 w-4 h-4 mx-auto' />
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index} className='border-b hover:bg-gray-50 text-sm'>
                <td className='p-2'>{index + 1}</td>
                <td className='p-2'>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-400 rounded text-xs'
                    value={producto.codigo}
                    onChange={(e) => {
                      actualizarProducto(index, "codigo", e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "F1") {
                        e.preventDefault();
                        setShowProductModal(true);
                        setModalSearchTerm(producto.codigo);
                        buscarProductosModal(producto.codigo);
                      }  
                    }}
                    placeholder='(F1) Buscar producto ...'
                  />
                </td>
                <td className='p-2'>
                  <input 
                    type='text' 
                    className='w-full p-2 border border-gray-400 rounded text-xs bg-gray-50' 
                    value={producto.nombre} 
                    readOnly 
                  />
                </td>
                <td className='p-2'>
                  <input
                    type='number'
                    min='1'
                    max={producto.id_producto ? 999 : 999}
                    className={`w-full p-2 border border-gray-400 rounded text-xs ${!producto.id_producto ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    value={producto.cantidad}
                    onChange={(e) => {
                      const value = Math.min(parseInt(e.target.value) || 1, 999);
                      actualizarProducto(index, "cantidad", value);
                    }}
                    disabled={!producto.id_producto}
                  />
                </td>
                <td className='p-2'>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-400 rounded text-xs bg-gray-100 cursor-not-allowed'
                    value={producto.id_producto ? formatNumber(producto.valorUnitario) : ''}
                    readOnly
                  />
                </td>
                <td className='p-2'>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    className={`w-full p-2 border border-gray-400 rounded text-xs ${!producto.id_producto ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    value={producto.descuento}
                    onChange={(e) => actualizarProducto(index, "descuento", parseFloat(e.target.value) || 0)}
                    disabled={!producto.id_producto}
                  />
                </td>
                <td className='p-2 text-right pr-2'>${formatNumber(calcularTotalProducto(producto))}</td>
                <td className='p-2 text-center'>
                  {productos.length > 1 && (
                    <button onClick={() => eliminarProducto(index)} className='text-red-500 hover:text-red-700 text-lg font-bold' title='Eliminar producto'>
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mb-4'>
        <h2 className='text-sm font-semibold mb-2 text-[#212121]'>Formas de pago</h2>
        <div className='flex flex-col sm:flex-row gap-2'>
          <select 
            className='p-2 border border-gray-400 rounded-md flex-grow text-sm' 
            value={formaPago} 
            onChange={(e) => {
              setFormaPago(e.target.value);
              if (e.target.value === "efectivo") {
                setTimeout(() => {
                  const montoInput = document.querySelector('input[placeholder="0,00"]');
                  if (montoInput) {
                    montoInput.focus();
                    montoInput.select();  
                  }
                }, 50);
              }
            }}
          >
            <option value=''>Seleccione forma de pago</option>
            <option value='efectivo'>Efectivo</option>
            <option value='tarjeta'>Tarjeta</option>
            <option value='transferencia'>Transferencia</option>
          </select>
          {formaPago === "efectivo" && (
            <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
              <div className='relative'>
                <span className='absolute left-3 top-2 text-gray-500'>$</span>
                <input
                  type='text'
                  inputMode='decimal'
                  className='p-2 pl-7 border border-gray-400 rounded-md w-full text-sm'
                  placeholder='0,00'
                  value={inputValue}
                  onChange={handleMontoChange}
                  onBlur={handleBlur}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className='p-2 text-sm text-[#212121] flex items-center'>
                Devuelta: <span className='font-semibold ml-1'>${formatNumber(devuelta)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-end'>
        <div className='w-full md:w-1/3 space-y-2 bg-[#ededed] p-4 rounded-md border border-gray-200'>
          <div className='flex justify-between font-semibold text-[#212121]'>
            <span>Subtotal:</span>
            <span>${formatNumber(totalNeto)}</span>
          </div>
          {formaPago === "efectivo" && (
            <>
              <div className='flex justify-between font-semibold text-[#212121]'>
                <span>Recibe:</span>
                <span>${formatNumber(montoRecibido)}</span>
              </div>
              <div className='flex justify-between font-bold text-lg border-t pt-2 text-[#2196f3]'>
                <span>Devuelta:</span>
                <span>${formatNumber(devuelta)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className='flex justify-end mt-6'>
        <button onClick={guardarFactura} className='px-6 py-2 bg-[#72cf44] text-white rounded-md hover:bg-[#5cb82e] font-medium flex items-center gap-2 w-full sm:w-auto justify-center'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
          Generar venta
        </button>
      </div>
    </div>
  );
}

export default Facturar;
// import React, { useEffect, useState } from "react";
// import {FaTrash} from "react-icons/fa"
// import axios from "axios";

// function Facturar() {
//   // Estados para los datos generales
//   const [cliente, setCliente] = useState("");
//   const [idCliente, setIdCliente] = useState(null);
//   const [contacto, setContacto] = useState("");
//   const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
//   const [numeroFactura] = useState(`FAC-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`);
//   const [formaPago, setFormaPago] = useState("");
//   const [montoRecibido, setMontoRecibido] = useState(0);
//   const [inputValue, setInputValue] = useState('0.00');
//   const [clientes, setClientes] = useState([]);
//   const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
//   const [activeProductIndex, setActiveProductIndex] = useState({});
//   const [productosSugeridos, setProductosSugeridos] = useState({});
//   const [mostrarSugProductos, setMostrarSugProductos] = useState({});
//   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
//   const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false);
//   const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
//   const [idUsuario] = useState(1);

//   const [productos, setProductos] = useState([
//     {
//       codigo: "",
//       nombre: "",
//       id_producto: null,
//       cantidad: 1,
//       valorUnitario: 0,
//       descuento: 0
//     },
//   ]);

//   const handleMontoChange = (e) => {
//     const rawValue = e.target.value;

//     if (rawValue === '') {
//       setInputValue('');
//       return;
//     }

//     if (/^\d*\.?\d{0,2}$/.test(rawValue)) {
//       setInputValue(rawValue);
//       const numericValue = parseFloat(rawValue) || 0;
//       setMontoRecibido(numericValue);
//     }
//   };

//   const handleBlur = () => {
//     if (inputValue === '' || isNaN(parseFloat(inputValue))) {
//       setInputValue('0.00');
//       setMontoRecibido(0);
//     } else {
//       const formatted = parseFloat(inputValue).toFixed(2);
//       setInputValue(formatted);
//       setMontoRecibido(parseFloat(formatted));
//     }
//   };

//   const seleccionarCliente = (cli) => {
//     setCliente(cli.nombre);
//     setIdCliente(cli.id_cliente);
//     setContacto(cli.telefono || cli.correo || '');
//     setClienteSeleccionado(cli);
//     setClientes([]);
//     setActiveSuggestionIndex(-1);
//     setIsSuggestionListOpen(false);
//   };

//   const handleKeyDown = (e) => {
//     if (clientes.length === 0) return;

//     if (e.key === 'Enter') {
//       e.preventDefault();
//       if (activeSuggestionIndex >= 0) {
//         seleccionarCliente(clientes[activeSuggestionIndex]);
//       }
//     }
//     else if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       setActiveSuggestionIndex(prev =>
//         prev <= 0 ? clientes.length - 1 : prev - 1
//       );
//     }
//     else if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       setActiveSuggestionIndex(prev =>
//         prev >= clientes.length - 1 ? 0 : prev + 1
//       );
//     }
//     else if (e.key === 'Escape') {
//       setClientes([]);
//       setActiveSuggestionIndex(-1);
//       setIsSuggestionListOpen(false);
//     }
//   };

//   const buscarClientes = async (termino) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/clientes/buscar?termino=${termino}`);
//       setClientes(response.data);
//     } catch (error) {
//       console.error("Error buscando clientes:", error);
//       mostrarMensaje("Error al buscar clientes", "error");
//     }
//   };

//   const buscarProductos = async (termino, index) => {
//     if (termino.length < 2) {
//       setProductosSugeridos(prev => ({...prev, [index]: []}));
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:5000/inventario/buscar?termino=${termino}`);
//       setProductosSugeridos(prev => ({...prev, [index]: response.data}));
//       setMostrarSugProductos(prev => ({...prev, [index]: true}));
//     } catch (error) {
//       console.error("Error buscando productos:", error);
//       mostrarMensaje("Error al buscar productos", "error");
//     }
//   };

//   const seleccionarProducto = (prod, index) => {
//     const nuevosProductos = [...productos];

//     nuevosProductos[index] = {
//       ...nuevosProductos[index],
//       codigo: prod.codigo,
//       nombre: prod.nombre,
//       valorUnitario: prod.precio_venta,
//       id_producto: prod.id,
//       cantidad: 1
//     };

//     if (index === productos.length - 1) {
//       nuevosProductos.push({
//         codigo: "",
//         nombre: "",
//         id_producto: null,
//         cantidad: 1,
//         valorUnitario: 0,
//         descuento: 0
//       });
//     }

//     setProductos(nuevosProductos);
//     setProductosSugeridos(prev => ({...prev, [index]: []}));
//     setMostrarSugProductos(prev => ({...prev, [index]: false}));
//     setActiveProductIndex(prev => ({...prev, [index]: -1}));

//     setTimeout(() => {
//       const cantidadInputs = document.querySelectorAll(`input[type="number"][min="1"]`);
//       if (cantidadInputs[index]) {
//         cantidadInputs[index].focus();
//         cantidadInputs[index].select();
//       }
//     }, 50);
//   };

//   const handleProductKeyDown = (e, index) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();

//       if (productosSugeridos[index]?.length > 0) {
//         const selectedIndex = activeProductIndex[index] >= 0
//           ? activeProductIndex[index]
//           : 0;
//         seleccionarProducto(productosSugeridos[index][selectedIndex], index);
//       }
//       else if (productos[index].codigo.trim() !== "" && index === productos.length - 1) {
//         setProductos([...productos, {
//           codigo: "",
//           nombre: "",
//           id_producto: null,
//           cantidad: 1,
//           valorUnitario: 0,
//           descuento: 0
//         }]);
//       }
//     }
//     else if (productosSugeridos[index]?.length > 0) {
//       if (e.key === 'ArrowUp') {
//         e.preventDefault();
//         setActiveProductIndex(prev => ({
//           ...prev,
//           [index]: prev[index] <= 0 ? productosSugeridos[index].length - 1 : prev[index] - 1
//         }));
//       }
//       else if (e.key === 'ArrowDown') {
//         e.preventDefault();
//         setActiveProductIndex(prev => ({
//           ...prev,
//           [index]: prev[index] >= productosSugeridos[index].length - 1 ? 0 : prev[index] + 1
//         }));
//       }
//       else if (e.key === 'Escape') {
//         setProductosSugeridos(prev => ({...prev, [index]: []}));
//         setMostrarSugProductos(prev => ({...prev, [index]: false}));
//         setActiveProductIndex(prev => ({...prev, [index]: -1}));
//       }
//     }
//   };

//   const mostrarMensaje = (texto, tipo) => {
//     setMensaje({ texto, tipo });
//     setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000);
//   };

//   const calcularTotalProducto = (producto) => {
//     const subtotal = producto.cantidad * producto.valorUnitario;
//     const totalDescuento = subtotal * (producto.descuento / 100);
//     return subtotal - totalDescuento;
//   };

//   const totalNeto = productos.reduce(
//     (sum, producto) => sum + calcularTotalProducto(producto),
//     0
//   );

//   const devuelta = montoRecibido - totalNeto > 0 ? montoRecibido - totalNeto : 0;

//   const agregarProducto = () => {
//     setProductos([
//       ...productos,
//       { codigo: "", nombre: "", id_producto: null, cantidad: 1, valorUnitario: 0, descuento: 0 },
//     ]);
//   };

//   const actualizarProducto = (index, campo, valor) => {
//     const nuevosProductos = [...productos];
//     nuevosProductos[index][campo] = valor;
//     setProductos(nuevosProductos);
//   };

//   const eliminarProducto = (index) => {
//     if (productos.length <= 1) {
//       mostrarMensaje("Debe haber al menos un producto", "error");
//       return;
//     }
//     const nuevosProductos = productos.filter((_, i) => i !== index);
//     setProductos(nuevosProductos);
//   };

//   const validarFormulario = () => {
//     const productosValidos = productos.filter(p => p.id_producto);

//     if (totalNeto <= 0) {
//       mostrarMensaje("El total debe ser mayor a cero", "error");
//       return false;
//     }

//     if (productos.some(p => p.valorUnitario < 0 || p.descuento < 0)) {
//       mostrarMensaje("Los valores unitarios y descuentos no pueden ser negativos", "error");
//       return false;
//     }

//     if (productos.some(p => p.cantidad <= 0)) {
//       mostrarMensaje("Las cantidades deben ser positivas", "error");
//       return false;
//     }

//     if (!clienteSeleccionado || !idCliente) {
//       mostrarMensaje("Por favor seleccione un cliente válido", "error");
//       return false;
//     }

//     if (productosValidos.length === 0) {
//       mostrarMensaje("Por favor ingrese al menos un producto válido", "error");
//       return false;
//     }

//     if (!formaPago) {
//       mostrarMensaje("Por favor seleccione una forma de pago", "error");
//       return false;
//     }

//     if (formaPago === "efectivo") {
//       const montoNum = parseFloat(montoRecibido);
//       const totalNum = parseFloat(totalNeto);

//       if (isNaN(montoNum)) {
//         mostrarMensaje("Por favor ingrese un monto recibido válido", "error");
//         return false;
//       }

//       if (montoNum < totalNum) {
//         mostrarMensaje(`El monto recibido (${montoNum.toFixed(2)}) no puede ser menor al total (${totalNum.toFixed(2)})`, "error");
//         return false;
//       }
//     }

//     return true;
//   };

//   const guardarFactura = async () => {
//     const productosValidos = productos.filter(p => p.id_producto);

//     if (!validarFormulario()) return;

//     try {
//       const datosFactura = {
//         venta: {
//           id_usuario: idUsuario,
//           id_cliente: idCliente,
//           total: totalNeto,
//           estado: 'completada',
//           forma_pago: formaPago,
//           monto_recibido: formaPago === "efectivo" ? parseFloat(montoRecibido) : parseFloat(totalNeto),
//           devuelta: formaPago === "efectivo" ? parseFloat(devuelta) : null
//         },
//         productos: productosValidos.map(producto => ({
//           id_producto: producto.id_producto,
//           cantidad: parseInt(producto.cantidad),
//           precio_unitario: parseFloat(producto.valorUnitario),
//           descuento: parseFloat(producto.descuento)
//         }))
//       };

//       const response = await axios.post('http://localhost:5000/ventas/crear-venta', datosFactura);

//       if (response.data.success) {
//         mostrarMensaje('Factura guardada exitosamente!', "exito");

//         setCliente("");
//         setContacto("");
//         setIdCliente(null);
//         setClienteSeleccionado(null);
//         setProductos([{
//           codigo: "",
//           nombre: "",
//           id_producto: null,
//           cantidad: 1,
//           valorUnitario: 0,
//           descuento: 0
//         }]);
//         setFormaPago("");
//         setMontoRecibido(0);
//       } else {
//         mostrarMensaje('Error al guardar la factura: ' + response.data.message, "error");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message ||
//                          error.message ||
//                          "Error desconocido al guardar la factura";
//       mostrarMensaje(errorMessage, "error");
//     }
//   };

//   return (
//     // <div className="w-full p-4 md:p-8 bg-gray-200 rounded-lg shadow-sm">
// <div className="bg-white rounded-lg shadow-2xl p-6">

//       {mensaje.texto && (
//         <div className={`mb-4 p-3 rounded-md ${
//           mensaje.tipo === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//         }`}>
//           {mensaje.texto}
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
//         <div className="w-full md:w-1/2 space-y-4">
//           {/* <div className="flex items-center gap-2">
//             <label className="text-gray-700 w-32 md:w-20">Número de factura</label>
//             <input
//               type="text"//COMENTARIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS
//               className="flex-1 p-2 border border-gray-400 rounded-md bg-gray-100 text-sm"
//               value={numeroFactura}
//               readOnly
//             />
//           </div> */}

//           <div className="flex items-center gap-2">
//             <label className="text-gray-700 w-32 md:w-20">Tipo</label>
//             <select className="flex-1 p-2 border border-gray-400 rounded-md text-sm">
//               <option>Factura</option>
//               <option>Recibo</option>
//               <option>Nota de crédito</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-2 relative">
//             <label className="text-gray-700 w-32 md:w-20">Cliente</label>
//             <div className="flex-1 relative">
//               <input
//                 type="text"
//                 className="flex-1 p-2 border border-gray-400 rounded-md text-sm"
//                 value={cliente}
//                 onChange={(e) => {
//                   setCliente(e.target.value);
//                   setActiveSuggestionIndex(-1);
//                   if (e.target.value.length > 1) {
//                     buscarClientes(e.target.value);
//                     setIsSuggestionListOpen(true);
//                   } else {
//                     setClientes([]);
//                     setIsSuggestionListOpen(false);
//                   }
//                 }}
//                 onKeyDown={handleKeyDown}
//                 onFocus={() => clientes.length > 0 && setIsSuggestionListOpen(true)}
//                 onBlur={() => setTimeout(() => setIsSuggestionListOpen(false), 200)}
//                 placeholder="Buscar cliente..."
//               />
//               {isSuggestionListOpen && clientes.length > 0 && (
//                 <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-400 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                   {clientes.map((cli, index) => (
//                     <li
//                       key={cli.id_cliente}
//                       className={`p-2 cursor-pointer text-sm ${
//                         index === activeSuggestionIndex
//                           ? 'bg-blue-100'
//                           : 'hover:bg-gray-100'
//                       }`}
//                       onClick={() => seleccionarCliente(cli)}
//                       onMouseEnter={() => setActiveSuggestionIndex(index)}
//                     >
//                       {cli.nombre} - {cli.telefono || cli.correo || 'Sin contacto'}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <label className="text-gray-700 w-32 md:w-20">Contacto</label>
//             <input
//               type="text"
//               className="flex-1 p-2 border border-gray-400 rounded-md text-sm"
//               value={contacto}
//               onChange={(e) => setContacto(e.target.value)}
//               placeholder="Se autocompletará al seleccionar cliente"
//             />
//           </div>
//         </div>

//         <div className="w-full md:w-1/2 flex justify-end items-start mt-2 md:mt-0">
//           <div className="flex items-center gap-2 w-full md:w-auto">
//             <label className="text-gray-700 w-32 md:w-20">Fecha</label>
//             <input
//               type="date"
//               className="flex-1 p-2 border border-gray-400 rounded-md text-sm"
//               value={fecha}
//               onChange={(e) => setFecha(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mb-4 overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200 text-sm">
//               <th className="p-2 text-left w-8">#</th>
//               <th className="p-2 text-left w-24">Código</th>
//               <th className="p-2 text-left">Producto</th>
//               <th className="p-2 text-left w-16">Cantidad</th>
//               <th className="p-2 text-left w-20">Precio</th>
//               <th className="p-2 text-left w-16">Desc.%</th>
//               <th className="p-2 text-left w-20">Total</th>
//               {/* <th className="p-2 text-left w-10">Eliminar</th> */}
//               <th className="p-2 text-left w-10">
//   <FaTrash className="text-red-500 w-5 h-5" />
// </th>

//             </tr>
//           </thead>
//           <tbody>
//             {productos.map((producto, index) => (
//               <tr key={index} className="border-b hover:bg-gray-50 text-sm">
//                 <td className="p-2">{index + 1}</td>
//                 <td className="p-2 relative">
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-400 rounded text-xs"
//                     value={producto.codigo}
//                     onChange={(e) => {
//                       actualizarProducto(index, "codigo", e.target.value);
//                       buscarProductos(e.target.value, index);
//                     }}
//                     onKeyDown={(e) => handleProductKeyDown(e, index)}
//                     onFocus={() => productosSugeridos[index]?.length > 0 && setMostrarSugProductos(prev => ({...prev, [index]: true}))}
//                     onBlur={() => setTimeout(() => setMostrarSugProductos(prev => ({...prev, [index]: false})), 200)}
//                     placeholder="Buscar producto..."
//                   />
//                   {mostrarSugProductos[index] && productosSugeridos[index]?.length > 0 && (
//                     <ul className="absolute z-10 w- mt-1 bg-white border border-gray-400 rounded-md shadow-lg max-h-96 overflow-y-auto">
//                       {productosSugeridos[index].map((prod, prodIndex) => (
//                         <li
//                           key={prod.id}
//                           className={`p-2 cursor-pointer text-xs ${
//                             activeProductIndex[index] === prodIndex
//                               ? 'bg-blue-100'
//                               : 'hover:bg-gray-100'
//                           }`}
//                           onClick={() => seleccionarProducto(prod, index)}
//                           onMouseEnter={() => setActiveProductIndex(prev => ({...prev, [index]: prodIndex}))}
//                         >
//                           <div className="flex justify-between">
//                             <span className="font-medium">{prod.codigo}</span>
//                             <span>${prod.precio_venta ? Number(prod.precio_venta).toFixed(2) : "0.00"}</span>
//                           </div>
//                           <div className="text-gray-600">{prod.nombre}</div>
//                           <div className="text-xs text-gray-500">
//                             Stock: {prod.stock} | {prod.unidad_medida}
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-400 rounded text-xs bg-gray-50"
//                     value={producto.nombre}
//                     readOnly
//                   />
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="number"
//                     min="1"
//                     max={producto.id_producto ? productosSugeridos[index]?.find(p => p.id === producto.id_producto)?.stock || 999 : 999}
//                     className="w-full p-2 border border-gray-400 rounded text-xs"
//                     value={producto.cantidad}
//                     onChange={(e) => {
//                       const maxStock = producto.id_producto
//                         ? productosSugeridos[index]?.find(p => p.id === producto.id_producto)?.stock || 999
//                         : 999;
//                       const value = Math.min(parseInt(e.target.value) || 1, maxStock);
//                       actualizarProducto(index, "cantidad", value);
//                     }}
//                   />
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="w-full p-2 border border-gray-400 rounded text-xs"
//                     value={producto.valorUnitario}
//                     onChange={(e) =>
//                       actualizarProducto(
//                         index,
//                         "valorUnitario",
//                         parseFloat(e.target.value) || 0
//                       )
//                     }
//                   />
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     className="w-full p-2 border border-gray-400 rounded text-xs"
//                     value={producto.descuento}
//                     onChange={(e) =>
//                       actualizarProducto(
//                         index,
//                         "descuento",
//                         parseFloat(e.target.value) || 0
//                       )
//                     }
//                   />
//                 </td>
//                 <td className="p-2 text-right pr-2">
//                   ${calcularTotalProducto(producto).toFixed(2)}
//                 </td>
//                 <td className="p-2 text-center">
//                   {productos.length > 1 && (
//                     <button
//                       onClick={() => eliminarProducto(index)}
//                       className="text-red-500 hover:text-red-700 text-lg font-bold"
//                       title="Eliminar producto"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button
//           onClick={agregarProducto}
//           className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Agregar producto
//         </button>
//       </div>

//       <div className="mb-4">
//         <h2 className="text-sm font-semibold mb-2">Formas de pago</h2>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <select
//             className="p-2 border border-gray-400 rounded-md flex-grow text-sm"
//             value={formaPago}
//             onChange={(e) => setFormaPago(e.target.value)}
//           >
//             <option value="">Seleccione forma de pago</option>
//             <option value="efectivo">Efectivo</option>
//             <option value="tarjeta">Tarjeta</option>
//             <option value="transferencia">Transferencia</option>
//           </select>
//           {formaPago === "efectivo" && (
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 className="p-2 border border-gray-400 rounded-md w-32 text-sm"
//                 placeholder="0.00"
//                 value={inputValue}
//                 onChange={handleMontoChange}
//                 onBlur={handleBlur}
//                 onFocus={(e) => {
//                   if (e.target.value === '0.00') {
//                     e.target.select();
//                   }
//                 }}
//               />
//               <div className="p-2 text-sm text-gray-600">
//                 Devuelta: ${devuelta.toFixed(2)}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <div className="w-full md:w-1/3 space-y-2 bg-gray-50 p-4 rounded-md">
//           <div className="flex justify-between font-semibold">
//             <span>Subtotal:</span>
//             <span>${totalNeto.toFixed(2)}</span>
//           </div>
//           {formaPago === "efectivo" && (
//             <>
//               <div className="flex justify-between font-semibold">
//                 <span>Recibe:</span>
//                 <span>${montoRecibido.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg border-t pt-2">
//                 <span>Devuelta:</span>
//                 <span>${devuelta.toFixed(2)}</span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-end mt-6">
//         <button
//           onClick={guardarFactura}
//           className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium flex items-center gap-2"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//           Generar venta
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Facturar;
