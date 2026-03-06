import React from 'react';
import { NavLink } from 'react-router-dom';
import ImageOptimizer from '../ImageOptimizer.jsx';

/**
 * TarjetaProducto - Tarjeta de producto para catálogo con SEO optimizado
 * 
 * FLUJO DE DATOS:
 * 1. Recibe objeto producto desde Catalogo.jsx o Inicio.jsx
 * 2. Renderiza con microdata Schema.org para Rich Snippets en Google
 * 3. Usuario hace click → navega a /catalogo/:id
 * 
 * OPTIMIZACIONES:
 * - React.memo: Evita re-renders si props no cambian
 * - Schema.org Product: Google puede mostrar precio/disponibilidad en resultados
 * - Un solo NavLink envolvente: Mejor UX, menos código
 * - ImageOptimizer: Lazy loading + transformaciones Cloudinary
 * 
 * @param {Object} producto - Datos del producto (nombre, descripcion, precio, imagenSrc, _id)
 * @param {Boolean} showPrice - Mostrar precio (default: true)
 */
const TarjetaProducto = React.memo(({ producto, showPrice = true }) => {
    const altText = `${producto.nombre} personalizado con logo para centros de estética - Gaddyel`;
    const productUrl = `/catalogo/${producto._id}`;
    
    return (
        // Schema.org Product microdata para SEO - Google Rich Snippets
        <article 
            className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
            itemScope 
            itemType="https://schema.org/Product"
        >
            {/* IMAGEN - Clickeable, con microdata */}
            <NavLink 
                to={productUrl}
                className="w-full aspect-square bg-gray-100 overflow-hidden flex items-center justify-center"
                aria-label={`Ver ${producto.nombre}`}
            >
                <ImageOptimizer
                    src={producto.imagenSrc}
                    alt={altText}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    itemProp="image"
                />
            </NavLink>

            {/* CONTENIDO */}
            <div className="flex flex-col flex-grow p-5">
                {/* TÍTULO con microdata */}
                <NavLink
                    to={productUrl}
                    className="block mb-2 hover:text-purple-600 transition-colors"
                >
                    <h2 
                        className="text-lg font-semibold text-gray-800 line-clamp-2"
                        itemProp="name"
                    >
                        {producto.nombre}
                    </h2>
                </NavLink>

                {/* DESCRIPCIÓN con microdata */}
                <p 
                    className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow"
                    itemProp="description"
                >
                    {producto.descripcion}
                </p>

                {/* PRECIO Y BOTÓN */}
                <div className="space-y-3">
                    {/* PRECIO con microdata Offer */}
                    {showPrice && producto.precio && (
                        <div 
                            className="text-xl font-bold text-gray-900"
                            itemProp="offers" 
                            itemScope 
                            itemType="https://schema.org/Offer"
                        >
                            <meta itemProp="priceCurrency" content="ARS" />
                            <span itemProp="price" content={producto.precio}>
                                ${producto.precio.toLocaleString('es-AR')}
                            </span>
                            <link itemProp="availability" href="https://schema.org/InStock" />
                        </div>
                    )}

                    {/* BOTÓN CTA */}
                    <NavLink
                        to={productUrl}
                        className="relative inline-flex items-center justify-center w-full p-0.5 overflow-hidden text-sm font-medium text-gray-800 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
                    >
                        <span className="relative w-full px-4 py-2.5 transition-all ease-in duration-200 bg-white rounded-md group-hover:bg-transparent text-center">
                            Ver Detalles
                        </span>
                    </NavLink>
                </div>
            </div>
        </article>
    );
});

TarjetaProducto.displayName = 'TarjetaProducto';

export default TarjetaProducto;
