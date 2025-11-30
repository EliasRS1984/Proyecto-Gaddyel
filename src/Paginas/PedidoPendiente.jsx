import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * PedidoPendiente - Página cuando el pago está pendiente
 */
export const PedidoPendiente = () => {
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        const lastOrder = localStorage.getItem('ultimaOrden');
        if (lastOrder) {
            setOrden(JSON.parse(lastOrder));
        }
    }, []);

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
                            <span className="font-bold">{orden.id}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Monto:</span>
                            <span className="font-bold text-blue-600">${orden.total?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estado:</span>
                            <span className="font-bold text-amber-600">Pendiente de Confirmación</span>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        ⏳ Te notificaremos por email cuando el pago sea confirmado. No cierres esta ventana.
                    </p>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                    >
                        Actualizar Estado
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
