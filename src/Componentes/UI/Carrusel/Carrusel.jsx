import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente Carrusel con mejoras profesionales.
 * Incluye: barra de progreso, swipe gestures, autoplay inteligente, zoom hover, overlay gradiente
 * @param {Array<Object>} imagenes - Array de objetos con src, alt, y caption opcional
 * @param {number} [intervalo=5000] - Tiempo entre cambios automáticos
 */
const Carrusel = ({ imagenes, intervalo = 5000 }) => {
    const [diapositivaActual, setDiapositivaActual] = useState(0);
    const [pausado, setPausado] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const timeoutRef = useRef(null);
    const progressIntervalRef = useRef(null);

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
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
    };

    const irSiguiente = () => {
        setDiapositivaActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
        setProgress(0);
    };

    const irAnterior = () => {
        setDiapositivaActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
        setProgress(0);
    };

    // Pausar cuando la ventana no está visible (performance)
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Autoplay inteligente con barra de progreso
    useEffect(() => {
        if (!pausado && isVisible) {
            resetTimeout();
            setProgress(0);
            
            // Barra de progreso
            const progressStep = 100 / (intervalo / 50);
            progressIntervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 0;
                    return prev + progressStep;
                });
            }, 50);

            timeoutRef.current = setTimeout(irSiguiente, intervalo);
        }
        return () => resetTimeout();
    }, [diapositivaActual, intervalo, imagenes.length, pausado, isVisible]);

    // Swipe gestures para móviles
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            irSiguiente();
            setPausado(true);
            setTimeout(() => setPausado(false), 3000);
        }
        if (isRightSwipe) {
            irAnterior();
            setPausado(true);
            setTimeout(() => setPausado(false), 3000);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <div className="relative w-[90vw] h-[80vh] mx-auto rounded-xl shadow-2xl group overflow-hidden">
            <div 
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${diapositivaActual * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {imagenes.map((imagen, index) => (
                    <div key={imagen.src} className="w-full h-full flex-shrink-0 relative overflow-hidden">
                        {/* Imagen con zoom en hover */}
                        <img
                            src={imagen.src}
                            alt={imagen.alt}
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            loading={index === diapositivaActual || index === diapositivaActual + 1 ? "eager" : "lazy"}
                        />
                        
                        {/* Overlay con gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Caption opcional */}
                        {imagen.caption && (
                            <div className="absolute bottom-20 left-0 right-0 text-white px-8 py-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-xl md:text-2xl font-bold drop-shadow-lg">{imagen.caption}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Barra de progreso animada */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
                <div 
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Botón de pausa/reanudar mejorado */}
            <button
                onClick={() => setPausado(!pausado)}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all z-20 border border-white/30"
                aria-label={pausado ? 'Reanudar carrusel' : 'Pausar carrusel'}
            >
                {pausado ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm8 0a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V4z" />
                    </svg>
                )}
            </button>

            {/* Controles de Navegación mejorados */}
            <button
                onClick={() => {
                    irAnterior();
                    setPausado(true);
                    setTimeout(() => setPausado(false), 3000);
                }}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/40 transition-all focus:outline-none z-20 opacity-0 group-hover:opacity-100 duration-300 border border-white/30"
                aria-label="Diapositiva anterior"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
            <button
                onClick={() => {
                    irSiguiente();
                    setPausado(true);
                    setTimeout(() => setPausado(false), 3000);
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/40 transition-all focus:outline-none z-20 opacity-0 group-hover:opacity-100 duration-300 border border-white/30"
                aria-label="Siguiente diapositiva"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>

            {/* Indicadores mejorados */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {imagenes.map((imagen, indice) => (
                    <button
                        key={imagen.src}
                        onClick={() => {
                            setDiapositivaActual(indice);
                            setProgress(0);
                            resetTimeout();
                            setPausado(true);
                            setTimeout(() => setPausado(false), 3000);
                        }}
                        className={`
                            transition-all duration-300 rounded-full
                            ${indice === diapositivaActual 
                                ? 'w-8 h-2 bg-white' 
                                : 'w-2 h-2 bg-white/60 hover:bg-white/80'}
                        `}
                        aria-label={`Ir a la diapositiva ${indice + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(Carrusel);