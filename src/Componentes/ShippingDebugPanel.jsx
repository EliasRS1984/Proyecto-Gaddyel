/**
 * ShippingDebugPanel.jsx
 * Panel de depuración para verificar el cálculo de envío en tiempo real
 */

import React, { useContext } from 'react';
import { useCart } from '../Context/CartContext';
import { calculateShipping } from '../Servicios/orderService';

export const ShippingDebugPanel = () => {
    const { cartItems } = useCart();

    // Calcular cantidad de productos (como en Checkout.jsx)
    const totalProductos = cartItems.reduce((sum, item) => {
        const unidadesPorItem = (item.cantidadUnidades || 1) * (item.cantidad || 1);
        return sum + unidadesPorItem;
    }, 0);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envioGratis = totalProductos >= 3;
    const costoEnvio = calculateShipping(totalProductos);
    const total = subtotal + costoEnvio;

    if (cartItems.length === 0) {
        return (
            <div className="bg-gray-100 p-4 rounded text-center text-gray-600">
                Carrito vacío - no hay envío que calcular
            </div>
        );
    }

    return (
        <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-yellow-900 mb-3">🐛 DEBUG: Cálculo de Envío</h3>
            
            {/* Items en carrito */}
            <div className="bg-white p-3 rounded mb-3">
                <p className="font-semibold text-sm mb-2">📦 Items en Carrito:</p>
                <div className="text-xs space-y-1">
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                            <span>{item.nombre || item.titulo}</span>
                            <span>
                                cantidadUnidades={item.cantidadUnidades || 1} × 
                                cantidad={item.cantidad} = 
                                {((item.cantidadUnidades || 1) * (item.cantidad || 1))} unidades
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cálculo */}
            <div className="bg-white p-3 rounded mb-3">
                <p className="font-semibold text-sm mb-2">🧮 Cálculo:</p>
                <div className="text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                        <span>Total de unidades:</span>
                        <span className="font-bold">{totalProductos}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>¿{totalProductos} &gt;= 3?</span>
                        <span className={`font-bold ${envioGratis ? 'text-green-600' : 'text-red-600'}`}>
                            {envioGratis ? 'SÍ → GRATIS' : 'NO → $12.000'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Totales */}
            <div className="bg-white p-3 rounded">
                <p className="font-semibold text-sm mb-2">💰 Totales:</p>
                <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Envío:</span>
                        <span className={envioGratis ? 'text-green-600 font-bold' : 'text-red-600'}>
                            ${costoEnvio.toFixed(2)}
                        </span>
                    </div>
                    <div className="border-t mt-1 pt-1 flex justify-between font-bold">
                        <span>TOTAL:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Advertencia */}
            {!envioGratis && (
                <div className="bg-blue-100 border border-blue-300 p-2 rounded mt-3 text-xs text-blue-800">
                    ℹ️ Agrega {3 - totalProductos} unidades más para obtener envío gratis
                </div>
            )}

            {envioGratis && (
                <div className="bg-green-100 border border-green-300 p-2 rounded mt-3 text-xs text-green-800">
                    ✓ ¡Tu envío es GRATIS! (≥ 3 unidades)
                </div>
            )}
        </div>
    );
};

export default ShippingDebugPanel;
