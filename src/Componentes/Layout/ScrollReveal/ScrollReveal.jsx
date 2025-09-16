import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente que aplica un efecto de "revelación" (scroll-reveal) al desplazarse.
 * Envuelve el contenido que deseas animar.
 *
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los elementos a animar.
 * @returns {JSX.Element} Un div que aplica estilos de animación.
 */
const ScrollReveal = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        // Definimos el observador para detectar la visibilidad del elemento.
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Si el elemento es visible, actualizamos el estado y dejamos de observarlo.
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null, // El viewport es el área de referencia.
                rootMargin: '0px',
                threshold: 0.3, // El observador se activa cuando el 20% del elemento es visible.
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        // Función de limpieza para evitar fugas de memoria.
        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className="transition-all duration-1000 ease-in-out"
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(6rem)',
                opacity: isVisible ? 1 : 0,
            }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
