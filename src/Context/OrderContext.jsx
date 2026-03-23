// ============================================================
// ¿QUÉ ES ESTO?
// El "almacén" del estado de pedidos. Guarda qué pedido está en
// proceso, cuál fue el último pedido confirmado, y si algo salió
// mal durante la creación o consulta de un pedido.
// Esta información está disponible para toda la página sin
// necesidad de pasarla componente por componente.
//
// ¿CÓMO FUNCIONA?
// 1. Al abrir la página, recupera el úlimo pedido guardado en el
//    navegador (si no expiró en los últimos 7 días).
// 2. Cuando el usuario confirma una compra, crea el pedido en el
//    servidor y lo guarda localmente como respaldo.
// 3. Cada vez que el estado del pedido cambia, lo actualiza tanto
//    en memoria como en el navegador de forma automática.
// 4. Si el pedido almacenado es muy antiguo, lo limpia al iniciar.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿El pedido no se crea? → Revisar la sección "CREAR PEDIDO"
//   y el archivo Servicios/orderService.js.
// - ¿El último pedido no aparece al volver a la página? →
//   Revisar la sección "CARGA INICIAL DEL PEDIDO".
// - ¿El estado del pedido no se actualiza? → Revisar la sección
//   "ACTUALIZAR ESTADO DEL PEDIDO".
// - ¿El pedido persiste cuando no debería? → Revisar clearOrder
//   en la sección "LIMPIAR PEDIDO".
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import orderService from '../Servicios/orderService';
import orderStorage from '../utils/orderStorage';
import { logger } from '../utils/logger';

// ======== CONTEXTO DE PEDIDOS ========
const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Pedido en proceso (datos del checkout antes de confirmar)
  const [currentOrder, setCurrentOrder] = useState(null);

  // ======== CARGA INICIAL DEL PEDIDO ========
  // Lee el último pedido guardado en el navegador al abrir la página.
  // Si el pedido tiene más de 7 días, orderStorage lo descarta solo.
  //
  // ¿El último pedido no aparece al volver a la página?
  // Revisar orderStorage.getOrder() en utils/orderStorage.js.
  const [lastOrder, setLastOrder] = useState(() => {
    return orderStorage.getOrder() || null;
  });

  const [lastOrderStatus, setLastOrderStatus] = useState(() => {
    return orderStorage.getStatus() || null;
  });

  // Mensaje del último error que ocurrió (null si no hay error)
  const [lastError, setLastError] = useState(null);

  // Verdadero mientras se espera respuesta del servidor
  const [isLoading, setIsLoading] = useState(false);

  // ======== LIMPIEZA DE PEDIDOS ANTIGUOS ========
  // Al abrir la página, revisa si hay pedidos expirados y los elimina.
  useEffect(() => {
    const wasCleanedUp = orderStorage.cleanup();
    if (wasCleanedUp) {
      logger.info('[OrderContext] Órdenes antiguas limpiadas');
      setLastOrder(null);
      setLastOrderStatus(null);
    }
  }, []);

  // ======== PERSISTENCIA AUTOMÁTICA ========
  // Cada vez que el pedido o su estado cambia, lo guarda en el navegador.
  // Si el pedido se borra (null), también lo borra del navegador.
  useEffect(() => {
    if (lastOrder) {
      orderStorage.save(lastOrder, lastOrderStatus || 'pending_payment');
    } else {
      orderStorage.clear();
    }
  }, [lastOrder, lastOrderStatus]);

  // ======== CREAR PEDIDO ========
  // Envía los datos del checkout al servidor y guarda el pedido resultante.
  // Si algo falla, el error queda en `lastError` para mostrarlo en pantalla.
  //
  // ¿El pedido no se crea? Revisar orderService.createOrder en
  // Servicios/orderService.js y verificar que el servidor responda.
  const createOrder = async (checkoutData, cartItems) => {
    setIsLoading(true);
    setLastError(null);

    try {
      const response = await orderService.createOrder(checkoutData, cartItems);

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

  // ======== CONSULTAR PEDIDO ========
  // Busca los datos actualizados de un pedido en el servidor por su ID.
  // Si es el mismo pedido que ya estaba guardado, actualiza los datos locales.
  const getOrder = async (orderId) => {
    setIsLoading(true);
    setLastError(null);

    try {
      const order = await orderService.getOrder(orderId);
      
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

  // ======== REINTENTAR PAGO ========
  // Solicita al servidor un nuevo enlace de pago para un pedido que
  // no pudo completar el pago anteriormente.
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

  // ======== ACTUALIZAR ESTADO DEL PEDIDO ========
  // Cambia el estado del último pedido (ej: de 'pending_payment' a 'approved').
  // El cambio se refleja tanto en memoria como en el navegador automáticamente
  // a través de la persistencia automática definida más arriba.
  const updateOrderStatus = (newStatus) => {
    setLastOrderStatus(newStatus);
    if (lastOrder) {
      setLastOrder({
        ...lastOrder,
        estado: newStatus
      });
    }
  };

  // ======== LIMPIAR PEDIDO ========
  // Borra todos los datos del pedido en memoria.
  // El borrado del navegador ocurre automáticamente cuando `lastOrder`
  // se vuelve null (ver sección "PERSISTENCIA AUTOMÁTICA" arriba).
  //
  // ¿El pedido sigue apareciendo después de limpiar?
  // Revisar el useEffect de persistencia automática.
  const clearOrder = () => {
    setCurrentOrder(null);
    setLastOrder(null);
    setLastOrderStatus(null);
    setLastError(null);
  };

  // Borra solo el mensaje de error sin tocar el pedido.
  const clearError = () => {
    setLastError(null);
  };

  // ======== VALORES EXPUESTOS ========
  // Todo lo que los demás componentes pueden leer o usar sobre pedidos.
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

// ======== ACCESO AL CONTEXTO DE PEDIDOS ========
// Función de acceso para usar el contexto de pedidos en cualquier
// componente de la página.
// ¿Error "useOrder debe usarse dentro de OrderProvider"? Verificar que
// el componente esté dentro del árbol que envuelve OrderProvider en App.jsx.
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe usarse dentro de OrderProvider');
  }
  return context;
};

export default OrderContext;
