import { useEffect, useState, useRef } from 'react';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { createPreference } from '../Servicios/mercadoPagoService';

/**
 *  MERCADO PAGO WALLET BRICK - ESTÁNDARES 2025
 * 
 * FLUJO CON WALLET BRICK:
 * 1. Componente monta  Inicializa SDK de Mercado Pago
 * 2. Crea preferencia en backend  Obtiene preferenceId
 * 3. Renderiza Wallet Brick de Mercado Pago (botón oficial)
 * 4. Usuario click en Wallet Brick  MP redirige automáticamente
 * 5. Usuario paga  MP redirige a URLs configuradas en preferencia
 * 
 * VENTAJAS WALLET BRICK:
 * - UI oficial y optimizada de Mercado Pago
 * - Mejor conversión (diseño probado por MP)
 * - Responsive automático
 * - Actualizado automáticamente por MP
 * 
 * SEGURIDAD:
 * - Cumple con PCI-DSS (datos de tarjeta no tocan nuestro servidor)
 * - Device fingerprint automático para anti-fraude
 * - JWT en headers para autenticación
 * 
 * @param {Object} props
 * @param {string} props.ordenId - ID de la orden en MongoDB (REQUERIDO)
 */


export const MercadoPagoCheckoutButton = ({ ordenId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mp, setMp] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);
    const brickController = useRef(null); // Para controlar la instancia del botón

    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

    // PASO 1: Inicializar SDK (Solo una vez)
    useEffect(() => {
        let isMounted = true;
        const initMP = async () => {
            try {
                await loadMercadoPago();
                if (isMounted) {
                    const mpInstance = new window.MercadoPago(publicKey, { locale: 'es-AR' });
                    setMp(mpInstance);
                }
            } catch (err) {
                if (isMounted) setError('Error cargando SDK');
            }
        };
        if (!mp && publicKey) initMP();
        return () => { isMounted = false; };
    }, [publicKey]);

    // PASO 2: Crear preferencia
    useEffect(() => {
        if (!mp || !ordenId || preferenceId) return; // Si ya hay preferenceId, no pedir otra

        const getPref = async () => {
            try {
                const { preferenceId: prefId } = await createPreference(ordenId);
                setPreferenceId(prefId);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        getPref();
    }, [mp, ordenId, preferenceId]);

    // PASO 3: Renderizar Wallet Brick
    useEffect(() => {
        if (!mp || !preferenceId || brickController.current) return;

        const renderBrick = async () => {
            const bricksBuilder = mp.bricks();
            // Guardamos el controlador para poder destruirlo si el componente se desmonta
            brickController.current = await bricksBuilder.create(
                'wallet',
                'walletBrick_container',
                {
                    initialization: { preferenceId },
                    customization: {
                        texts: { action: 'pay', valueProp: 'security_safety' }
                    },
                    callbacks: {
                        onReady: () => console.log('Brick listo'),
                        onError: (e) => setError('Error en el checkout')
                    }
                }
            );
        };

        renderBrick();

        // CLEANUP: Esto evita que el botón se duplique o falle al navegar
        return () => {
            if (brickController.current) {
                // Si el SDK permite un método .unmount() o similar, se llama aquí
                // En MP Bricks, simplemente limpiar el innerHTML ayuda si no hay unmount
                const container = document.getElementById('walletBrick_container');
                if (container) container.innerHTML = '';
                brickController.current = null;
            }
        };
    }, [mp, preferenceId]);



    // Estados de UI
    if (loading) {
        return (
            <div className="w-full p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-700 font-medium">Preparando checkout de Mercado Pago...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-semibold mb-2"> {error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        setLoading(true);
                        window.location.reload();
                    }}
                    className="text-red-600 underline text-sm hover:text-red-800 font-medium"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    //  WALLET BRICK CONTAINER
    return (
        <div className="w-full space-y-4">
            {/* Container para Wallet Brick (Mercado Pago lo renderiza aquí) */}
            <div
                id="walletBrick_container"
                //ref={walletContainerRef}
                className="w-full"
            ></div>

            {/* Información de seguridad */}
            <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Pago 100% seguro con Mercado Pago</span>
            </div>

            {/* Métodos de pago aceptados */}
            <div className="text-center text-xs text-gray-500">
                <p>Tarjetas de crédito y débito  Transferencia  Efectivo</p>
                <p className="mt-1">Hasta 12 cuotas sin interés</p>
            </div>
        </div>
    );
};

export default MercadoPagoCheckoutButton;
