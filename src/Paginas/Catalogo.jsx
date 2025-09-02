import React from 'react';
import { NavLink } from 'react-router-dom';
import { productos } from '../Datos/productos';

const Catalogo = () => {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">Nuestro Catálogo Completo</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {productos.map(producto => (
                    <div key={producto.id} className="bg-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 flex flex-col items-center p-6 text-center">
                        {/* Enlace que envuelve la imagen y el nombre del producto */}
                        <NavLink to={`/catalogo/${producto.id}`} className="block w-full">
                            <img
                                src={producto.imagenSrc}
                                alt={producto.nombre}
                                className="w-full h-64 object-cover rounded-xl mb-4 shadow-md"
                            />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{producto.nombre}</h2>
                        </NavLink>
                        <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                        {/* Enlace para el botón "Ver Detalles" */}
                        <NavLink to={`/catalogo/${producto.id}`} className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                            Ver Detalles
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalogo;