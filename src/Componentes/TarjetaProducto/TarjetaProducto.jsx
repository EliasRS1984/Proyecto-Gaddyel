import React from 'react';
import { NavLink } from 'react-router-dom';
import ImageOptimizer from '../ImageOptimizer.jsx';
import { formatPriceWithSymbol } from '../../utils/formatPrice.js';

// ============================================================
// ¿QUÉ ES ESTO?
//   Tarjeta de producto que aparece en el catálogo y en la página
//   de inicio. Cada tarjeta muestra imagen, nombre, descripción,
//   precio y un botón para ver los detalles del producto.
//
// ¿CÓMO FUNCIONA?
//   1. Recibe los datos del producto desde Catalogo.jsx o Inicio.jsx
//   2. Renderiza con microdata Schema.org (Google puede leer el precio
//      y mostrarlo directamente en los resultados de búsqueda)
//   3. Click en imagen o título → /catalogo/:id
//   4. Click en "Ver detalles" → misma ruta
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
//   - Imagen no carga → revisar ImageOptimizer y producto.imagenSrc
//   - Precio incorrecto → revisar formatPriceWithSymbol en utils/formatPrice
//   - Card no navega → revisar productUrl y _id del producto
// ============================================================

/**
 * Tarjeta de producto memoizada — no se re-renderiza si las props no cambian.
 * Optimización necesaria porque el catálogo puede mostrar 50+ tarjetas simultáneas.
 *
 * @param {Object}  producto   - Datos del producto (nombre, descripcion, precio, imagenSrc, _id)
 * @param {boolean} showPrice  - Si mostrar el precio (default: true)
 */
const TarjetaProducto = React.memo(({ producto, showPrice = true }) => {
    const altText = `${producto.nombre} personalizado con logo para centros de estética - Gaddyel`;
    const productUrl = `/catalogo/${producto._id}`;

    return (
        // Schema.org Product — permite a Google mostrar precio y disponibilidad
        // en los resultados de búsqueda (Rich Snippets)
        <article
            className="group flex flex-col h-full
                bg-white/80 dark:bg-slate-900/80
                backdrop-blur-xl
                border border-slate-200/50 dark:border-slate-800/50
                rounded-2xl overflow-hidden
                shadow-sm hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-950/60
                transition-all duration-500 ease-out
                hover:-translate-y-0.5"
            itemScope
            itemType="https://schema.org/Product"
        >
            {/* ── Imagen + Título — un único NavLink para ambos ── */}
            {/* Un solo link evita ruido de accesibilidad (3 links al mismo destino) */}
            <NavLink
                to={productUrl}
                aria-label={`Ver ${producto.nombre}`}
                className="flex flex-col flex-grow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-2xl"
            >
                {/* Imagen del producto */}
                <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                    <ImageOptimizer
                        src={producto.imagenSrc}
                        alt={altText}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                        crop="fill"
                        itemProp="image"
                    />
                </div>

                {/* Nombre del producto */}
                <div className="px-5 pt-5 pb-2">
                    <h2
                        className="text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-500 ease-out"
                        itemProp="name"
                    >
                        {producto.nombre}
                    </h2>
                </div>
            </NavLink>

            {/* ── Contenido inferior — descripción, precio y CTA ── */}
            <div className="flex flex-col px-5 pb-5 gap-4">
                {/* Descripción */}
                <p
                    className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed"
                    itemProp="description"
                >
                    {producto.descripcion}
                </p>

                {/* Precio + botón — apilados verticalmente para que el botón nunca se corte */}
                <div className="flex flex-col gap-3 mt-auto">
                    {/* Precio con microdata Offer — Google lo indexa */}
                    {showPrice && producto.precio && (
                        <div
                            itemProp="offers"
                            itemScope
                            itemType="https://schema.org/Offer"
                        >
                            <meta itemProp="priceCurrency" content="ARS" />
                            <link itemProp="availability" href="https://schema.org/InStock" />
                            <span
                                className="text-[18px] font-bold tracking-tight text-slate-800 dark:text-slate-100"
                                itemProp="price"
                                content={producto.precio}
                            >
                                {formatPriceWithSymbol(producto.precio)}
                            </span>
                        </div>
                    )}

                    {/* CTA — ancho completo para que nunca quede cortado */}
                    <NavLink
                        to={productUrl}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="w-full inline-flex items-center justify-center gap-1.5
                            px-4 py-2.5 rounded-2xl
                            bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                            text-white text-[13px] font-semibold tracking-tight
                            transition-all duration-500 ease-out"
                    >
                        Ver detalles
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </NavLink>
                </div>
            </div>
        </article>
    );
});

TarjetaProducto.displayName = 'TarjetaProducto';

export default TarjetaProducto;
