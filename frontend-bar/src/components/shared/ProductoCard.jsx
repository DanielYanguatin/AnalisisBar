import React from "react";
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
      onClick={onAddToCart}
    >
      <h3 className="font-medium text-center">{product.nombre}</h3>

      {/* Mostrar más información si está disponible */}
      {product.detalle && (
        <p className="text-xs text-gray-600 text-center mt-0">
          {product.detalle}
        </p>
      )}
      <p className="text-blue-500 text-center font-bold mt-2">
        ${parseFloat(product.precio_venta).toFixed(2)}
      </p>

      {product.stock !== null && (
        <p
          className={`text-xs text-center mt-1 ${
            product.stock <= 0
              ? "text-red-500"
              : product.stock < 10
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          Stock: {product.stock} {product.unidad_medida.toLowerCase()}
        </p>
      )}

      {/* {product.ean_13 && (
        <p className="text-xs text-gray-400 text-center mt-1">
          EAN-13: {product.ean_13}
        </p>
      )} */}
    </div>
  );
};
export default ProductCard;
