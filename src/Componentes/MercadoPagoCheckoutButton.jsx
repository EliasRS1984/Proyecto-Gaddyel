import { useEffect, useState, useRef } from 'react';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { createPreference } from '../Servicios/mercadoPagoService';

// =====================================================================
// ¿QUÉ ES ESTO?
// Botón de pago oficial de Mercado Pago usando Wallet Brick (SDK v2).
// No es un botón común: Mercado Pago renderiza su propia UI dentro
// del contenedor <div id="walletBrick_container">.
//
// ¿CÓMO FUNCIONA? (3 pasos en orden)
// 1. Carga el script del SDK de Mercado Pago en el browser
// 2. Llama al backend para crear una "preferencia de pago" (precio, ítems, URLs de retorno)
// 3. Pide al SDK que dibuje el Wallet Brick en el div contenedor
// → El usuario hace click en el Brick → MP redirige al checkout oficial
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Brick no aparece      → Revisar PASO 3 (renderBrick) y el div walletBrick_container
// - Error "preferenceId"  → Revisar PASO 2 (getPref) y el servicio createPreference
// - Error "SDK no carga"  → Revisar PASO 1 (initMP) y VITE_MERCADO_PAGO_PUBLIC_KEY en .env
// - Brick duplicado       → Revisar cleanup del useEffect del PASO 3 (brickController.unmount)
//
// SEGURIDAD:
// - Cumple PCI-DSS: datos de tarjeta nunca pasan por nuestro servidor
// - Device fingerprint automático para anti-fraude (lo hace MP internamente)
// - JWT en headers de todas las llamadas al backend (interceptor de Axios)
//
// @param {string} props.ordenId - ID de la orden en MongoDB (REQUERIDO)
// =====================================================================

export const MercadoPagoCheckoutButton = ({ ordenId }) => {
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [mp, setMp]                     = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);

    // Referencia al controlador del Brick — permite destruirlo limpiamente al desmontar
    const brickController = useRef(null);

    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

    // ======== PASO 1: CARGAR EL SDK DE MERCADO PAGO ========
    // Solo se ejecuta una vez cuando el componente aparece en pantalla.
    // ¿El SDK ya cargó antes? Lo detecta automáticamente (loadMercadoPago es idempotente).
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
                if (isMounted) setError('No se pudo cargar el sistema de pago. Verificá tu conexión.');
            }
        };

        if (!mp && publicKey) initMP();
        return () => { isMounted = false; };
    }, [publicKey]);

    // ======== PASO 2: CREAR PREFERENCIA DE PAGO ========
    // Se activa cuando el SDK ya está listo (mp existe).
    // Si ya tiene un preferenceId válido, no vuelve a pedir uno (evita duplicados).
    // ¿Qué es una preferencia? Un objeto en Mercado Pago que contiene precio, descripción y URLs de retorno.
    useEffect(() => {
        if (!mp || !ordenId || preferenceId) return;

        const getPref = async () => {
            try {
                const { preferenceId: prefId } = await createPreference(ordenId);
                setPreferenceId(prefId);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'No se pudo iniciar el checkout. Intentá de nuevo.');
                setLoading(false);
            }
        };

        getPref();
    }, [mp, ordenId, preferenceId]);

    // ======== PASO 3: DIBUJAR EL WALLET BRICK ========
    // Se activa cuando tenemos SDK + preferenceId y el Brick todavía no fue creado.
    // El SDK de MP dibuja su propia UI dentro del div walletBrick_container.
    // CLEANUP: Cuando el componente se desmonta (usuario navega), se llama a
    // brickController.unmount() — método oficial del SDK para destruir el Brick limpiamente.
    // (Referencia: https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks/wallet-brick/default-rendering)
    useEffect(() => {
        if (!mp || !preferenceId || brickController.current) return;

        const renderBrick = async () => {
            const bricksBuilder = mp.bricks();

            brickController.current = await bricksBuilder.create(
                'wallet',
                'walletBrick_container',
                {
                    initialization: { preferenceId },
                    customization: {
                        texts: { action: 'pay', valueProp: 'security_safety' }
                    },
                    callbacks: {
                        onReady: () => { /* Brick visible, no se necesita acción */ },
                        onError: () => setError('Ocurrió un error en el checkout de Mercado Pago.')
                    }
                }
            );
        };

        renderBrick();

        // Cleanup oficial: destruye el Brick si el usuario navega a otra página
        return () => {
            if (brickController.current) {
                brickController.current.unmount();
                brickController.current = null;
            }
        };
    }, [mp, preferenceId]);

    // ======== ESTADO: CARGANDO ========
    if (loading) {
        return (
            <div className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl">
                <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-200 dark:border-slate-700 border-t-indigo-500"></div>
                    <span className="text-[14px] font-medium tracking-tight text-slate-600 dark:text-slate-300">
                        Preparando el checkout...
                    </span>
                </div>
            </div>
        );
    }

    // ======== ESTADO: ERROR ========
    // El botón "Reintentar" resetea el preferenceId para que el useEffect del PASO 2
    // vuelva a ejecutarse sin recargar la página completa.
    if (error) {
        return (
            <div className="w-full px-5 py-4 bg-red-50/60 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 rounded-2xl">
                <p className="text-[13px] font-semibold tracking-tight text-red-700 dark:text-red-400 mb-3">
                    {error}
                </p>
                <button
                    onClick={() => {
                        // Resetea el estado para re-ejecutar el PASO 2 sin recargar la página
                        setError(null);
                        setPreferenceId(null);
                        setLoading(true);
                    }}
                    className="text-[13px] font-medium tracking-tight text-red-600 dark:text-red-400
                               hover:text-red-800 dark:hover:text-red-300 underline underline-offset-2
                               transition-colors duration-500 ease-out"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // ======== WALLET BRICK + INFO DE SEGURIDAD ========
    return (
        <div className="w-full space-y-4">

            {/* MP renderiza su botón oficial aquí — no modificar el id */}
            <div id="walletBrick_container" className="w-full"></div>

            {/* Indicador de seguridad */}
            <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[13px] tracking-tight">Pago 100% seguro con Mercado Pago</span>
            </div>

            {/* Métodos de pago disponibles */}
            <div className="text-center text-[12px] tracking-tight text-slate-400 dark:text-slate-500 space-y-0.5">
                <p>Tarjetas de crédito y débito · Transferencia · Efectivo</p>
                <p>Hasta 12 cuotas sin interés</p>
            </div>

        </div>
    );
};

export default MercadoPagoCheckoutButton;
