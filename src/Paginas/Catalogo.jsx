import React from 'react';
// Importamos los datos de los productos que creaste.
import { productos } from '../Datos/productos';

// Componente para las tarjetas de producto en el catálogo
const TarjetaProducto = ({ producto }) => (
  <div className="bg-white rounded-2xl shadow-xl transition-all hover:scale-105 duration-300 transform border border-gray-100 flex flex-col items-center text-center p-6 md:p-8">
    <img src={producto.imagenSrc} alt={producto.nombre} className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full mb-4 shadow-md" />
    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
    <p className="text-gray-600 text-sm md:text-base mb-4">{producto.descripcion}</p>
    <a href={`/catalogo/${producto.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
      Ver Producto
    </a>
  </div>
);

// Componente principal del Catálogo
const Catalogo = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-800 mb-12">
        Catálogo Completo
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Usamos el método 'map' para iterar sobre la lista de productos
            y crear una tarjeta para cada uno. */}
        {productos.map(producto => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
