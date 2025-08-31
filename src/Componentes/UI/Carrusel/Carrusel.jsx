import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente Carrusel.
 * Muestra una secuencia de imágenes que cambian automáticamente o manualmente.
 * @param {Array<Object>} imagenes - Un array de objetos con las propiedades `src` (URL de la imagen) y `alt` (texto alternativo).
 * @param {number} [intervalo=5000] - El tiempo en milisegundos entre cada cambio de diapositiva (por defecto es 5 segundos).
 */
const Carrusel = ({ imagenes, intervalo = 5000 }) => {
    const [diapositivaActual, setDiapositivaActual] = useState(0);
    // useRef se usa para mantener una referencia al temporizador del carrusel,
    // lo que evita que se reinicie en cada renderizado.
    const timeoutRef = useRef(null);

    // Mensaje de error si no se proporcionan imágenes.
    if (!imagenes || imagenes.length === 0) {
        return (
            <div className="bg-gray-200 h-64 md:h-96 flex items-center justify-center rounded-lg shadow-md mb-12 w-full text-gray-700 text-xl">
                <p>No hay imágenes disponibles para el carrusel.</p>
            </div>
        );
    }

    // Función para limpiar el temporizador actual.
    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    // Función para avanzar a la siguiente diapositiva.
    const irSiguiente = () => {
        setDiapositivaActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    };

    // Función para retroceder a la diapositiva anterior.
    const irAnterior = () => {
        setDiapositivaActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
    };

    // useEffect para el cambio automático de diapositivas.
    // Se ejecuta cada vez que `diapositivaActual` cambia.
    useEffect(() => {
        resetTimeout();
        // Establece un nuevo temporizador para la siguiente diapositiva.
        timeoutRef.current = setTimeout(irSiguiente, intervalo);

        // Función de limpieza que se ejecuta cuando el componente se desmonta.
        return () => {
            resetTimeout();
        };
    }, [diapositivaActual, intervalo, imagenes.length]);

    return (
        // Contenedor principal del carrusel.
        // Usamos `max-w-[960px]` para limitar el ancho en pantallas grandes.
        // `mx-auto` lo centra horizontalmente. `group` permite controlar los elementos hijos al pasar el mouse sobre el padre.
        <div className="relative w-full max-w-[960px] mx-auto rounded-xl shadow-2xl group overflow-hidden">

            {/* Contenedor de las imágenes.
          La altura se ajusta de forma responsiva para mantener la relación de aspecto.
          La altura (`h-[]`) cambia en diferentes puntos de interrupción (`sm`, `md`, `lg`)
          para un diseño adaptable. */}
            <div className="relative h-[200px] sm:h-[280px] md:h-[320px] lg:h-[360px] w-full">
                {imagenes.map((imagen, indice) => (
                    <img
                        key={indice}
                        src={imagen.src}
                        alt={imagen.alt}
                        className={`
              absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out transform
              ${indice === diapositivaActual ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            `}
                    />
                ))}
                {/* Overlay para mejorar el contraste del texto y dar un efecto visual. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            </div>

            {/* Controles de Navegación (Flechas) */}
            <button
                onClick={irAnterior}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-3 rounded-full hover:bg-opacity-70 transition-all focus:outline-none z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 duration-300"
                aria-label="Diapositiva anterior"
            >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button
                onClick={irSiguiente}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-3 rounded-full hover:bg-opacity-70 transition-all focus:outline-none z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 duration-300"
                aria-label="Siguiente diapositiva"
            >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Indicadores de Diapositivas (Puntos) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {imagenes.map((_, indice) => (
                    <button
                        key={indice}
                        onClick={() => {
                            setDiapositivaActual(indice);
                            resetTimeout();
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

export default Carrusel;
