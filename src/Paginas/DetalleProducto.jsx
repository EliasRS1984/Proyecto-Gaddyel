import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
// Asegúrate de que la ruta de importación de productos es la correcta
import { productos } from '../Datos/productos';
import CarruselVertical from '../Componentes/UI/Carrusel/CarruselVertical';

const DetalleProducto = () => {
    // Usamos useParams para obtener el ID del producto de la URL
    const { id } = useParams();
    // Buscamos el producto correspondiente en el array de productos.
    // **CORRECCIÓN CLAVE:** Hemos eliminado parseInt() para que la comparación sea entre strings.
    const producto = productos.find(p => p.id === id);

    // Si el producto no se encuentra, mostramos un mensaje de error
    if (!producto) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-red-600 mb-4">Producto No Encontrado</h1>
                <p className="text-lg text-gray-700 mb-8">El producto que buscas no está disponible.</p>
                <NavLink to="/catalogo" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300">
                    Volver al Catálogo
                </NavLink>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 flex flex-col lg:flex-row items-start gap-8 min-h-screen">
            {/* Carrusel Vertical en el lado izquierdo */}
            <div className="lg:w-1/2 w-full lg:sticky lg:top-24">
                <CarruselVertical imagenes={producto.imagenes} />
            </div>

            {/* Contenido del producto en el lado derecho */}
            <div className="lg:w-1/2 w-full p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
                <p className="text-gray-600 text-lg mb-6">{producto.descripcionCompleta}</p>

                {/* Sección de detalles adicionales */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Características Principales</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Material: {producto.material}</li>
                        <li>Tamaño: {producto.tamanos.join(', ')}</li>
                        <li>Colores disponibles: {producto.colores.join(', ')}</li>
                    </ul>
                </div>

                {/* Sección de personalización */}
                {producto.personalizable && (
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 mb-6">
                        <p className="font-semibold text-yellow-800">
                            ✨ ¡Este producto es personalizable! Contáctanos para discutir los detalles de tu diseño.
                        </p>
                    </div>
                )}
                
                <p className="text-4xl font-extrabold text-indigo-700 my-6">${producto.precio}</p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                        Añadir al Carrito
                    </button>
                    <NavLink to="/contacto" className="text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                        Personalizar
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;