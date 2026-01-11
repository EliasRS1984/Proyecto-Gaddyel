import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../Servicios/mercadoPagoService';

/**
 * PedidoPendiente - Página cuando el pago está pendiente
 * 
 * FLUJO:
 * 1. Mercado Pago redirige con: /pedido-pendiente/:ordenId?status=pending
 * 2. Página muestra mensaje de espera
 * 3. Polling cada 5 segundos para verificar si el pago fue procesado
 * 4. Si aprobado → redirige a /pedido-confirmado
 * 5. Si rechazado → redirige a /pedido-fallido
 */
export const PedidoPendiente = () => {
    const { id: ordenId } = useParams();
    const [searchParams] = useSearchParams();
    const [orden, setOrden] = useState(null);
    const [checking, setChecking] = useState(false);
    const [pollingCount, setPollingCount] = useState(0);

    useEffect(() => {
        // Cargar datos de localStorage
        const lastOrder = localStorage.getItem('lastOrderData');
        if (lastOrder) {
            try {
                const orderData = JSON.parse(lastOrder);
                setOrden(orderData);
                console.log('📦 [PedidoPendiente] Datos de orden cargados:', orderData.orderNumber);
            } catch (e) {
                console.error('❌ Error parseando lastOrderData:', e);
            }
        }

        // Log de parámetros recibidos
        console.log('🔍 [PedidoPendiente] Parámetros:', {
            ordenId,
            status: searchParams.get('status'),
            payment_id: searchParams.get('payment_id'),
            collection_status: searchParams.get('collection_status')
        });
    }, [ordenId, searchParams]);

    // Polling para verificar estado del pago
    useEffect(() => {
        if (!ordenId) return;

        const checkPaymentStatus = async () => {
            try {
                setChecking(true);
                console.log(`🔍 [PedidoPendiente] Verificando pago (intento ${pollingCount + 1})...`);
                
                const status = await getPaymentStatus(ordenId);
                
                console.log('📊 [PedidoPendiente] Estado:', status);

                if (status.status === 'approved') {
                    console.log('✅ [PedidoPendiente] Pago aprobado, redirigiendo...');
                    window.location.href = `/pedido-confirmado/${ordenId}?status=approved`;
                } else if (status.status === 'rejected' || status.status === 'cancelled') {
                    console.log('❌ [PedidoPendiente] Pago rechazado, redirigiendo...');
                    window.location.href = `/pedido-fallido/${ordenId}?status=${status.status}`;
                }
            } catch (error) {
                console.error('❌ Error verificando pago:', error);
            } finally {
                setChecking(false);
            }
        };

        // Primera verificación inmediata
        checkPaymentStatus();

        // Polling cada 5 segundos (máximo 12 intentos = 1 minuto)
        if (pollingCount < 12) {
            const interval = setInterval(() => {
                setPollingCount(prev => prev + 1);
                checkPaymentStatus();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [ordenId, pollingCount]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4 py-8">
            <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Icono de espera */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-amber-600 mb-2">Pago Pendiente</h1>
                <p className="text-gray-600 mb-6">Tu pago está siendo procesado. Esto puede tomar unos minutos.</p>

                {orden && (
                    <div className="bg-gray-50 rounded p-4 mb-6 text-left">
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Número de Orden:</span>
                            <span className="font-bold">{orden.orderNumber || ordenId}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Monto:</span>
                            <span className="font-bold text-blue-600">${orden.total?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estado:</span>
                            <span className="font-bold text-amber-600">
                                {checking ? 'Verificando...' : 'Pendiente de Confirmación'}
                            </span>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        ⏳ Te notificaremos por email cuando el pago sea confirmado.
                        {pollingCount < 12 && ' Verificando automáticamente...'}
                    </p>
                    {pollingCount < 12 && (
                        <div className="mt-2 text-xs text-blue-600">
                            Verificación {pollingCount + 1} de 12
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => window.location.reload()}
                        disabled={checking}
                        className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {checking ? 'Verificando...' : 'Actualizar Estado'}
                    </button>
                    <Link 
                        to="/"
                        className="block w-full bg-gray-200 text-gray-700 py-2 rounded font-medium hover:bg-gray-300 transition"
                    >
                        Volver a Inicio
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    Si tienes problemas, contáctanos a través de WhatsApp.
                </p>
            </div>
        </div>
    );
};

export default PedidoPendiente;
