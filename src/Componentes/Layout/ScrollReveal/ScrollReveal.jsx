// ============================================================
// ¿QUÉ ES ESTO?
// Componente que hace aparecer contenido con una animación
// suave cuando el usuario llega hasta él al hacer scroll.
//
// ¿CÓMO FUNCIONA?
// 1. El contenido empieza invisible y desplazado hacia abajo
// 2. Cuando el usuario baja con el scroll y el elemento
//    entra en pantalla (al menos un 20%), se dispara la animación
// 3. El contenido aparece desplazándose hacia arriba y el fade se activa
// 4. La animación ocurre una sola vez por elemento
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El contenido no aparece? Verificar que el componente padre
//   no tenga overflow:hidden que bloquee el IntersectionObserver
// ¿La animación se ve cortada? Ajustar el threshold (actualmente 20%)
// ============================================================

import { useState, useEffect, useRef } from 'react';

// ======== CONFIGURACIÓN DEL OBSERVADOR ========
// El observador vigila cuándo cada elemento entra en el área visible del navegador.
// threshold 0.2 = se activa cuando el 20% del elemento ya está visible.
const OBSERVER_OPTIONS = {
    threshold: 0.2,
};

const ScrollReveal = ({ children }) => {
    // Controla si el elemento ya es visible (empieza oculto)
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        // Capturamos el elemento en una variable local.
        // Es importante hacerlo aquí porque cuando React desmonta el componente,
        // elementRef.current se pone en null ANTES de ejecutar la limpieza —
        // si usáramos elementRef.current directamente en el return, podría fallar.
        const element = elementRef.current;
        if (!element) return;

        // Creamos el observador que vigilará cuándo el elemento entra en pantalla
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                // El elemento entró en pantalla: activamos la animación
                setIsVisible(true);
                // Dejamos de vigilarlo — la animación solo ocurre una vez
                observer.unobserve(entry.target);
            }
        }, OBSERVER_OPTIONS);

        observer.observe(element);

        // Cuando el componente desaparece de la página, limpiamos el observador
        // para no dejar procesos activos en memoria
        return () => observer.unobserve(element);
    }, []);

    // ======== ANIMACIÓN ========
    // Antes de entrar: invisible + desplazado 24px hacia abajo
    // Al entrar en pantalla: visible + en su posición original
    // La transición dura 700ms con ease-out (aceleración al inicio, frena al final)
    return (
        <div
            ref={elementRef}
            className={`transition-all duration-700 ease-out ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
            }`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
