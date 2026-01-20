import React from 'react';
import orderService from '../../Servicios/orderService';

/**
 * OrderSummary - Resumen de la orden
 * Muestra los items del carrito y cálculos de totales
 */
export const OrderSummary = ({ cartItems, total }) => {
    const cantidadSolicitudes = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotal = total;
    const costoEnvio = orderService.calculateShipping(cantidadSolicitudes);
    const feeMode = (import.meta.env.VITE_MP_FEE_MODE || 'absorb').toLowerCase();
    const feePercent = Number(import.meta.env.VITE_MP_FEE_PERCENT || 0);
    const feeFixed = Number(import.meta.env.VITE_MP_FEE_FIXED || 0);
    const feeLabel = import.meta.env.VITE_MP_FEE_LABEL || 'Recargo Mercado Pago';

    const baseTotal = subtotal + costoEnvio;

    // Vista previa de recargo si el modo es pass_through (el backend valida/corrige)
    const previewSurcharge = (() => {
        if (feeMode !== 'pass_through') return 0;
        const r = isNaN(feePercent) ? 0 : feePercent;
        const f = isNaN(feeFixed) ? 0 : feeFixed;
        if (r <= 0 && f <= 0) return 0;
        const charge = (baseTotal + f) / (1 - r);
        const surcharge = charge - baseTotal;
        return Math.round(Math.max(0, surcharge));
    })();

    const totalFinal = baseTotal + previewSurcharge;

    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

            {/* Items del carrito */}
            <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-start">
                        <div className="flex-1">
                            <p className="font-medium">{item.nombre}</p>
                            <p className="text-sm text-gray-600">
                                Cantidad: {item.cantidad}
                            </p>
                        </div>
                        <p className="font-semibold">
                            ${(item.precio * item.cantidad).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>

                {/* Envío */}
                <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">
                        {costoEnvio === 0 ? (
                            <span className="text-green-600">¡Gratis!</span>
                        ) : (
                            `$${costoEnvio.toLocaleString()}`
                        )}
                    </span>
                </div>

                {/* Recargo por Mercado Pago (si aplica) */}
                {previewSurcharge > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">{feeLabel}</span>
                        <span className="font-medium">${previewSurcharge.toLocaleString()}</span>
                    </div>
                )}

                {cantidadSolicitudes < 3 && costoEnvio > 0 && (
                    <p className="text-xs text-gray-500 italic">
                        Envío gratis en compras de 3 o más productos
                    </p>
                )}

                {/* Total */}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${totalFinal.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
