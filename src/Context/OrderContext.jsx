import React, { createContext, useContext, useState, useEffect } from 'react';
import orderService from '../Servicios/orderService';
import orderStorage from '../utils/orderStorage';
import { logger } from '../utils/logger';

/**
 * OrderContext - Gestiona el estado global de órdenes
 * ✅ Ahora usa orderStorage centralizado para localStorage
 * 
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

  // ✅ Última orden confirmada usando orderStorage centralizado
  const [lastOrder, setLastOrder] = useState(() => {
    const stored = orderStorage.getOrder();
    return stored || null;
  });

  // ✅ Estado de la última orden usando orderStorage
  const [lastOrderStatus, setLastOrderStatus] = useState(() => {
    return orderStorage.getStatus() || null;
  });

  // Error de la última operación
  const [lastError, setLastError] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Limpiar órdenes antiguas al montar
  useEffect(() => {
    const wasCleanedUp = orderStorage.cleanup();
    if (wasCleanedUp) {
      logger.info('[OrderContext] Órdenes antiguas limpiadas');
      setLastOrder(null);
      setLastOrderStatus(null);
    }
  }, []);

  // ✅ Persistir usando orderStorage centralizado
  useEffect(() => {
    if (lastOrder) {
      orderStorage.save(lastOrder, lastOrderStatus || 'pending_payment');
    } else {
      orderStorage.clear();
    }
  }, [lastOrder, lastOrderStatus]);

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

      // ✅ Guardar usando orderStorage (limpia automáticamente keys antiguas)
      setLastOrder(response);
      setLastOrderStatus('pending_payment');
      setCurrentOrder(null);

      logger.success('[OrderContext] Orden creada y guardada:', response.ordenId);

      return response;
    } catch (error) {
      const errorMessage = error.message || 'Error al crear la orden';
      setLastError(errorMessage);
      logger.error('[OrderContext] Error creando orden:', errorMessage);
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
