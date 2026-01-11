import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import orderStorage from '../utils/orderStorage';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

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

    useEffect(() => {
        // Si ya hemos cargado los datos, no hacerlo de nuevo
        if (hasLoadedRef.current) {
            return;
        }

        const cargarOrden = async () => {
            try {
                setLoading(true);
                
                // Log de parámetros recibidos
                console.log('🔍 [PedidoConfirmado] Parámetros:', {
                    ordenId,
                    status: searchParams.get('status'),
                    payment_id: searchParams.get('payment_id'),
                    collection_status: searchParams.get('collection_status')
                });
                
                if (ordenId) {
                    console.log('✅ Pedido confirmado con ID:', ordenId);
                    
                    // ✅ CORRECCIÓN: Usar orderStorage.getOrder() para obtener datos completos
                    // Antes intentaba acceder a 'lastOrderData' que no existía
                    const pedidoData = orderStorage.getOrder() || {};
                    
                    // ✅ DEBUG: Mostrar qué se obtuvo
                    console.log('📖 [PedidoConfirmado] Datos obtenidos de orderStorage:', {
                        hasData: Object.keys(pedidoData).length > 0,
                        ordenId: pedidoData.ordenId,
                        total: pedidoData.total,
                        subtotal: pedidoData.subtotal,
                        costoEnvio: pedidoData.costoEnvio,
                        itemsCount: pedidoData.items?.length || 0,
                        allKeys: Object.keys(pedidoData)
                    });
                    
                    if (Object.keys(pedidoData).length > 0) {
                        console.log('📦 Datos del pedido recuperados desde orderStorage:', pedidoData);
                    } else {
                        console.warn('⚠️ No hay datos de pedido en orderStorage');
                    }
                    
                    // Limpiar carrito después de pago exitoso (solo una vez)
                    if (!hasCleanedCartRef.current && searchParams.get('status') === 'approved') {
                        console.log('🧹 Limpiando carrito después de pago exitoso');
                        clearCart();
                        hasCleanedCartRef.current = true;
                    }
                    
                    // ✅ CORRECCIÓN: Usar datos correctos del objeto
                    // El backend retorna: ordenId, total, subtotal, costoEnvio, items, etc.
                    const orderNumber = pedidoData.orderNumber || `G-${ordenId.slice(-6).toUpperCase()}`;
                    const totalGeneral = pedidoData.total || pedidoData.totalFinal || 0;
                    const costoEnvio = pedidoData.costoEnvio !== undefined ? pedidoData.costoEnvio : 12000;
                    const subtotal = pedidoData.subtotal || pedidoData.total || 0;
                    const items = pedidoData.items || [];
                    const datosComprador = pedidoData || {};
                    
                    // Cantidad de solicitudes = suma total de cantidades
                    const cantidadProductos = items.reduce((sum, item) => sum + (item.cantidad || 1), 0);
                    
                    console.log('✅ Datos procesados:', { 
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
                        envio: {
                            mensaje: 'Tu pedido será procesado en aproximadamente 20 días corridos desde la confirmación del pago.',
                            diasProduccion: 20,
                            fechaEnvioEstimada: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                        }
                    });

                    // Marcar como cargado
                    hasLoadedRef.current = true;
                }
                
                setLoading(false);
            } catch (err) {
                console.error('❌ Error cargando pedido:', err);
                setError('No se pudo cargar la información del pedido');
                setLoading(false);
            }
        };

        cargarOrden();

        // Función de limpieza: se ejecuta cuando el componente se desmonta
        return () => {
            console.log('🧹 Limpiando datos de la última orden de localStorage.');
            localStorage.removeItem('lastOrderData');
        };
    }, [ordenId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
            <div className="max-w-lg bg-white rounded-lg shadow-lg p-8">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4 animate-pulse">
                            <span className="text-gray-600">⏳</span>
                        </div>
                        <p className="text-gray-600">Cargando confirmación de pedido...</p>
                    </div>
                ) : orden ? (
                    <>
                        {/* Icono de éxito */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-green-600 mb-2">¡Pedido Confirmado!</h1>
                            <p className="text-gray-600">Tu pedido ha sido registrado exitosamente</p>
                        </div>

                        {/* Resumen de orden */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Resumen del Pedido</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b-2 border-gray-300">
                                    <span className="text-gray-600 font-medium">Número de Pedido:</span>
                                    <span className="font-bold text-lg text-blue-600">{orden.orderNumber}</span>
                                </div>
                                
                                {/* Información de productos */}
                                {orden.items && orden.items.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="font-semibold text-gray-800 mb-3">📦 Productos ({orden.cantidadProductos} unidades)</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {orden.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm bg-white p-3 rounded border border-gray-200">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">
                                                            {item.nombre || item.titulo}: {item.cantidad} {item.cantidadUnidades && `(${item.cantidadUnidades * item.cantidad} ${(item.cantidadUnidades * item.cantidad) === 1 ? 'unidad' : 'unidades'})`}
                                                        </p>
                                                        <p className="text-xs text-gray-500">Cantidad: {item.cantidad} × ${item.precioUnitario || item.precio}</p>
                                                    </div>
                                                    <p className="font-medium text-gray-800 text-right">
                                                        ${(item.subtotal || (item.precioUnitario || item.precio) * item.cantidad).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                               

                                {/* Desglose de costos */}
                                {orden.subtotal > 0 && (
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-gray-600">Subtotal de productos:</span>
                                        <span className="font-medium text-gray-900">${orden.subtotal?.toFixed(2)}</span>
                                    </div>
                                )}
                                {orden.costoEnvio !== undefined && (
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-gray-600">Costo de envío:</span>
                                        <span className={`font-medium ${orden.costoEnvio === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                            {orden.costoEnvio === 0 ? 'GRATIS' : `$${orden.costoEnvio.toFixed(2)}`}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t-2 border-gray-300 pt-3 mt-2">
                                    <span className="text-gray-800 font-semibold text-lg">Total a Pagar:</span>
                                    <span className="font-bold text-2xl text-green-600">${orden.total?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        

                        {/* Información de envío */}
                        {orden.envio && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 mb-6">
                                <div className="flex items-start mb-3">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                                    </svg>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-blue-900 mb-1">Información de Envío</h3>
                                        <p className="text-sm text-blue-800 mb-2">
                                            {orden.envio.mensaje}
                                        </p>
                                        <div className="bg-white rounded p-3 text-sm">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-600">Fecha estimada de envío:</span>
                                                <span className="font-semibold text-blue-700">
                                                    {formatearFecha(orden.envio.fechaEnvioEstimada)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Confirmación por email */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                </svg>
                                <p className="text-sm text-amber-800">
                                    Te enviaremos un correo electrónico con los detalles de tu pedido y actualizaciones sobre el estado de envío.
                                </p>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="space-y-3">
                            <Link 
                                to="/"
                                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                            >
                                Volver a Inicio
                            </Link>
                            <Link 
                                to="/catalogo"
                                className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
                            >
                                Seguir Comprando
                            </Link>
                        </div>

                        <p className="text-xs text-center text-gray-500 mt-6">
                            Para consultas sobre tu pedido, contáctanos por WhatsApp o email
                        </p>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-red-600 mb-2">No se encontró el pedido</h1>
                        <p className="text-gray-600 mb-4">No pudimos encontrar los datos de tu pedido</p>
                        <Link 
                            to="/"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Volver a Inicio
                        </Link>
                    </div>
                )}

                
            </div>
        </div>
    );
};

export default PedidoConfirmado;
