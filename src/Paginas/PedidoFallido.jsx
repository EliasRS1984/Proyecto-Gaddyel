import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * PedidoFallido - Página cuando el pago fue rechazado
 */
export const PedidoFallido = () => {
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        const lastOrder = localStorage.getItem('ultimaOrden');
        if (lastOrder) {
            setOrden(JSON.parse(lastOrder));
        }
    }, []);

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
                            <span className="font-bold">{orden.id}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Monto Intentado:</span>
                            <span className="font-bold text-blue-600">${orden.total?.toFixed(2)}</span>
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
                        to="/checkout"
                        className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                    >
                        Intentar Nuevamente
                    </Link>
                    <Link 
                        to="/carrito"
                        className="block w-full bg-gray-200 text-gray-700 py-2 rounded font-medium hover:bg-gray-300 transition"
                    >
                        Ver Carrito
                    </Link>
                    <Link 
                        to="/"
                        className="block w-full bg-gray-100 text-gray-700 py-2 rounded font-medium hover:bg-gray-200 transition"
                    >
                        Volver a Inicio
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    Si los problemas persisten, contáctanos a través de WhatsApp. Tu carrito ha sido guardado.
                </p>
            </div>
        </div>
    );
};

export default PedidoFallido;
