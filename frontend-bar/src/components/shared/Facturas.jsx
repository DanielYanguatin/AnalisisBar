import React, { useState, useEffect } from "react";
import { FiPrinter, FiX, FiChevronLeft } from "react-icons/fi";
import axios from "axios";

const Facturas = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener lista de facturas al cargar el componente
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/ventas");
        // Obtener nombres de clientes para cada factura
        const invoicesWithClients = await Promise.all(
          response.data.map(async (invoice) => {
            try {
              const detalleResponse = await axios.get(`http://localhost:5000/detalle-venta/completo/${invoice.id_venta}`);
              return {
                ...invoice,
                cliente_nombre: detalleResponse.data.venta.cliente.nombre
              };
            } catch (err) {
              console.error("Error obteniendo detalle de venta:", err);
              return {
                ...invoice,
                cliente_nombre: "Cliente no disponible"
              };
            }
          })
        );
        setInvoices(invoicesWithClients);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las facturas");
        setLoading(false);
        console.error("Error fetching invoices:", err);
      }
    };

    fetchInvoices();
  }, []);

  // Obtener detalles completos de una factura
  const fetchInvoiceDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/detalle-venta/completo/${id}`);
      setSelectedInvoice(transformInvoiceData(response.data));
      setLoading(false);
    } catch (err) {
      setError("Error al cargar el detalle de la factura");
      setLoading(false);
      console.error("Error fetching invoice details:", err);
    }
  };

  // Formatear fecha y hora
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Transformar los datos del backend al formato esperado por el frontend
  const transformInvoiceData = (apiData) => {
    // Consolidar pagos para evitar duplicados
    const uniquePayments = [];
    const paymentTypes = new Set();
    
    apiData.pagos.forEach(payment => {
      if (!paymentTypes.has(payment.tipo_pago)) {
        paymentTypes.add(payment.tipo_pago);
        uniquePayments.push(payment);
      }
    });

    return {
      id: apiData.venta.id_venta,
      date: formatDateTime(apiData.venta.fecha),
      client: {
        id: apiData.venta.id_cliente,
        name: apiData.venta.cliente.nombre,
        phone: apiData.venta.cliente.telefono,
        address: apiData.venta.cliente.direccion,
        email: apiData.venta.cliente.correo
      },
      user: apiData.venta.id_usuario,
      total: apiData.venta.total,
      status: apiData.venta.estado,
      items: apiData.detalles.map(item => ({
        id: item.id_detalle_venta,
        name: item.producto,
        quantity: item.cantidad,
        price: item.precio_unitario,
        discount: item.descuento,
        subtotal: item.subtotal
      })),
      payments: uniquePayments
    };
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !selectedInvoice) {
    return <div className="p-4 text-center">Cargando facturas...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gray-00 p-4 rounded-lg shadow-2xl">
      {selectedInvoice ? (
        // Vista de detalle de factura
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiChevronLeft className="mr-1" /> Volver
            </button>
            <h2 className="text-2xl font-bold text-center">Detalle de Factura</h2>
            <div className="w-24"></div>
          </div>
          
          {/* Información de la factura */}
          <div className="mb-8">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Factura #{selectedInvoice.id}</h3>
                <p className="text-gray-600">Fecha: {selectedInvoice.date}</p>
                <p className="text-gray-600">Estado: {selectedInvoice.status}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg">{selectedInvoice.client.name}</h3>
                <p className="text-gray-600">{selectedInvoice.client.phone}</p>
                <p className="text-gray-600">{selectedInvoice.client.address}</p>
                <p className="text-gray-600">{selectedInvoice.client.email}</p>
              </div>
            </div>
            
            {/* Detalles de productos */}
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <h4 className="font-semibold mb-3">Productos</h4>
              <div className="grid grid-cols-12 gap-2 font-semibold mb-2">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-right">Cantidad</div>
                <div className="col-span-2 text-right">P. Unitario</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              
              {selectedInvoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100">
                  <div className="col-span-6">{item.name}</div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-right">${(parseFloat(item.price)).toFixed(2)}</div>
                  <div className="col-span-2 text-right">${(parseFloat(item.subtotal)).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Sección de pagos */}
            {selectedInvoice.payments.length > 0 && (
              <div className="border-t border-b border-gray-200 py-4 my-4">
                <h4 className="font-semibold mb-3">Métodos de Pago</h4>
                {selectedInvoice.payments.map((payment, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <div className="capitalize">{payment.tipo_pago.toLowerCase()}</div>
                    <div>${(parseFloat(payment.monto)).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Total */}
            <div className="flex justify-end mt-6">
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: <span className="text-blue-500">
                    ${Number(selectedInvoice.total || 0).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              <FiX className="mr-2" /> Volver
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              <FiPrinter className="mr-2" /> Imprimir
            </button>
          </div>
        </div>
      ) : (
        // Vista de listado de facturas
        <>
          <h2 className="text-2xl font-bold mb-6 text-blue-500">Historial de Facturas</h2>
          
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay facturas registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-blue-400 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">N° Factura</th>
                    <th className="py-3 px-4 text-left">Fecha y Hora</th>
                    <th className="py-3 px-4 text-left">Cliente</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr 
                      key={invoice.id_venta} 
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">FAC-{invoice.id_venta.toString().padStart(3, '0')}</td>
                      <td className="py-3 px-4">{formatDateTime(invoice.fecha)}</td>
                      <td className="py-3 px-4">{invoice.cliente_nombre || `Cliente #${invoice.id_cliente}`}</td>
                      <td className="py-3 px-4 text-right">${(parseFloat(invoice.total)).toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          invoice.estado === 'completada' ? 'bg-green-100 text-green-800' :
                          invoice.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchInvoiceDetails(invoice.id_venta);
                          }}
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Facturas;