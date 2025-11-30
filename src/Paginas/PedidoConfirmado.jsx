import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

/**
 * PedidoConfirmado - Página de éxito después del pago
 */
export const PedidoConfirmado = () => {
    const [searchParams] = useSearchParams();
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        // Cargar datos de la orden desde localStorage o URL
        const lastOrder = localStorage.getItem('ultimaOrden');
        if (lastOrder) {
            setOrden(JSON.parse(lastOrder));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
            <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Icono de éxito */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-green-600 mb-2">¡Pedido Confirmado!</h1>
                <p className="text-gray-600 mb-6">Gracias por tu compra. Tu pedido ha sido recibido correctamente.</p>

                {orden && (
                    <div className="bg-gray-50 rounded p-4 mb-6 text-left">
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Número de Orden:</span>
                            <span className="font-bold">{orden.id}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-bold text-blue-600">${orden.total?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estado:</span>
                            <span className="font-bold text-amber-600">{orden.estado}</span>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        📧 Enviaremos un email de confirmación a la dirección que proporcionaste con los detalles de tu orden.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link 
                        to="/"
                        className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                    >
                        Volver a Inicio
                    </Link>
                    <Link 
                        to="/catalogo"
                        className="block w-full bg-gray-200 text-gray-700 py-2 rounded font-medium hover:bg-gray-300 transition"
                    >
                        Seguir Comprando
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    Si tienes dudas, contáctanos a través de WhatsApp o email.
                </p>
            </div>
        </div>
    );
};

export default PedidoConfirmado;
