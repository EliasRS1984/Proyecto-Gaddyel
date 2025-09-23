import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente Carrusel.
 * Muestra una secuencia de imágenes que cambian automáticamente o manualmente.
 * @param {Array<Object>} imagenes - Un array de objetos con las propiedades `src` (URL de la imagen) y `alt` (texto alternativo).
 * @param {number} [intervalo=5000] - El tiempo en milisegundos entre cada cambio de diapositiva (por defecto es 5 segundos).
 */
const Carrusel = ({ imagenes, intervalo = 5000 }) => {
    const [diapositivaActual, setDiapositivaActual] = useState(0);
    const [pausado, setPausado] = useState(false); // Mejora: Estado para pausar/reanudar
    const timeoutRef = useRef(null);

    if (!imagenes || imagenes.length === 0) {
        return (
            <div className="bg-gray-200 h-[80vh] flex items-center justify-center rounded-lg shadow-md mb-12 w-full text-gray-700 text-xl">
                <p>No hay imágenes disponibles para el carrusel.</p>
            </div>
        );
    }

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const irSiguiente = () => {
        setDiapositivaActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    };

    const irAnterior = () => {
        setDiapositivaActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (!pausado) {
            resetTimeout();
            timeoutRef.current = setTimeout(irSiguiente, intervalo);
        }
        return () => resetTimeout();
    }, [diapositivaActual, intervalo, imagenes.length, pausado]);

    return (
        <div className="relative w-[90vw] h-[80vh] mx-auto rounded-xl shadow-2xl group overflow-hidden">
            <div 
                className="flex h-full transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${diapositivaActual * 100}%)` }}
            >
                {imagenes.map((imagen) => (
                    <div key={imagen.src} className="w-full h-full flex-shrink-0">
                        <img
                            src={imagen.src}
                            alt={imagen.alt}
                            className="w-full h-full object-cover object-center" // Único cambio en CSS: object-center para centrar
                            loading="lazy" // Mejora: Optimización de carga
                        />
                    </div>
                ))}
            </div>

            {/* Mejora: Botón de pausa/reanudar */}
            <button
                onClick={() => setPausado(!pausado)}
                className="absolute top-4 right-4 bg-black bg-opacity-30 text-white p-2 rounded-full z-10"
                aria-label={pausado ? 'Reanudar carrusel' : 'Pausar carrusel'}
            >
                {pausado ? '▶️' : '⏸️'}
            </button>

            {/* Controles de Navegación (Flechas) */}
            <button
                onClick={() => {
                    irAnterior();
                    setPausado(true);
                    setTimeout(() => setPausado(false), 5000);
                }}
                onKeyDown={(e) => { // Mejora: Accesibilidad por teclado
                    if (e.key === 'Enter' || e.key === ' ') irAnterior();
                }}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-3 rounded-full hover:bg-opacity-70 transition-all focus:outline-none z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 duration-300"
                aria-label="Diapositiva anterior"
            >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
            <button
                onClick={() => {
                    irSiguiente();
                    setPausado(true);
                    setTimeout(() => setPausado(false), 5000);
                }}
                onKeyDown={(e) => { // Mejora: Accesibilidad por teclado
                    if (e.key === 'Enter' || e.key === ' ') irSiguiente();
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-3 rounded-full hover:bg-opacity-70 transition-all focus:outline-none z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 duration-300"
                aria-label="Siguiente diapositiva"
            >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>

            {/* Indicadores de Diapositivas (Puntos) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {imagenes.map((imagen, indice) => (
                    <button
                        key={imagen.src} // Mejora: Clave única
                        onClick={() => {
                            setDiapositivaActual(indice);
                            resetTimeout();
                            setPausado(true);
                            setTimeout(() => setPausado(false), 5000);
                        }}
                        onKeyDown={(e) => { // Mejora: Accesibilidad por teclado
                            if (e.key === 'Enter' || e.key === ' ') {
                                setDiapositivaActual(indice);
                                resetTimeout();
                                setPausado(true);
                                setTimeout(() => setPausado(false), 5000);
                            }
                        }}
                        className={`
                            w-2 h-2 md:w-3 md:h-3 rounded-full bg-white transition-all duration-300 transform
                            ${indice === diapositivaActual ? 'bg-opacity-100 scale-125' : 'bg-opacity-60 hover:bg-opacity-80'}
                        `}
                        aria-label={`Ir a la diapositiva ${indice + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(Carrusel); // Mejora: Optimización de rendimiento