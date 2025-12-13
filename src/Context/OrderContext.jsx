import React, { createContext, useContext, useState, useEffect } from 'react';
import orderService from '../Servicios/orderService';

/**
 * OrderContext - Gestiona el estado global de órdenes
 * Proporciona acceso a:
 * - Orden actual en proceso
 * - Orden completada/confirmada
 * - Historial de órdenes
 * - Funciones para crear, actualizar, recuperar órdenes
 */
const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Orden en proceso (para checkout)
  const [currentOrder, setCurrentOrder] = useState(null);

  // Última orden confirmada (post-checkout)
  const [lastOrder, setLastOrder] = useState(() => {
    try {
      const stored = localStorage.getItem('lastOrder');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Estado de la última orden
  const [lastOrderStatus, setLastOrderStatus] = useState(() => {
    return localStorage.getItem('lastOrderStatus') || null;
  });

  // Error de la última operación
  const [lastError, setLastError] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Persistir última orden en localStorage cuando cambia
  useEffect(() => {
    if (lastOrder) {
      localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
    } else {
      localStorage.removeItem('lastOrder');
    }
  }, [lastOrder]);

  // Persistir estado de orden en localStorage
  useEffect(() => {
    if (lastOrderStatus) {
      localStorage.setItem('lastOrderStatus', lastOrderStatus);
    } else {
      localStorage.removeItem('lastOrderStatus');
    }
  }, [lastOrderStatus]);

  /**
   * Crea una nueva orden
   * @param {Object} checkoutData - Datos del formulario de checkout
   * @param {Array} cartItems - Items del carrito
   * @returns {Promise<Object>} Respuesta de la orden
   */
  const createOrder = async (checkoutData, cartItems) => {
    setIsLoading(true);
    setLastError(null);

    try {
      const response = await orderService.createOrder(checkoutData, cartItems);

      // Guardar como última orden confirmada
      setLastOrder(response);
      setLastOrderStatus('pending_payment');
      setCurrentOrder(null); // Limpiar orden en proceso

      // Limpiar localStorage viejo de múltiples keys
      localStorage.removeItem('lastOrderData');
      localStorage.removeItem('lastOrderTotal');
      localStorage.removeItem('lastOrderNumber');
      localStorage.removeItem('lastOrderShipping');

      return response;
    } catch (error) {
      const errorMessage = error.message || 'Error al crear la orden';
      setLastError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene una orden por ID
   * @param {string} orderId - ID de la orden
   * @returns {Promise<Object>} Detalles de la orden
   */
  const getOrder = async (orderId) => {
    setIsLoading(true);
    setLastError(null);

    try {
      const order = await orderService.getOrder(orderId);
      
      // Actualizar estado si es la orden actual
      if (order.ordenId === lastOrder?.ordenId) {
        setLastOrder(order);
        setLastOrderStatus(order.estado);
      }

      return order;
    } catch (error) {
      setLastError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reintentar pago de una orden
   * @param {string} orderId - ID de la orden
   * @returns {Promise<Object>} Respuesta con nuevo enlace de pago
   */
  const retryPayment = async (orderId) => {
    setIsLoading(true);
    setLastError(null);

    try {
      const response = await orderService.retryPayment(orderId);
      
      if (response.ordenId === lastOrder?.ordenId) {
        setLastOrder(response);
      }

      return response;
    } catch (error) {
      setLastError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza el estado de la última orden
   * @param {string} newStatus - Nuevo estado
   */
  const updateOrderStatus = (newStatus) => {
    setLastOrderStatus(newStatus);
    if (lastOrder) {
      setLastOrder({
        ...lastOrder,
        estado: newStatus
      });
    }
  };

  /**
   * Limpia la orden actual y el estado
   */
  const clearOrder = () => {
    setCurrentOrder(null);
    setLastOrder(null);
    setLastOrderStatus(null);
    setLastError(null);
    localStorage.removeItem('lastOrder');
    localStorage.removeItem('lastOrderStatus');
  };

  /**
   * Limpia solo el error
   */
  const clearError = () => {
    setLastError(null);
  };

  const value = {
    // Estado
    currentOrder,
    lastOrder,
    lastOrderStatus,
    lastError,
    isLoading,

    // Acciones
    createOrder,
    getOrder,
    retryPayment,
    updateOrderStatus,
    clearOrder,
    clearError,

    // Utilidades
    hasLastOrder: !!lastOrder,
    lastOrderId: lastOrder?.ordenId || null
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

/**
 * Hook para usar OrderContext
 * @returns {Object} Contexto de órdenes
 */
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe usarse dentro de OrderProvider');
  }
  return context;
};

export default OrderContext;
