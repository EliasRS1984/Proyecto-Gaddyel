import React, { useMemo } from 'react';
import { useCart } from '../Context/CartContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { useShippingConfig } from '../hooks/useShippingConfig';

/**
 * Componente Carrito - Muestra items del carrito con opciones para modificar
 */
export const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, total, isEmpty } = useCart();

    // Obtiene la regla de envío gratis desde el servidor.
    // Si el admin cambia el valor en el panel, el carrito se actualiza automáticamente.
    // ¿Banner de envío gratis no coincide con el FAQ? Revisá useShippingConfig.js
    const { cantidadMinima, costoEnvio: costoEnvioBase } = useShippingConfig();

    // ======== CÁLCULO DE ENVÍO ========
    // IMPORTANTE: este useMemo debe estar ANTES del early return de carrito vacío.
    // Los hooks de React deben ejecutarse en el mismo orden en cada render.
    // Si se pusiera después del `if (isEmpty) return`, React lanzaría un error
    // al pasar de carrito vacío a carrito con productos (orden de hooks cambia).
    // ¿El envío gratis no se activa? Revisá la condición cantidadSolicitudes >= cantidadMinima
    const shippingInfo = useMemo(() => {
        const cantidadSolicitudes = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
        const envioGratis = cantidadSolicitudes >= cantidadMinima;
        const costoEnvio = envioGratis ? 0 : costoEnvioBase;
        const totalConEnvio = total + costoEnvio;
        const productosRestantes = envioGratis ? 0 : cantidadMinima - cantidadSolicitudes;
        return { cantidadSolicitudes, envioGratis, costoEnvio, totalConEnvio, productosRestantes };
    }, [cartItems, total, cantidadMinima, costoEnvioBase]);

    // ======== CARRITO VACÍO ========
    // Cuando el usuario no tiene productos seleccionados, se muestra esta pantalla
    // ¿No aparece? Revisá isEmpty en CartContext
    if (isEmpty) {
        return (
            <div className="min-h-[72vh] flex items-center justify-center px-6 py-24">
                <div className="max-w-md w-full text-center">

                    {/* ---- Etiqueta de sección ---- */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 mb-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400">
                            Tu Selección · Textiles B2B
                        </span>
                    </div>

                    {/* ---- Icono principal: bolsa vacía ---- */}
                    <div className="w-24 h-24 mx-auto mb-10 flex items-center justify-center
                        rounded-2xl bg-slate-100 dark:bg-slate-800
                        border border-slate-200/50 dark:border-slate-700/50
                        ring-2 ring-slate-200 dark:ring-slate-700 ring-offset-4
                        ring-offset-white dark:ring-offset-slate-950">
                        <svg
                            className="w-11 h-11 text-slate-400 dark:text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>

                    {/* ---- Título y descripción ---- */}
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-4">
                        Tu carrito está vacío
                    </h2>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-sm mx-auto">
                        Todavía no seleccionaste ningún producto. Explorá nuestro catálogo de blanquería personalizada y armá tu pedido.
                    </p>

                    {/* ---- Acciones disponibles ---- */}
                    {/* Dos opciones: explorar catálogo (principal) o pedir presupuesto directo */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/catalogo"
                            className="inline-flex items-center justify-center gap-2
                                px-8 py-3.5 rounded-2xl
                                bg-indigo-600 hover:bg-indigo-700
                                text-white text-[14px] font-semibold tracking-tight
                                transition-all duration-500 ease-out
                                hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5"
                        >
                            {/* Icono de lista/catálogo */}
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                            </svg>
                            Explorar catálogo
                        </Link>
                        <Link
                            to="/contacto"
                            className="inline-flex items-center justify-center gap-2
                                px-8 py-3.5 rounded-2xl
                                bg-white dark:bg-slate-900
                                border border-slate-200/80 dark:border-slate-700/80
                                text-slate-700 dark:text-slate-300
                                text-[14px] font-semibold tracking-tight
                                transition-all duration-500 ease-out
                                hover:border-indigo-300 dark:hover:border-indigo-500
                                hover:shadow-md hover:-translate-y-0.5"
                        >
                            Solicitar presupuesto
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ======== CARRITO CON PRODUCTOS ========
    // Se muestra cuando el usuario tiene al menos un producto seleccionado
    // ¿Los precios no coinciden? Revisá formatPrice en utils/formatPrice
    // ¿El envío gratis no aparece? Revisá el cálculo de shippingInfo arriba
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-24">

            {/* ---- Encabezado de sección ---- */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                    bg-slate-100/80 dark:bg-slate-800/80
                    border border-slate-200/50 dark:border-slate-700/50 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400">
                        Tu Selección
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                        Mi Carrito
                    </h1>
                    {/* Contador de productos */}
                    <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500">
                        {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                    </span>
                </div>
            </div>

            {/* ---- Lista de productos ---- */}
            {/* Cada fila es un producto agregado al carrito */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                border border-slate-200/50 dark:border-slate-800/50
                rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40
                overflow-hidden mb-6">

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cartItems.map(item => (
                        <div
                            key={item._id}
                            className="flex flex-col gap-3 p-5 sm:p-6
                                transition-colors duration-500 ease-out
                                hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                        >
                            {/* ---- Fila superior: imagen + nombre/precio + eliminar ---- */}
                            {/* En mobile, imagen, texto y botón eliminar ocupan la primera fila */}
                            <div className="flex items-start gap-4">
                                {/* Imagen del producto */}
                                <div className="w-20 h-20 flex-shrink-0
                                    rounded-2xl overflow-hidden
                                    bg-slate-100 dark:bg-slate-800
                                    border border-slate-200/60 dark:border-slate-700/60">
                                    {item.imagenSrc ? (
                                        <img
                                            src={item.imagenSrc}
                                            alt={item.nombre}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        /* Placeholder cuando no hay imagen */
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Nombre y precio unitario */}
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold tracking-tight text-slate-800 dark:text-slate-100 truncate">
                                        {item.nombre}
                                    </h3>
                                    {item.cantidadUnidades && (() => {
                                        // Calcular una sola vez para evitar duplicar la operación en el JSX
                                        const totalUnidades = item.cantidadUnidades * item.cantidad;
                                        return (
                                            <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                {totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'}
                                            </p>
                                        );
                                    })()}
                                    <p className="text-[14px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                                        ${formatPrice(item.precio)} c/u
                                    </p>
                                </div>

                                {/* Botón eliminar — alineado arriba a la derecha */}
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="group flex-shrink-0 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-500 ease-out"
                                    aria-label="Eliminar producto"
                                    title="Eliminar"
                                >
                                    <svg
                                        className="w-5 h-5 text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* ---- Fila inferior: controles de cantidad + subtotal ---- */}
                            {/* Alineada debajo de la imagen (pl-24 = 80px imagen + 16px gap) */}
                            {/* ¿Los botones no responden? Revisá updateQuantity en CartContext */}
                            <div className="flex items-center justify-between pl-24">
                                {/* Control de cantidad: − número + */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                                        className="w-11 h-11 flex items-center justify-center
                                            bg-slate-100 dark:bg-slate-800
                                            hover:bg-slate-200 dark:hover:bg-slate-700
                                            border border-slate-200/60 dark:border-slate-700/60
                                            text-slate-600 dark:text-slate-400
                                            font-bold rounded-xl
                                            transition-all duration-500 ease-out
                                            disabled:opacity-40 disabled:cursor-not-allowed"
                                        disabled={item.cantidad <= 1}
                                        aria-label="Disminuir cantidad"
                                    >
                                        −
                                    </button>
                                    <span className="w-10 text-center font-semibold text-[15px] text-slate-800 dark:text-slate-100">
                                        {item.cantidad}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                                        className="w-11 h-11 flex items-center justify-center
                                            bg-slate-100 dark:bg-slate-800
                                            hover:bg-slate-200 dark:hover:bg-slate-700
                                            border border-slate-200/60 dark:border-slate-700/60
                                            text-slate-600 dark:text-slate-400
                                            font-bold rounded-xl
                                            transition-all duration-500 ease-out"
                                        aria-label="Aumentar cantidad"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Subtotal de este producto */}
                                <p className="font-bold tracking-tight text-slate-800 dark:text-slate-100">
                                    ${formatPrice(item.precio * item.cantidad)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---- Banner de envío ---- */}
            {/* Cambia de color según si ya aplica envío gratis o no */}
            {shippingInfo.envioGratis ? (
                <div className="flex items-center gap-4 px-6 py-4 mb-6
                    bg-green-50/80 dark:bg-green-950/20
                    border border-green-200/60 dark:border-green-700/30
                    rounded-2xl">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/40 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold tracking-tight text-green-800 dark:text-green-300">
                            ¡Envío gratis incluido!
                        </p>
                        <p className="text-[13px] text-green-700 dark:text-green-400">
                            Tu pedido califica con {shippingInfo.cantidadSolicitudes} {shippingInfo.cantidadSolicitudes === 1 ? 'producto' : 'productos'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 px-6 py-4 mb-6
                    bg-indigo-50/60 dark:bg-indigo-950/20
                    border border-indigo-200/50 dark:border-indigo-700/30
                    rounded-2xl">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold tracking-tight text-indigo-800 dark:text-indigo-300">
                            Faltan {shippingInfo.productosRestantes} {shippingInfo.productosRestantes === 1 ? 'producto' : 'productos'} para envío gratis
                        </p>
                        <p className="text-[13px] text-indigo-600 dark:text-indigo-400">
                            Agregá más artículos del catálogo y ahorrá en el envío
                        </p>
                    </div>
                </div>
            )}

            {/* ---- Panel de resumen y totales ---- */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                border border-slate-200/50 dark:border-slate-800/50
                rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 p-6 sm:p-8">

                {/* Desglose de costos */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[15px] text-slate-600 dark:text-slate-400">
                        <span>Subtotal</span>
                        <span>${formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-[15px] text-slate-600 dark:text-slate-400">
                        <span>Envío</span>
                        <span className={shippingInfo.envioGratis
                            ? 'text-green-600 dark:text-green-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400'}>
                            {shippingInfo.envioGratis ? 'Gratis' : `$${formatPrice(shippingInfo.costoEnvio)}`}
                        </span>
                    </div>
                    {/* Línea separadora */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-[17px] font-bold tracking-tight text-slate-800 dark:text-slate-100">Total</span>
                            <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                                ${formatPrice(shippingInfo.totalConEnvio)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                {/* "Seguir comprando" lleva al catálogo, "Ir a pagar" avanza al checkout */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link
                        to="/catalogo"
                        className="inline-flex items-center justify-center gap-2
                            px-6 py-3.5 rounded-2xl flex-1
                            bg-slate-100 dark:bg-slate-800
                            border border-slate-200 dark:border-slate-700
                            text-slate-600 dark:text-slate-300
                            text-[14px] font-semibold tracking-tight
                            transition-all duration-500 ease-out
                            hover:bg-slate-200 dark:hover:bg-slate-700
                            hover:border-slate-300 dark:hover:border-slate-600
                            hover:-translate-y-0.5"
                    >
                        Seguir comprando
                    </Link>
                    <Link
                        to="/checkout"
                        className="inline-flex items-center justify-center gap-2
                            px-8 py-3.5 rounded-2xl flex-1
                            bg-indigo-600 hover:bg-indigo-700
                            text-white text-[14px] font-semibold tracking-tight
                            transition-all duration-500 ease-out
                            hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5"
                    >
                        {/* Icono de candado = checkout seguro */}
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Continuar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
