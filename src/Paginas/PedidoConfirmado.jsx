import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import orderStorage from '../utils/orderStorage';
import { logger } from '../utils/logger';
import { CONTACT_INFO } from '../constants/contactInfo';

/**
 * Función para formatear fecha (fuera del componente para evitar problemas de hooks)
 */
const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

/**
 * PedidoConfirmado - Página de éxito después de crear el pedido
 * 
 * FLUJO:
 * 1. Mercado Pago redirige con: /pedido-confirmado/:ordenId?status=approved
 * 2. Página carga datos de localStorage
 * 3. Limpia el carrito (pago exitoso)
 * 4. Muestra resumen del pedido
 */
const PedidoConfirmado = () => {
    const { id: ordenId } = useParams();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // useRef para evitar que React Strict Mode cause múltiples lecturas
    const hasLoadedRef = useRef(false);
    const hasCleanedCartRef = useRef(false);

    // ======== DESCARGA DEL COMPROBANTE ========
    // Cuando el usuario hace click en "Descargar comprobante", esta función
    // abre una ventana nueva con el resumen del pedido listo para imprimir
    // o guardar como PDF. No requiere librerías externas.
    //
    // SEGURIDAD: todos los datos del comprador se escapan antes de insertarse
    // en el HTML para prevenir XSS (OWASP A03).
    const handleDescargarComprobante = () => {
        if (!orden) return;

        // Escapa caracteres especiales de HTML para datos que vienen del usuario
        const esc = (str) =>
            String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');

        // Formatea un número como moneda argentina
        const ars = (n) =>
            `$${(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const fechaHoy = new Date().toLocaleDateString('es-AR', {
            day: '2-digit', month: 'long', year: 'numeric',
        });

        // Filas de la tabla de productos
        const itemsHTML = (orden.items || []).map((item) => `
            <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b">${esc(item.nombre || item.titulo || 'Producto')}</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:center;color:#475569">${esc(item.cantidad)}</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:center;color:#475569">${esc(item.cantidadUnidades || 1)}</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:center;color:#475569">${item.cantidad * (item.cantidadUnidades || 1)} uds.</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:right;font-weight:600;color:#1e293b">${ars(item.subtotal || (item.precioUnitario || item.precio || 0) * item.cantidad)}</td>
            </tr>
        `).join('');

        // Bloque de datos del comprador (solo si hay datos disponibles)
        const c = orden.datosComprador || {};
        const hayComprador = c.nombre || c.email || c.telefono || c.domicilio;
        const compradorHTML = hayComprador ? `
            <div style="margin-bottom:24px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
                <h3 style="font-size:12px;font-weight:700;color:#64748b;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.08em">Datos del comprador</h3>
                ${c.nombre  ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;color:#64748b">Nombre</span><span style="font-size:13px;color:#1e293b;font-weight:600">${esc(c.nombre)}</span></div>` : ''}
                ${c.email   ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;color:#64748b">Email</span><span style="font-size:13px;color:#1e293b;font-weight:600">${esc(c.email)}</span></div>` : ''}
                ${c.telefono? `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;color:#64748b">WhatsApp</span><span style="font-size:13px;color:#1e293b;font-weight:600">${esc(c.telefono)}</span></div>` : ''}
                ${(c.domicilio || c.localidad) ? `
                <div style="border-top:1px solid #e2e8f0;margin-top:10px;padding-top:10px">
                    <span style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px">Dirección de entrega</span>
                    <span style="font-size:13px;color:#1e293b;font-weight:600">${esc([c.domicilio, c.localidad, c.provincia, c.codigoPostal].filter(Boolean).join(', '))}</span>
                </div>` : ''}
            </div>
        ` : '';

        // Tabla de productos (solo si hay ítems)
        const productosHTML = orden.items?.length > 0 ? `
            <div style="margin-bottom:24px">
                <h3 style="font-size:12px;font-weight:700;color:#64748b;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.08em">Detalle de productos</h3>
                <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
                    <thead>
                        <tr style="background:#f8fafc">
                            <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.06em">Producto</th>
                            <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:center;border-bottom:2px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.06em">Solic.</th>
                            <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:center;border-bottom:2px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.06em">Uds./Paq.</th>
                            <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:center;border-bottom:2px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.06em">Total Uds.</th>
                            <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:right;border-bottom:2px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.06em">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHTML}</tbody>
                </table>
            </div>
        ` : '';

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante ${esc(orden.orderNumber)} — Gaddyel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; max-width: 680px; margin: 0 auto; }
        @media print { body { padding: 20px; } .no-imprimir { display: none !important; } }
    </style>
</head>
<body>
    <!-- Cabecera del comprobante -->
    <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e2e8f0">
        <div style="display:inline-flex;align-items:center;gap:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:999px;padding:6px 16px;margin-bottom:16px">
            <span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block"></span>
            <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#16a34a">Pedido Confirmado · Gaddyel Textiles B2B</span>
        </div>
        <h1 style="font-size:22px;font-weight:800;color:#1e293b;margin-bottom:6px">Comprobante de Compra</h1>
        <p style="font-size:18px;color:#4f46e5;font-weight:700;font-family:monospace">Orden #${esc(orden.orderNumber)}</p>
        <p style="font-size:12px;color:#94a3b8;margin-top:6px">Emitido el ${fechaHoy}</p>
    </div>

    <!-- Datos del comprador -->
    ${compradorHTML}

    <!-- Tabla de productos -->
    ${productosHTML}

    <!-- Resumen de totales -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:24px">
        ${orden.subtotal > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:13px;color:#64748b">Subtotal</span><span style="font-size:13px;color:#1e293b">${ars(orden.subtotal)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:13px;color:#64748b">Envío</span>
            <span style="font-size:13px;font-weight:600;color:${orden.costoEnvio === 0 ? '#16a34a' : '#1e293b'}">${orden.costoEnvio === 0 ? 'Gratis' : ars(orden.costoEnvio)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:2px solid #e2e8f0">
            <span style="font-size:15px;font-weight:700;color:#1e293b">Total pagado</span>
            <span style="font-size:22px;font-weight:800;color:#4f46e5">${ars(orden.total)}</span>
        </div>
    </div>

    <!-- Aviso de producción -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin-bottom:24px">
        <p style="font-size:13px;color:#3730a3;line-height:1.6">
            Tu pedido será procesado en aproximadamente <strong>20 días hábiles</strong> desde la confirmación del pago, considerando lunes a viernes.
            Te contactaremos por WhatsApp con las novedades del envío.
        </p>
    </div>

    <!-- Pie del documento -->
    <div style="text-align:center;padding-top:20px;border-top:1px solid #e2e8f0">
        <p style="font-size:12px;color:#94a3b8">Gaddyel Textiles B2B · Comprobante generado automáticamente</p>
    </div>

    <!-- Activa el diálogo de impresión / guardar PDF al abrir la ventana -->
    <script>window.addEventListener('load', function () { window.print(); });</script>
</body>
</html>`;

        // Abre la ventana con el comprobante listo para imprimir o guardar como PDF
        const ventana = window.open('', '_blank', 'width=800,height=700');
        if (ventana) {
            ventana.document.write(html);
            ventana.document.close();
        }
    };

    useEffect(() => {
        // Si ya hemos cargado los datos, no hacerlo de nuevo
        if (hasLoadedRef.current) {
            return;
        }

        const cargarOrden = async () => {
            try {
                setLoading(true);
                
                // Log de parámetros recibidos
                logger.debug('[PedidoConfirmado] Parámetros:', {
                    ordenId,
                    status: searchParams.get('status'),
                    payment_id: searchParams.get('payment_id'),
                    collection_status: searchParams.get('collection_status')
                });
                
                if (ordenId) {
                    logger.debug('Pedido confirmado con ID:', ordenId);
                    
                    // ✅ CORRECCIÓN: Usar orderStorage.getOrder() para obtener datos completos
                    // Antes intentaba acceder a 'lastOrderData' que no existía
                    const pedidoData = orderStorage.getOrder() || {};
                    
                    // ✅ DEBUG: Mostrar qué se obtuvo
                    logger.debug('[PedidoConfirmado] Datos obtenidos de orderStorage:', {
                        hasData: Object.keys(pedidoData).length > 0,
                        ordenId: pedidoData.ordenId,
                        total: pedidoData.total,
                        subtotal: pedidoData.subtotal,
                        costoEnvio: pedidoData.costoEnvio,
                        itemsCount: pedidoData.items?.length || 0,
                        allKeys: Object.keys(pedidoData)
                    });
                    
                    if (Object.keys(pedidoData).length > 0) {
                        logger.debug('Datos del pedido recuperados desde orderStorage:', pedidoData);
                    } else {
                        logger.warn('No hay datos de pedido en orderStorage');
                    }
                    
                    // Limpiar carrito después de pago exitoso (solo una vez)
                    if (!hasCleanedCartRef.current && searchParams.get('status') === 'approved') {
                        logger.debug('Limpiando carrito después de pago exitoso');
                        clearCart();
                        hasCleanedCartRef.current = true;
                    }
                    
                    // ✅ Mapeo correcto de cada campo del pedido
                    const orderNumber = pedidoData.orderNumber || `G-${ordenId.slice(-6).toUpperCase()}`;
                    const totalGeneral = pedidoData.total || pedidoData.totalFinal || 0;
                    // No aplicar fallback al costoEnvio: 0 significa envío gratis (válido),
                    // undefined significa que el dato no llegó. El JSX usa `!== undefined`
                    // para ocultar la fila en ese caso, evitando mostrar un valor incorrecto.
                    const costoEnvio = pedidoData.costoEnvio;
                    const subtotal = pedidoData.subtotal || pedidoData.total || 0;
                    const items = pedidoData.items || [];
                    // ✅ CORRECCIÓN: datosComprador es un sub-objeto dentro del pedido, no el pedido entero
                    const datosComprador = pedidoData.datosComprador || {};
                    
                    // Cantidad de solicitudes = suma total de cantidades
                    const cantidadProductos = items.reduce((sum, item) => sum + (item.cantidad || 1), 0);
                    
                    logger.debug('Datos procesados:', { 
                        orderNumber, 
                        cantidadProductos, 
                        costoEnvio,
                        totalGeneral,
                        subtotal,
                        itemsCount: items.length
                    });
                    
                    // Crear objeto completo de orden para mostrar
                    setOrden({
                        _id: ordenId,
                        orderNumber: orderNumber,
                        total: totalGeneral,
                        subtotal: subtotal,
                        costoEnvio: costoEnvio,
                        cantidadProductos: cantidadProductos,
                        items: items,
                        datosComprador: datosComprador,
                        // ✅ CORRECCIÓN: mapear datos de pago de MP si existen
                        payment: pedidoData.payment || null,
                        envio: {
                            mensaje: 'Tu pedido será procesado en aproximadamente 20 días hábiles desde la confirmación del pago, considerando lunes a viernes.',
                            diasProduccion: 20,
                            fechaEnvioEstimada: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                        }
                    });

                    // Marcar como cargado
                    hasLoadedRef.current = true;
                }
                
                setLoading(false);
            } catch (err) {
                logger.error('Error cargando pedido:', err);
                setError('No se pudo cargar la información del pedido');
                setLoading(false);
            }
        };

        cargarOrden();

        // Limpieza al salir: borra la orden guardada para no mostrar datos
        // de una compra anterior si el usuario regresa más tarde
        return () => {
            orderStorage.clear();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // clearCart y searchParams se leen vía refs/closures estables — solo redispachar con ordenId
    }, [ordenId]);

    // ======== INTERFAZ ========

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-24">
            <div className="max-w-2xl mx-auto">
                {/* ── Estado: cargando ── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl mb-6 animate-pulse">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="text-[15px] text-slate-500 dark:text-slate-400 tracking-tight">Cargando confirmación de pedido...</p>
                    </div>
                ) : orden ? (
                    // ── Vista principal: pedido confirmado ──
                    <div className="w-full">

                        {/* ── Cabecera de éxito ── */}
                        <div className="text-center mb-10">
                            {/* Pill badge */}
                            <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/40 border border-green-200/60 dark:border-green-800/40 rounded-full px-4 py-1.5 mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-green-600 dark:text-green-400">
                                    Pedido Confirmado · Textiles B2B
                                </span>
                            </div>

                            {/* Icono de éxito */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/40 rounded-2xl mb-6 ring-2 ring-green-100 dark:ring-green-900/50 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950">
                                <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-2">
                                ¡Tu pedido fue registrado!
                            </h1>
                            {/* Número de orden destacado */}
                            <div className="inline-flex items-center gap-2 mt-2">
                                <span className="text-[14px] text-slate-500 dark:text-slate-400">Orden</span>
                                <span className="text-[18px] font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">
                                    #{orden.orderNumber}
                                </span>
                            </div>

                            {/* Botón para descargar el comprobante como PDF */}
                            {/* ¿El botón no aparece? Revisa que `orden` no sea null */}
                            <div className="mt-6">
                                <button
                                    onClick={handleDescargarComprobante}
                                    className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-2xl font-semibold tracking-tight text-[14px] transition-all duration-500 ease-out shadow-sm"
                                >
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descargar comprobante
                                </button>
                            </div>
                        </div>

                        {/* ── Productos del pedido ── */}
                        {orden.items && orden.items.length > 0 && (
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl overflow-hidden mb-4">
                                {/* Header sección */}
                                <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                                            Productos
                                        </p>
                                        <p className="text-[12px] text-slate-400 dark:text-slate-500">
                                            {orden.cantidadProductos} {orden.cantidadProductos === 1 ? 'unidad' : 'unidades'} en total
                                        </p>
                                    </div>
                                </div>

                                {/* Lista de productos */}
                                <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {orden.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-start px-8 py-4">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 truncate">
                                                    {item.nombre || item.titulo}
                                                </p>
                                                <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                    {item.cantidad} {item.cantidad === 1 ? 'paquete' : 'paquetes'}
                                                    {item.cantidadUnidades && (
                                                        <span className="ml-1">
                                                            · {item.cantidadUnidades * item.cantidad}{' '}
                                                            {(item.cantidadUnidades * item.cantidad) === 1 ? 'unidad' : 'unidades'}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <span className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 flex-shrink-0">
                                                ${(item.subtotal || (item.precioUnitario || item.precio) * item.cantidad).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Desglose de totales */}
                                <div className="px-8 py-5 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                                    {orden.subtotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[14px] text-slate-500 dark:text-slate-400">Subtotal</span>
                                            <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">
                                                ${(orden.subtotal ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    )}
                                    {/* costoEnvio puede ser 0 (envío gratis) o un número positivo */}
                                    {orden.costoEnvio !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-[14px] text-slate-500 dark:text-slate-400">Envío</span>
                                            <span className={`text-[14px] font-semibold ${orden.costoEnvio === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {orden.costoEnvio === 0 ? 'Gratis' : `$${(orden.costoEnvio ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <span className="text-[15px] font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                                            Total pagado
                                        </span>
                                        <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                                            ${(orden.total ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Datos del comprador ── */}
                        {orden.datosComprador && (
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl overflow-hidden mb-4">
                                <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                                        Datos del comprador
                                    </p>
                                </div>
                                <div className="px-8 py-6 space-y-3">
                                    {orden.datosComprador.nombre && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">Nombre</span>
                                            <span className="text-[14px] font-medium tracking-tight text-slate-700 dark:text-slate-300">
                                                {orden.datosComprador.nombre}
                                            </span>
                                        </div>
                                    )}
                                    {orden.datosComprador.email && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">Email</span>
                                            <span className="text-[14px] font-medium tracking-tight text-slate-600 dark:text-slate-400">
                                                {orden.datosComprador.email}
                                            </span>
                                        </div>
                                    )}
                                    {orden.datosComprador.telefono && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">WhatsApp</span>
                                            <span className="text-[14px] font-medium tracking-tight text-slate-600 dark:text-slate-400">
                                                {orden.datosComprador.telefono}
                                            </span>
                                        </div>
                                    )}
                                    {/* Dirección de entrega */}
                                    {(orden.datosComprador.domicilio || orden.datosComprador.localidad) && (
                                        <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800">
                                            <p className="text-[13px] text-slate-400 dark:text-slate-500 mb-2">Dirección de entrega</p>
                                            <p className="text-[14px] font-medium tracking-tight text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {[
                                                    orden.datosComprador.domicilio,
                                                    orden.datosComprador.localidad,
                                                    orden.datosComprador.provincia,
                                                    orden.datosComprador.codigoPostal,
                                                ].filter(Boolean).join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Envío estimado ── */}
                        {orden.envio && (
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl overflow-hidden mb-4">
                                <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                                        Información de envío
                                    </p>
                                </div>
                                <div className="px-8 py-6 space-y-2.5">
                                    <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {orden.envio.mensaje}
                                    </p>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[13px] text-slate-400 dark:text-slate-500">Fecha estimada de envío</span>
                                        <span className="text-[14px] font-semibold tracking-tight text-indigo-600 dark:text-indigo-400">
                                            {formatearFecha(orden.envio.fechaEnvioEstimada)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Detalles del pago ── */}
                        {orden.payment && orden.payment.mercadoPago && (
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl overflow-hidden mb-4">
                                <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#009ee3' }}>
                                        {/* Ícono simplificado — círculo concéntrico referencia MP */}
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                                            <circle cx="12" cy="12" r="5" fill="white" />
                                        </svg>
                                    </div>
                                    <p className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                                        Detalles del pago
                                    </p>
                                </div>
                                <div className="px-8 py-6 space-y-3">
                                    {orden.payment.mercadoPago.paymentId && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">ID Transacción</span>
                                            <span className="text-[13px] font-mono font-semibold text-slate-600 dark:text-slate-300">
                                                {orden.payment.mercadoPago.paymentId}
                                            </span>
                                        </div>
                                    )}
                                    {orden.payment.mercadoPago.status && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">Estado</span>
                                            <span className={`text-[13px] font-semibold ${orden.payment.mercadoPago.status === 'approved' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                {orden.payment.mercadoPago.status === 'approved' ? '✓ Aprobado' : orden.payment.mercadoPago.status}
                                            </span>
                                        </div>
                                    )}
                                    {orden.payment.mercadoPago.paymentMethod && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">Método</span>
                                            <span className="text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-300 uppercase">
                                                {orden.payment.mercadoPago.paymentMethod}
                                            </span>
                                        </div>
                                    )}
                                    {orden.payment.mercadoPago.installments && orden.payment.mercadoPago.installments > 1 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">Cuotas</span>
                                            <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">
                                                {orden.payment.mercadoPago.installments}x
                                            </span>
                                        </div>
                                    )}
                                    {orden.payment.mercadoPago.createdAt && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-400 dark:text-slate-500">Fecha</span>
                                            <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">
                                                {formatearFecha(orden.payment.mercadoPago.createdAt)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Aviso de email ── */}
                        <div className="flex items-start gap-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl px-6 py-4 mb-6">
                            <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            <p className="text-[13px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
                                Te enviaremos un mensaje de confirmación por WhatsApp con los detalles de tu pedido y actualizaciones sobre el estado de envío.
                            </p>
                        </div>

                        {/* ── Acciones ── */}
                        <div className="space-y-3">
                            <Link
                                to="/catalogo"
                                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-semibold tracking-tight text-[15px] text-center transition-all duration-500 ease-out"
                            >
                                Seguir comprando
                            </Link>
                            <Link
                                to="/"
                                className="block w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-3.5 rounded-2xl font-semibold tracking-tight text-[15px] text-center transition-all duration-500 ease-out"
                            >
                                Volver a inicio
                            </Link>
                        </div>

                        <p className="text-[12px] text-center text-slate-400 dark:text-slate-600 mt-8">
                            ¿Consultas sobre tu pedido?{' '}
                            <a
                                href={CONTACT_INFO.whatsapp.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-500 hover:text-indigo-600 transition-colors duration-500 ease-out"
                            >
                                Contactanos por WhatsApp
                            </a>
                        </p>
                    </div>
                ) : error ? (
                    /* ── Estado: error al cargar ── */
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/40 rounded-2xl mb-6">
                            <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-200 mb-2">
                            Error al cargar el pedido
                        </h1>
                        <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-8">{error}</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold tracking-tight text-[15px] transition-all duration-500 ease-out"
                        >
                            Volver a inicio
                        </Link>
                    </div>
                ) : (
                    /* ── Estado: orden no encontrada ── */
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/40 rounded-2xl mb-6 ring-2 ring-red-100 dark:ring-red-900/50 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950">
                            <svg className="w-7 h-7 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-200 mb-2">
                            No se encontraron datos del pedido
                        </h1>
                        <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-8">
                            Es posible que la sesión haya expirado.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold tracking-tight text-[15px] transition-all duration-500 ease-out"
                        >
                            Volver a inicio
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedidoConfirmado;
