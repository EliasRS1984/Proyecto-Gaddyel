// ============================================================
// ¿QUÉ ES ESTO?
// Una función que devuelve mensajes de carga que cambian con el tiempo.
// 
// ¿POR QUÉ EXISTE?
// El servidor de Render puede tardar hasta 50 segundos en despertar
// cuando nadie lo usó en los últimos 15 minutos. Durante ese tiempo
// el usuario ve una pantalla de carga. Sin contexto, después de 3-4
// segundos el usuario puede creer que el sitio está roto y irse.
//
// Este archivo hace que el mensaje cambie progresivamente para
// explicarle al usuario que la espera es normal y que no se vaya.
//
// ¿CÓMO FUNCIONA?
// 1. Al empezar a cargar, empieza a contar el tiempo.
// 2. Según cuánto tiempo pasó, devuelve un mensaje diferente:
//    - 0-5s:  Mensaje normal de carga
//    - 5-15s: Avisa que el servidor está iniciando
//    - 15s+:  Explica que es la primera visita del día (cold start)
// 3. Cuando los datos cargan, el contador se detiene solo.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿El mensaje no cambia? Verificar que se llame con loading=true
// - ¿El contador no para? Verificar que loading pase a false al cargar
// ============================================================

import { useState, useEffect, useRef } from 'react';

// ======== MENSAJES POR ETAPA ========
// Cada etapa tiene un texto y un submensaje opcional.
// Los tiempos están en milisegundos.
const ETAPAS = [
    {
        desde: 0,
        mensaje: 'Cargando...',
        submensaje: null
    },
    {
        desde: 5000,
        mensaje: 'El servidor está iniciando...',
        submensaje: null
    },
    {
        desde: 15000,
        mensaje: 'Un momento más...',
        submensaje: 'En la primera visita del día el servidor necesita unos segundos para arrancar.'
    },
    {
        desde: 35000,
        mensaje: 'Ya casi está...',
        submensaje: 'El servidor tardó un poco más de lo habitual. Gracias por esperar.'
    }
];

/**
 * Devuelve el mensaje apropiado según el tiempo transcurrido en carga.
 * 
 * @param {boolean} loading - true mientras los datos no llegaron
 * @returns {{ mensaje: string, submensaje: string|null, isLong: boolean }}
 *   isLong = true cuando ya pasaron 15+ segundos (para mostrar UI diferente)
 */
const useLoadingMessage = (loading) => {
    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!loading) {
            // Los datos llegaron: reinicia el contador para la próxima vez
            clearInterval(intervalRef.current);
            setElapsed(0);
            return;
        }

        // Empieza a contar cada segundo mientras carga
        setElapsed(0);
        intervalRef.current = setInterval(() => {
            setElapsed(prev => prev + 1000);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [loading]);

    // Busca la etapa más avanzada que ya se alcanzó
    const etapaActual = [...ETAPAS]
        .reverse()
        .find(etapa => elapsed >= etapa.desde) || ETAPAS[0];

    return {
        mensaje: etapaActual.mensaje,
        submensaje: etapaActual.submensaje,
        isLong: elapsed >= 15000
    };
};

export default useLoadingMessage;
