import React, { useEffect, useState } from 'react';

/**
 * ============================================================================
 * PARALLAX BACKGROUND - Efecto de Profundidad Profesional
 * ============================================================================
 *
 * ¿QUÉ ES ESTO?
 * Un fondo con efecto parallax nativo del navegador (CSS puro).
 * La imagen de fondo queda "fija" mientras el contenido scrollea encima,
 * creando sensación de profundidad sin JavaScript complejo.
 *
 * ¿CÓMO FUNCIONA?
 * - Desktop: background-attachment: fixed → la imagen NO se mueve con el scroll
 *   El contenido scrollea SOBRE la imagen → efecto parallax natural
 * - Mobile: background-attachment: scroll → la imagen scrollea normal
 *   (iOS Safari no soporta fixed en background-attachment)
 *
 * ¿POR QUÉ CSS en lugar de JavaScript?
 * - Más confiable: el navegador maneja el efecto nativamente
 * - Sin bugs de altura: la imagen cubre el viewport completo siempre
 * - Sin scroll extra: el contenedor tiene altura natural del contenido
 * - Mejor performance: sin event listeners ni re-renders por scroll
 *
 * ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
 * → "La imagen no se ve": Verificar que imageSrc sea una URL válida
 * → "El fondo no cubre bien": Ajustar backgroundSize
 * → "En iOS no funciona el parallax": Es esperado, mobile usa scroll normal
 */

const ParallaxBackground = ({
    children,
    imageSrc,
    className = '',
    overlay = true,
    overlayColor = 'bg-white/5',
    parallaxSpeed = 0.5, // Valor por defecto para el desplazamiento
}) => {
    // ========================================================================
    // CONTROL DE SCROLL PARA EFECTO DINÁMICO
    // ========================================================================
    const [isMobile, setIsMobile] = useState(false);
    const [offsetY, setOffsetY] = useState(0);
    const [pageProgress, setPageProgress] = useState(0); // 0 a 1

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        const handleScroll = () => {
            if (window.innerWidth >= 768) {
                const scrolled = window.pageYOffset;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                
                // Calculamos el progreso del scroll (0 al inicio, 1 al final en el footer)
                const progress = maxScroll > 0 ? scrolled / maxScroll : 0;
                
                setOffsetY(scrolled);
                setPageProgress(progress);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /**
     * LÓGICA DE SINCRONIZACIÓN PERFECTA:
     * Queremos que al recorrer TODA la página, recorramos TODA la imagen.
     * 
     * Formula: (0.5 - progreso) * amplitud
     * - Cuando progreso = 0 (inicio): la imagen está en su punto más bajo (ej: 80%)
     * - Cuando progreso = 0.5 (mitad): la imagen está centrada (50%)
     * - Cuando progreso = 1 (final/footer): la imagen está en su punto más alto (ej: 20%)
     * 
     * El valor de amplitud (ej: 40%) define qué tan rápido se mueve según el largo de la imagen.
     */
    const syncPosition = 50 + (0.5 - pageProgress) * 60; // 60% de amplitud para un recorrido elegante

    return (
        /*
         * CONTENEDOR PRINCIPAL
         * - backgroundPositionY: sincronizado dinámicamente con el progreso del scroll
         */
        <div
            className={`relative w-full ${className}`}
            style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: isMobile ? 'contain' : 'cover',
                backgroundPosition: isMobile ? 'top center' : `center ${syncPosition}%`,
                backgroundRepeat: isMobile ? 'repeat-y' : 'no-repeat',
                backgroundColor: isMobile ? '#f8fafc' : 'transparent',
                backgroundAttachment: isMobile ? 'scroll' : 'fixed',
                backgroundOrigin: 'border-box'
            }}
        >
            {/* ================================================================
                OVERLAY SUTIL (Opcional)
                Mejora el contraste del texto sobre el fondo
            ================================================================ */}
            {overlay && (
                <div
                    className={`absolute inset-0 ${overlayColor}`}
                    aria-hidden="true"
                />
            )}

            {/* ================================================================
                CONTENIDO
                Scrollea normalmente encima del fondo fijo
            ================================================================ */}
            <div className="relative" style={{ zIndex: 10 }}>
                {children}
            </div>
        </div>
    );
};

export default React.memo(ParallaxBackground);
