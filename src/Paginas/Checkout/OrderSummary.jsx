import orderService from '../../Servicios/orderService';
import { useShippingConfig } from '../../hooks/useShippingConfig';

// =====================================================
// ¿QUÉ ES ESTO?
// Panel lateral del checkout que muestra el resumen del pedido:
// qué productos se van a comprar, el costo de envío y el total a pagar.
//
// ¿CÓMO FUNCIONA?
// 1. Recibe la lista de productos del carrito y el subtotal desde index.jsx
// 2. Calcula el costo de envío según la cantidad total de unidades
//    (envío gratis a partir de 3 unidades, definido en orderService)
// 3. Muestra precio por producto, costo de envío y precio total en pesos
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El total no coincide?             Revisá calculateShipping en orderService.js
// ¿Los productos no aparecen?        Revisá que CartContext tenga datos en cartItems
// ¿El envío gratis no se activa?     La regla de 3 unidades está en orderService.calculateShipping
// =====================================================
export const OrderSummary = ({ cartItems, total }) => {
    const cantidadSolicitudes = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotal = total;
    // cantidadMinima y costoEnvio vienen del servidor (seteados por el admin en el panel)
    const { cantidadMinima, costoEnvio: costoEnvioBase } = useShippingConfig();
    const costoEnvio = orderService.calculateShipping(cantidadSolicitudes, cantidadMinima, costoEnvioBase);
    const totalFinal = subtotal + costoEnvio;

    return (
        // ======== RESUMEN DE ORDEN ========
        // Panel lateral sticky que muestra lo que el usuario va a pagar
        // ¿El total no coincide? Revisá orderService.calculateShipping
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
            border border-slate-200/50 dark:border-slate-800/50
            rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40
            p-6 sm:p-8">

            {/* Título de sección */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/40">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Resumen del Pedido
                </h2>
            </div>

            {/* Lista de items */}
            <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-[14px] tracking-tight text-slate-700 dark:text-slate-300 truncate">
                                {item.nombre}
                            </p>
                            <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">
                                Cantidad: {item.cantidad}
                            </p>
                        </div>
                        <p className="font-semibold text-[14px] text-slate-800 dark:text-slate-100 flex-shrink-0">
                            ${(item.precio * item.cantidad).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Desglose de costos */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                <div className="flex justify-between text-[14px] text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[14px] text-slate-500 dark:text-slate-400">
                    <span>Envío</span>
                    {costoEnvio === 0 ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">¡Gratis!</span>
                    ) : (
                        <span className="font-medium text-slate-700 dark:text-slate-300">${costoEnvio.toLocaleString()}</span>
                    )}
                </div>

                {/* Aviso de envío gratis si aún no aplica */}
                {cantidadSolicitudes < cantidadMinima && costoEnvio > 0 && (
                    <p className="text-[12px] text-indigo-500 dark:text-indigo-400">
                        Envío gratis a partir de {cantidadMinima} productos
                    </p>
                )}

                {/* Total final — destacado */}
                <div className="flex justify-between items-baseline border-t border-slate-100 dark:border-slate-800 pt-4 mt-1">
                    <span className="font-bold tracking-tight text-slate-800 dark:text-slate-100">Total</span>
                    <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                        ${totalFinal.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};
