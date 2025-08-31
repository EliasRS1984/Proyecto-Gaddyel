import React from 'react';

// Importamos la función para obtener el ID de la URL
import { useParams } from 'react-router-dom';

// Importamos los datos de nuestros productos
import { productos } from '../Datos/productos.js';

const Producto = () => {
    // Usamos 'useParams' para obtener el 'id' del producto de la URL
    const { id } = useParams();

    // Buscamos el producto en nuestro array de datos
    // 'find' es el método perfecto para encontrar el primer elemento que cumpla una condición
    const producto = productos.find(p => p.id === id);

    // Si no se encuentra el producto, mostramos un mensaje de error
    if (!producto) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gray-100">
                <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
                    Producto No Encontrado
                </h1>
                <p className="text-lg md:text-xl text-gray-700">
                    Lo sentimos, el producto que buscas no está disponible.
                </p>
                <a href="/catalogo" className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                    Volver al Catálogo
                </a>
            </div>
        );
    }

    // Si se encuentra el producto, renderizamos la información
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Sección de la Imagen del Producto */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src={producto.imagenSrc}
                        alt={producto.nombre}
                        className="w-full max-w-sm rounded-3xl shadow-2xl transition-transform transform hover:scale-105 duration-300"
                    />
                </div>

                {/* Sección de la Información del Producto */}
                <div className="w-full md:w-1/2 flex flex-col justify-start text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-6">{producto.descripcion}</p>

                    {/* Aquí puedes agregar más detalles como el precio, variantes, etc. */}
                    {/* Por ahora, dejemos el formulario de contacto para el siguiente paso */}

                    {/* Botón de Contacto */}
                    <a href="/contacto" className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300 self-center md:self-start">
                        Pedir Personalización
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Producto;
