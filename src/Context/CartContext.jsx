// ============================================================
// ¿QUÉ ES ESTO?
// El "almacén" del carrito de compras. Guarda qué productos el
// usuario eligió, en qué cantidades, y cuánto suma en total.
// Esta información está disponible para toda la página sin
// necesidad de pasarla componente por componente.
//
// ¿CÓMO FUNCIONA?
// 1. Al abrir la página, lee el carrito guardado en el navegador
//    (localStorage) para que el usuario retome donde quedó.
// 2. Cada vez que el carrito cambia, lo guarda automáticamente.
// 3. Expone funciones simples: agregar, quitar, cambiar cantidad,
//    vaciar, y armar la lista para enviar al servidor al pagar.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿El carrito se vacía al recargar la página? → Revisar el
//   inicializador de estado al comienzo de CartProvider.
// - ¿Los totales no se actualizan? → Revisar las secciones
//   "TOTAL" e "ITEM COUNT" dentro de los cálculos derivados.
// - ¿El carrito no se guarda entre visitas? → Revisar el bloque
//   "PERSISTENCIA AUTOMÁTICA".
// - ¿Error al agregar un producto? → Revisar addToCart.
// ============================================================

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// ======== CONTEXTO DEL CARRITO ========
const CartContext = createContext();

export const CartProvider = ({ children }) => {

    // ======== CARGA INICIAL DEL CARRITO ========
    // Lee el carrito del navegador UNA sola vez, de forma instantánea,
    // antes de que React muestre nada en pantalla.
    //
    // IMPORTANTE: No usar useEffect para esto. Usando el inicializador
    // (función flecha en useState), se evita la condición de carrera
    // donde el guardado automático sobreescribía el carrito cargado
    // con un array vacío antes de que React procesara la actualización.
    //
    // ¿El carrito no carga los datos guardados? Revisar esta sección.
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('gaddyel_cart');
        if (!saved) return [];
        try {
            return JSON.parse(saved);
        } catch {
            // Los datos guardados están corruptos — arranca con carrito vacío
            localStorage.removeItem('gaddyel_cart');
            return [];
        }
    });

    // ======== PERSISTENCIA AUTOMÁTICA ========
    // Cada vez que el carrito cambia, lo guarda en el navegador
    // para que el usuario lo encuentre la próxima vez que visite la página.
    //
    // ¿El carrito no se guarda entre visitas? Revisar esta sección.
    useEffect(() => {
        localStorage.setItem('gaddyel_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // ======== ACCIONES DEL CARRITO ========

    // Agrega un producto al carrito.
    // Si el producto ya estaba, suma la cantidad indicada en lugar de duplicarlo.
    const addToCart = useCallback((producto, cantidad = 1) => {
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
    }, []);

    // Elimina un producto del carrito por completo.
    const removeFromCart = useCallback((productoId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productoId));
    }, []);

    // Cambia la cantidad de un producto específico.
    // Si la nueva cantidad es 0 o menos, lo elimina directamente.
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

    // Vacía el carrito por completo — se usa al finalizar una compra.
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    // ======== CÁLCULOS DERIVADOS ========
    // Estos valores se recalculan automáticamente cuando el carrito cambia.
    // No hace falta llamar ninguna función, siempre están actualizados.
    //
    // ¿Los totales no coinciden? Revisar las fórmulas a continuación.

    // Precio total de todos los productos (solo para mostrar en pantalla).
    // Los precios finales siempre los confirma el servidor al procesar el pago.
    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }, [cartItems]);

    // Cuántos artículos hay en total (suma de cantidad de cada producto).
    const itemCount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    }, [cartItems]);

    // Verdadero si el carrito está vacío, falso si tiene al menos un producto.
    const isEmpty = useMemo(() => cartItems.length === 0, [cartItems]);

    // ======== PREPARACIÓN PARA EL PAGO ========
    // Arma la lista simplificada que se envía al servidor al confirmar la compra.
    // Solo incluye el ID del producto y la cantidad — los precios los calcula el servidor.
    const getCartForCheckout = useCallback(() => {
        return cartItems.map(item => ({
            productoId: item._id,
            cantidad: item.cantidad
        }));
    }, [cartItems]);

    // ======== VALORES EXPUESTOS ========
    // Todo lo que los demás componentes pueden leer o usar del carrito.
    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartForCheckout,
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

// ======== ACCESO AL CARRITO ========
// Función de acceso para usar el carrito en cualquier componente de la página.
// ¿Error "useCart debe usarse dentro de CartProvider"? Verificar que el
// componente esté dentro del árbol que envuelve CartProvider en App.jsx.
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
};

export default CartContext;
