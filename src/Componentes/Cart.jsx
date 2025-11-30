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
                                <h3 className="font-bold text-lg">{item.nombre}</h3>
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
                    <div className="flex justify-end mb-6">
                        <div className="w-64">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4 text-sm text-gray-600">
                                <span>Envío:</span>
                                <span>Calcular en checkout</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t pt-4">
                                <span>Total:</span>
                                <span className="text-blue-600">${total.toFixed(2)}</span>
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
