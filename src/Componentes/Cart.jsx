import React from 'react';
import { useCart } from '../Context/CartContext';
import { Link } from 'react-router-dom';

/**
 * Componente Carrito - Muestra items del carrito con opciones para modificar
 */
export const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotal, isEmpty } = useCart();

    if (isEmpty) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Carrito Vacío</h2>
                <p className="text-gray-600 mb-6">No tienes productos en el carrito</p>
                <Link 
                    to="/" 
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Volver a Comprar
                </Link>
            </div>
        );
    }

    const total = getTotal();
    
    // Calcular cantidad de solicitudes (TOTAL de veces que se agregaron productos)
    const cantidadSolicitudes = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    const envioGratis = cantidadSolicitudes >= 3;  // 3 o más solicitudes = gratis
    const costoEnvio = envioGratis ? 0 : 12000;
    const totalConEnvio = total + costoEnvio;
    const productosRestantes = envioGratis ? 0 : 3 - cantidadSolicitudes;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <h1 className="text-3xl font-bold">Mi Carrito</h1>
                <p className="mt-1 opacity-90">{cartItems.length} producto(s)</p>
            </div>

            {/* Items del carrito */}
            <div className="p-6">
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div 
                            key={item._id} 
                            className="flex gap-4 border-b pb-4 last:border-b-0"
                        >
                            {/* Imagen */}
                            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {item.imagenSrc && (
                                    <img 
                                        src={item.imagenSrc} 
                                        alt={item.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Detalles */}
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg">
                                    {item.nombre}: {item.cantidad} {item.cantidadUnidades && `(${item.cantidadUnidades * item.cantidad} ${(item.cantidadUnidades * item.cantidad) === 1 ? 'unidad' : 'unidades'})`}
                                </h3>
                                <p className="text-blue-600 font-semibold">
                                    ${item.precio.toFixed(2)} c/u
                                </p>
                            </div>

                            {/* Cantidad */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                                    className="px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={item.cantidad}
                                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                    className="w-12 text-center border rounded"
                                    min="1"
                                />
                                <button
                                    onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                                    className="px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right min-w-32">
                                <p className="font-bold text-lg">
                                    ${(item.precio * item.cantidad).toFixed(2)}
                                </p>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-600 text-sm hover:underline mt-2"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen */}
                <div className="mt-8 border-t pt-6">
                    {/* Mensaje de envío gratis */}
                    {envioGratis ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                            <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                            </svg>
                            <div>
                                <p className="font-semibold text-green-800">¡Envío Gratis!</p>
                                <p className="text-sm text-green-700">Tienes {cantidadSolicitudes} {cantidadSolicitudes === 1 ? 'producto' : 'productos'} en tu carrito</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center">
                            <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                            <div>
                                <p className="font-semibold text-blue-800">¡Aprovecha el envío gratis!</p>
                                <p className="text-sm text-blue-700">
                                    Agrega {productosRestantes} producto{productosRestantes > 1 ? 's' : ''} más y obtén envío gratis
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mb-6">
                        <div className="w-64">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4 text-sm text-gray-600">
                                <span>Envío:</span>
                                <span className={envioGratis ? 'text-green-600 font-semibold' : ''}>
                                    {envioGratis ? 'Gratis' : `$${costoEnvio.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t pt-4">
                                <span>Total:</span>
                                <span className="text-blue-600">${totalConEnvio.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-4 justify-end">
                        <Link 
                            to="/"
                            className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                        >
                            Seguir Comprando
                        </Link>
                        <Link 
                            to="/checkout"
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Ir a Pagar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
