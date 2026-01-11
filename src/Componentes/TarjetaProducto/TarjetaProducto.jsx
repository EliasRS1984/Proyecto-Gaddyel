import React from 'react';
import { NavLink } from 'react-router-dom';
import ImageOptimizer from '../ImageOptimizer.jsx';

/**
 * TarjetaProducto - Componente uniforme con estilo ecommerce
 * 
 * FLUJO:
 * - Imagen cuadrada (aspect-ratio 1:1) completa sin desbordar
 * - Todas las tarjetas mismo tamaño (flex h-full)
 * - Botón estilo consistente con página
 * - Precio opcional (controlado por prop showPrice)
 * 
 * @prop {Object} producto - Datos del producto
 * @prop {Boolean} showPrice - Mostrar precio (default: true)
 */
const TarjetaProducto = React.memo(({ producto, showPrice = true }) => (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
        {/* IMAGEN - Contenedor cuadrado aspect-ratio */}
        <div className="w-full aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
            <ImageOptimizer
                src={producto.imagenSrc}
                alt={producto.nombre}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>

        {/* CONTENIDO - Flex column para alinear botón abajo */}
        <div className="flex flex-col flex-grow p-5">
            {/* TÍTULO */}
            <NavLink
                to={`/catalogo/${producto._id}`}
                className="block mb-2 hover:text-blue-600 transition-colors"
                aria-label={`Ver detalles de ${producto.nombre}`}
            >
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {producto.nombre}
                </h3>
            </NavLink>

            {/* DESCRIPCIÓN */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                {producto.descripcion}
            </p>

            {/* PRECIO Y BOTÓN */}
            <div className="space-y-3">
                {/* PRECIO - Solo si showPrice es true */}
                {showPrice && producto.precio && (
                    <div className="text-xl font-bold text-gray-900">
                        ${producto.precio.toLocaleString('es-AR')}
                    </div>
                )}

                {/* BOTÓN - Estilo consistente con página */}
                <NavLink
                    to={`/catalogo/${producto._id}`}
                    className="block w-full bg-purple-500 hover:bg-purple-600 text-black hover:text-white py-2.5 px-4 btn"
                    aria-label={`Ver detalles de ${producto.nombre}`}
                >
                    Ver Detalles
                </NavLink>
            </div>
        </div>
    </div>
));

TarjetaProducto.displayName = 'TarjetaProducto';

export default TarjetaProducto;
