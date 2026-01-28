/* Card.jsx */
import React from "react";

const Card = ({ img, description, price, inventory, onClick }) => (
  <div
    onClick={onClick}
    className="bg-blue-500 p-2 rounded-xl flex flex-col items-center gap-2 text-center text-gray-300 cursor-pointer hover:scale-105 transition-all"
  >
    {/* <img
      src={img}
      className="w-40 h-40 object-cover shadow-2xl rounded-2xl"
      alt={description}
    /> */}
    <p className="text-sm bg-blue-500 text-black">{description}</p>
    <b><span className="text-sm text-[#00FF00]">${price}</span></b>
    {/* <p className="text-sm text-gray-600">{inventory} en Stock</p> */}
  </div>
);

export default Card;
