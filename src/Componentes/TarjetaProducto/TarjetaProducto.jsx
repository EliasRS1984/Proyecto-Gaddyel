import React from 'react';
import { NavLink } from 'react-router-dom';

const TarjetaProducto = React.memo(({ producto, fixedHeight = false }) => (
    <div className={`bg-white rounded-2x1 shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 flex flex-col items-center p-4 text-center ${fixedHeight ? 'h-96' : ''}`}>
        <img
            src={producto.imagenSrc}
            alt={producto.nombre}
            className={`${
                fixedHeight ? 'w-46 h-46 rounded-full' : 'w-full h-84 rounded-xl'
            } object-cover mb-4 shadow-md`} // Cambio: Imagen fuera del NavLink, centrada por el contenedor
        />
        <NavLink
            to={`/catalogo/${producto.id}`}
            className="block"
            aria-label={`Ver detalles de ${producto.nombre}`}
        >
            {fixedHeight ? (
                <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
            ) : (
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{producto.nombre}</h2>
            )}
        </NavLink>
        <p className={`text-gray-600 mb-4 line-clamp-3 overflow-hidden text-center ${fixedHeight ? 'text-sm' : ''}`}>
            {producto.descripcion}
        </p> {/* Cambio: text-center explícito */}
        <NavLink
            to={`/catalogo/${producto.id}`}
            className={`mt-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 ${
                fixedHeight ? 'px-4' : 'px-6'
            } rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300 text-center`} // Cambio: text-center explícito
            aria-label={`Ver detalles de ${producto.nombre}`}
        >
            {fixedHeight ? 'Ver Producto' : 'Ver Detalles'}
        </NavLink>
    </div>
));

export default TarjetaProducto;