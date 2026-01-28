import React from "react";
import { RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";
const CartItem = ({ 
  item, 
  onRemove, 
  onUpdateQuantity,
  onUpdateNote 
}) => {
  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    
    // Validar contra el stock máximo
    if (item.maxStock && newQuantity > item.maxStock) {
      alert(`No puedes agregar más de ${item.maxStock} unidades. Stock insuficiente.`);
      return;
    }
    
    onUpdateQuantity(newQuantity);
  };

  return (
    <div className="bg-white p-4 rounded-xl mb-4">
      {/* ... resto del código ... */}
      <input
        type="number"
        min="1"
        max={item.maxStock || ''} // Establece el máximo según stock
        value={item.quantity}
        onChange={handleQuantityChange}
        className="w-12 text-center border rounded"
      />
      {/* ... resto del código ... */}
    </div>
  );
};

const Cart = ({ 
  showCart, 
  setShowCart, 
  cartItems, 
  onRemoveItem,
  onUpdateQuantity,
  onUpdateNote
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div
      className={`lg:col-span-2 fixed top-0 bg-blue-500 w-full lg:w-96 lg:right-0 h-full transition-all z-50 ${
        showCart ? "right-0" : "-right-full"
      }`}
    >
      <div className="relative pt-16 lg:pt-2 text-gray-300 p-2 h-full">
        <RiCloseLine
          onClick={() => setShowCart(false)}
          className="lg:hidden absolute left-2 top-2 p-3 box-content text-gray-300 bg-white rounded-full text-xl"
        />
        <h1 className="text-2xl my-2">Pedidos #151416</h1>
        
        <div className="flex items-center gap-4 flex-wrap mb-8">
          <button className="bg-white text-black py-2 px-4 rounded-xl">
            Comer aquí
          </button>
          <button className="text-black py-2 px-4 rounded-xl border border-white bg-white">
            Para llevar
          </button>
          <button className="text-black py-2 px-4 rounded-xl border border-white bg-white">
            Entrega
          </button>
        </div>
        
        <div className="h-[400px] md:h-[700px] lg:h-[540px] overflow-y-auto">
          <div className="grid grid-cols-6 mb-4 p-4">
            <h5 className="col-span-4">Producto</h5>
            <h5>Cant</h5>
            <h5>Total</h5>
          </div>
          
          {cartItems.length === 0 ? (
            <p className="text-center text-white py-8">El carrito está vacío</p>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => onRemoveItem(item.id)}
                onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
                onUpdateNote={(note) => onUpdateNote(item.id, note)}
              />
            ))
          )}
        </div>
        
        <div className="bg-blue-500 absolute w-full bottom-0 left-0 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white">Subtotal</span>
            <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <button 
            className="bg-white text-black w-full py-2 px-4 rounded-lg font-bold hover:bg-gray-100 transition"
            disabled={cartItems.length === 0}
          >
            Continuar con el pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
