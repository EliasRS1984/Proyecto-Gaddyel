// ============================================================
// ¿QUÉ ES ESTO?
//   Página que aparece cuando Mercado Pago rechaza el pago.
//   Mercado Pago redirige automáticamente aquí después de un
//   intento fallido (tarjeta rechazada, fondos insuficientes, etc.)
//
// ¿CÓMO FUNCIONA?
//   1. MP redirige con: /pedido-fallido/:ordenId?status=rejected
//   2. La página carga los datos del intento de compra desde el
//      almacenamiento temporal del navegador (localStorage)
//   3. Muestra el número de orden y el monto intentado
//   4. Ofrece opciones: reintentar el pago o volver al catálogo
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
//   - Página no muestra número de orden → revisar "lastOrderData" en localStorage
//   - Botón "Intentar nuevamente" va al lugar incorrecto → revisar `ordenId` en useParams
//   - Parámetros de MP → revisar console.log con 🔍 en el useEffect
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import orderStorage from '../utils/orderStorage';

// ======== COMPONENTE PRINCIPAL ========

/**
 * Página de pago rechazado — aparece después de que MP rechaza la transacción.
 *
 * FLUJO DE DATOS:
 * MP redirige → useParams lee ordenId → useEffect carga localStorage
 * → setOrden() → componente muestra datos del intento fallido
 *
 * NOTA DE DISEÑO: Jerarquía visual contenida (no alarmista).
 * El rechazo puede deberse a un problema técnico ajeno al usuario,
 * por lo que el tono es neutro y orientado a la acción.
 */
export const PedidoFallido = () => {
    // ======== DATOS DE RUTA Y ESTADO ========

    // `ordenId` viene de la URL: /pedido-fallido/ABC123
    const { id: ordenId } = useParams();
    // Parámetros extra que envía MP en la URL (status, payment_id, etc.)
    const [searchParams] = useSearchParams();
    // Datos del intento de compra (cargados desde localStorage)
    const [orden, setOrden] = useState(null);

    // ======== CARGA DE DATOS ========

    useEffect(() => {
        // Carga los datos del pedido desde el almacenamiento de la sesión.
        // IMPORTANTE: los datos se guardan en 'gaddyel_order_data' (via orderStorage),
        // no en 'lastOrderData' (clave antigua eliminada). Usar siempre orderStorage.getOrder().
        const orderData = orderStorage.getOrder();
        if (orderData) {
            setOrden(orderData);
            console.log('📦 [PedidoFallido] Datos de orden cargados:', orderData.orderNumber);
        }

        // MP puede enviar status='null' (string literal) cuando el usuario abandona
        // el proceso sin pagar y elige "Volver a la tienda". No es un error — es el
        // flujo normal de abandono. La página muestra la UI de rechazo en todos los casos.
        const statusParam = searchParams.get('status');
        const statusReal = (statusParam === 'null' || statusParam === null) ? 'abandonado' : statusParam;
        console.log('🔍 [PedidoFallido] Parámetros:', {
            ordenId,
            status: statusReal,
            payment_id: searchParams.get('payment_id'),
            status_detail: searchParams.get('status_detail')
        });
    }, [ordenId, searchParams]);

    // ======== INTERFAZ ========

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 py-24">
            <div className="w-full max-w-lg">

                {/* ── Cabecera de estado ── */}
                <div className="text-center mb-10">
                    {/* Pill badge — jerarquía discreta */}
                    <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200/60 dark:border-red-800/40 rounded-full px-4 py-1.5 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-red-600 dark:text-red-400">
                            Estado del Pago
                        </span>
                    </div>

                    {/* Icono de estado — contenido, no alarmante */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/40 rounded-2xl mb-6 ring-2 ring-red-100 dark:ring-red-900/50 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950">
                        <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-3">
                        El pago no pudo procesarse
                    </h1>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                        Tu pedido no fue cobrado. Podés intentarlo nuevamente o contactarnos si el problema persiste.
                    </p>
                </div>

                {/* ── Tarjeta principal ── */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl overflow-hidden mb-6">

                    {/* Datos del intento de pago (si están disponibles) */}
                    {orden && (
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-400 dark:text-slate-500 mb-4">
                                Intento de compra
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[14px] text-slate-500 dark:text-slate-400">Número de orden</span>
                                    <span className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 font-mono">
                                        {orden.orderNumber || ordenId}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[14px] text-slate-500 dark:text-slate-400">Monto</span>
                                    <span className="text-[15px] font-bold tracking-tight text-slate-800 dark:text-slate-200">
                                        ${orden.total?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[14px] text-slate-500 dark:text-slate-400">Estado</span>
                                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-600 dark:text-red-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Rechazado
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Posibles causas — tono neutro y claro */}
                    <div className="px-8 py-6">
                        <p className="text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-4">
                            Posibles causas del rechazo
                        </p>
                        <ul className="space-y-2.5">
                            {[
                                'Fondos insuficientes en la tarjeta o cuenta',
                                'Tarjeta expirada o temporalmente bloqueada',
                                'Datos de pago ingresados incorrectamente',
                                'Error transitorio de la entidad bancaria',
                            ].map((causa) => (
                                <li key={causa} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0 mt-1.5" />
                                    <span className="text-[14px] text-slate-600 dark:text-slate-400 leading-snug">
                                        {causa}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Acciones ── */}
                <div className="space-y-3">
                    {/* CTA principal — reintentar el pago */}
                    <Link
                        to={ordenId ? '/checkout' : '/carrito'}
                        className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-semibold tracking-tight text-[15px] text-center transition-all duration-500 ease-out"
                    >
                        Intentar nuevamente
                    </Link>

                    {/* CTA secundario — explorar catálogo */}
                    <Link
                        to="/catalogo"
                        className="block w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-3.5 rounded-2xl font-semibold tracking-tight text-[15px] text-center transition-all duration-500 ease-out"
                    >
                        Ver catálogo
                    </Link>
                </div>

                {/* Contacto de soporte */}
                <p className="text-[13px] text-center text-slate-400 dark:text-slate-600 mt-8 leading-relaxed">
                    ¿El problema persiste?{' '}
                    <a
                        href="https://wa.me/5493537407069"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:text-indigo-600 transition-colors duration-500 ease-out"
                    >
                        Contactanos por WhatsApp
                    </a>
                </p>

            </div>
        </div>
    );
};

export default PedidoFallido;
