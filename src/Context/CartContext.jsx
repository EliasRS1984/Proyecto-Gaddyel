import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

/**
 * ✅ CartContext - Manejo global del carrito de compras (OPTIMIZADO)
 * Proporciona funciones para agregar, eliminar, actualizar items
 * Persiste en localStorage
 * 
 * ✅ OPTIMIZACIONES:
 * - useMemo: Cálculos de total e itemCount solo se recalculan si cartItems cambia
 * - useCallback: Funciones de acción (addToCart, etc) memorizadas
 * - Reduce renders innecesarios en componentes suscritos
 */
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const saved = localStorage.getItem('gaddyel_cart');
        if (saved) {
            try {
                setCartItems(JSON.parse(saved));
            } catch (e) {
                console.error('❌ Error cargando carrito:', e);
                localStorage.removeItem('gaddyel_cart');
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambia
    useEffect(() => {
        localStorage.setItem('gaddyel_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * ✅ Agregar producto al carrito (memoizado)
     * Si ya existe, incrementa cantidad pero mantiene cantidadUnidades del producto
     */
    const addToCart = useCallback((producto, cantidad = 1) => {
        setCartItems(prevItems => {
            const exists = prevItems.find(item => item._id === producto._id);
            
            if (exists) {
                return prevItems.map(item =>
                    item._id === producto._id
                        ? { 
                            ...item, 
                            cantidad: item.cantidad + cantidad
                            // cantidadUnidades se mantiene del producto (no se acumula)
                          }
                        : item
                );
            }
            
            return [...prevItems, { ...producto, cantidad }];
        });
    }, []);

    /**
     * ✅ Quitar producto del carrito completamente (memoizado)
     */
    const removeFromCart = useCallback((productoId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productoId));
    }, []);

    /**
     * ✅ Actualizar cantidad de un producto (memoizado)
     * Si cantidad es 0, lo elimina
     */
    const updateQuantity = useCallback((productoId, cantidad) => {
        if (cantidad <= 0) {
            removeFromCart(productoId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productoId
                    ? { ...item, cantidad }
                    : item
            )
        );
    }, [removeFromCart]);

    /**
     * ✅ Limpiar carrito completamente (memoizado)
     */
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    /**
     * ✅ OPTIMIZACIÓN: Calcular total del carrito con useMemo
     * Exponer valor directo, no función wrapper
     */
    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }, [cartItems]);

    /**
     * ✅ OPTIMIZACIÓN: Calcular cantidad total de items con useMemo
     * Exponer valor directo, no función wrapper
     */
    const itemCount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    }, [cartItems]);

    /**
     * ✅ Verificar si carrito está vacío (memoizado)
     */
    const isEmpty = useMemo(() => cartItems.length === 0, [cartItems]);

    /**
     * ✅ Obtener detalles para enviar al servidor (callback)
     */
    const getCartForCheckout = useCallback(() => {
        return cartItems.map(item => ({
            productoId: item._id,
            cantidad: item.cantidad
        }));
    }, [cartItems]);

    /**
     * ✅ Value memoizado para evitar recreación en cada render
     */
    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartForCheckout,
        // ✅ Exponer valores calculados directamente (no funciones)
        total,
        itemCount,
        isEmpty
    }), [
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartForCheckout,
        total,
        itemCount,
        isEmpty
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook para usar CartContext en cualquier componente
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
};

export default CartContext;
