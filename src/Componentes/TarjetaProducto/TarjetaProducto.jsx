import React from 'react';
import { NavLink } from 'react-router-dom';

// Componente base para las tarjetas de producto
const TarjetaProducto = ({ producto }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl transition-all hover:scale-105 duration-300 transform border border-gray-100 flex flex-col items-center text-center p-6 md:p-8">
            <img
                src={producto.imagenSrc}
                alt={producto.nombre}
                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full mb-4 shadow-md"
            />
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
            <p className="text-gray-600 text-sm md:text-base mb-4">{producto.descripcion}</p>
            <NavLink
                to={`/catalogo/${producto.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
            >
                Ver Producto
            </NavLink>
        </div>
    );
};

export default TarjetaProducto;
