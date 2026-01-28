import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiList, FiFileText, FiPrinter, FiSave } from 'react-icons/fi';

const CerrarCaja = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [observaciones, setObservaciones] = useState('');
  const [cajaData, setCajaData] = useState({
    totalVentas: 0,
    metodosPago: [],
    efectivoInicial: 0,
    efectivoFinal: 0
  });

  // Datos de ejemplo (en producción vendrían de una API)
  useEffect(() => {
    // Simular carga de datos
    const fetchData = async () => {
      // Aquí iría la llamada a la API
      setTimeout(() => {
        setCajaData({
          totalVentas: 1250000,
          efectivoInicial: 500000,
          efectivoFinal: 1750000,
          metodosPago: [
            { metodo: 'Efectivo', cantidad: 15, monto: 750000 },
            { metodo: 'Tarjeta', cantidad: 8, monto: 350000 },
            { metodo: 'Transferencia', cantidad: 5, monto: 150000 }
          ]
        });
      }, 500);
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el cierre de caja
    alert('Cierre de caja guardado exitosamente');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
        <FiDollarSign className="mr-2" /> Cierre de Caja
      </h1>

      {/* Pestañas */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium flex items-center ${activeTab === 'resumen' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('resumen')}
        >
          <FiList className="mr-2" /> Resumen del Día
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center ${activeTab === 'metodos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('metodos')}
        >
          <FiDollarSign className="mr-2" /> Métodos de Pago
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center ${activeTab === 'cierre' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('cierre')}
        >
          <FiFileText className="mr-2" /> Registrar Cierre
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'resumen' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Resumen del Día</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Efectivo Inicial</h3>
                <p className="text-2xl font-bold">${cajaData.efectivoInicial.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Total Ventas</h3>
                <p className="text-2xl font-bold">${cajaData.totalVentas.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Efectivo Final</h3>
                <p className="text-2xl font-bold">${cajaData.efectivoFinal.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Diferencia</h3>
              <p className="text-2xl font-bold">
                ${(cajaData.efectivoFinal - cajaData.efectivoInicial - cajaData.metodosPago.find(m => m.metodo === 'Efectivo')?.monto || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'metodos' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Detalle por Método de Pago</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Método</th>
                    <th className="py-2 px-4 text-right">Transacciones</th>
                    <th className="py-2 px-4 text-right">Monto Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cajaData.metodosPago.map((metodo, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{metodo.metodo}</td>
                      <td className="py-2 px-4 text-right">{metodo.cantidad}</td>
                      <td className="py-2 px-4 text-right">${metodo.monto.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cierre' && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Registro de Cierre</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-medium mb-2">Efectivo Inicial</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={cajaData.efectivoInicial}
                  readOnly
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Efectivo Final</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={cajaData.efectivoFinal}
                  onChange={(e) => setCajaData({...cajaData, efectivoFinal: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">Observaciones</label>
              <textarea
                className="w-full p-2 border rounded h-24"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ingrese observaciones relevantes sobre el cierre..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                <FiPrinter className="mr-2" /> Imprimir Reporte
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FiSave className="mr-2" /> Guardar Cierre
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CerrarCaja;