import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * CartContext - Manejo global del carrito de compras
 * Proporciona funciones para agregar, eliminar, actualizar items
 * Persiste en localStorage
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
     * Agregar producto al carrito
     * Si ya existe, incrementa cantidad
     */
    const addToCart = (producto, cantidad = 1) => {
        setCartItems(prevItems => {
            const exists = prevItems.find(item => item._id === producto._id);
            
            if (exists) {
                return prevItems.map(item =>
                    item._id === producto._id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            }
            
            return [...prevItems, { ...producto, cantidad }];
        });
    };

    /**
     * Quitar producto del carrito completamente
     */
    const removeFromCart = (productoId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productoId));
    };

    /**
     * Actualizar cantidad de un producto
     * Si cantidad es 0, lo elimina
     */
    const updateQuantity = (productoId, cantidad) => {
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
    };

    /**
     * Limpiar carrito completamente
     */
    const clearCart = () => {
        setCartItems([]);
    };

    /**
     * Calcular total del carrito
     */
    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    /**
     * Calcular cantidad total de items
     */
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.cantidad, 0);
    };

    /**
     * Obtener detalles para enviar al servidor
     */
    const getCartForCheckout = () => {
        return cartItems.map(item => ({
            productoId: item._id,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            nombre: item.nombre
        }));
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalItems,
        getCartForCheckout,
        isEmpty: cartItems.length === 0
    };

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
