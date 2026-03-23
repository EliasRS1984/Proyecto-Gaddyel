import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ======================================================
 * ¿QUÉ ES ESTO?
 * Página de "pago pendiente" — en teoría, nunca debería mostrarse.
 *
 * ¿POR QUÉ NO SE USA?
 * El backend tiene binary_mode: true en la preferencia de Mercado Pago.
 * Eso significa que MP solo devuelve "aprobado" o "rechazado" —
 * el estado "pendiente" no existe en nuestro flujo de pago.
 *
 * ¿QUÉ HACE ESTA PÁGINA ENTONCES?
 * Si alguien llega aquí (por URL directa, bookmark antiguo, o error inesperado),
 * redirige automáticamente al inicio en lugar de mostrar una página rota.
 *
 * ¿DÓNDE BUSCAR SI ALGO FALLA?
 * - Si MP empieza a redirigir aquí: revisá binary_mode en MercadoPagoService.js
 * - Si querés rehabilitar pagos en efectivo (Rapipago/Pago Fácil):
 *   ponés binary_mode: false y restaurás la lógica de esta página
 * ======================================================
 */
export const PedidoPendiente = () => {
    const navigate = useNavigate();

    // Redirige inmediatamente al inicio — esta página no tiene uso activo
    useEffect(() => {
        navigate('/', { replace: true });
    }, [navigate]);

    // Pantalla vacía mientras se produce la redirección (fracción de segundo)
    return null;
};

export default PedidoPendiente;



