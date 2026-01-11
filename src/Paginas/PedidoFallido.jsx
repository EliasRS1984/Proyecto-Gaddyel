import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

/**
 * PedidoFallido - Página cuando el pago fue rechazado
 * 
 * FLUJO:
 * 1. Mercado Pago redirige con: /pedido-fallido/:ordenId?status=rejected
 * 2. Página muestra mensaje de error y opciones
 * 3. Usuario puede reintentar o volver al carrito
 */
export const PedidoFallido = () => {
    const { id: ordenId } = useParams();
    const [searchParams] = useSearchParams();
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        // Cargar datos de localStorage
        const lastOrder = localStorage.getItem('lastOrderData');
        if (lastOrder) {
            try {
                const orderData = JSON.parse(lastOrder);
                setOrden(orderData);
                console.log('📦 [PedidoFallido] Datos de orden cargados:', orderData.orderNumber);
            } catch (e) {
                console.error('❌ Error parseando lastOrderData:', e);
            }
        }

        // Log de parámetros recibidos
        console.log('🔍 [PedidoFallido] Parámetros:', {
            ordenId,
            status: searchParams.get('status'),
            payment_id: searchParams.get('payment_id'),
            status_detail: searchParams.get('status_detail')
        });
    }, [ordenId, searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4 py-8">
            <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Icono de error */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-red-600 mb-2">Pago Rechazado</h1>
                <p className="text-gray-600 mb-6">Lamentablemente, tu pago no pudo ser procesado correctamente.</p>

                {orden && (
                    <div className="bg-gray-50 rounded p-4 mb-6 text-left">
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Número de Orden:</span>
                            <span className="font-bold">{orden.orderNumber || ordenId}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Monto Intentado:</span>
                            <span className="font-bold text-blue-600">${orden.total?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estado:</span>
                            <span className="font-bold text-red-600">Rechazado</span>
                        </div>
                    </div>
                )}

                <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                    <p className="text-sm text-red-800 mb-2">
                        <strong>Posibles causas:</strong>
                    </p>
                    <ul className="text-xs text-red-700 space-y-1 text-left">
                        <li>• Fondos insuficientes</li>
                        <li>• Tarjeta expirada o bloqueada</li>
                        <li>• Datos incorrectos</li>
                        <li>• Error temporal de la entidad bancaria</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <Link 
                        to={ordenId ? `/checkout` : '/carrito'}
                        className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                    >
                        Intentar Nuevamente
                    </Link>
                    <Link 
                        to="/catalogo"
                        className="block w-full bg-gray-200 text-gray-700 py-2 rounded font-medium hover:bg-gray-300 transition"
                    >
                        Ver Catálogo
                    </Link>
                    <Link 
                        to="/"
                        className="block w-full bg-gray-100 text-gray-700 py-2 rounded font-medium hover:bg-gray-200 transition"
                    >
                        Volver a Inicio
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    Si los problemas persisten, contáctanos a través de WhatsApp.
                </p>
            </div>
        </div>
    );
};

export default PedidoFallido;
