import React, { useState } from 'react';

/**
 * COMPONENTE: FaqItem - Pregunta frecuente con acordeón
 * 
 * ¿QUÉ HACE?
 * Muestra una pregunta que al hacer clic se expande para revelar la respuesta.
 * Usa un acordeón con animación suave para mejorar la experiencia del usuario.
 * 
 * ¿DÓNDE SE USA?
 * - Inicio.jsx (sección de preguntas frecuentes)
 * - SobreGaddyel.jsx (sección de preguntas frecuentes)
 * - Cualquier página que necesite mostrar FAQs
 * 
 * FLUJO:
 * 1. Usuario ve pregunta cerrada
 * 2. Usuario hace click → toggle isOpen (abre/cierra)
 * 3. Si está abierta: muestra respuesta con animación
 * 4. Ícono de flecha rota 180° cuando está abierto
 * 
 * ACCESIBILIDAD:
 * - aria-expanded: Indica si está abierto/cerrado
 * - aria-controls: Conecta botón con contenido
 * - Navegable con teclado (Enter/Space)
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.question - Texto de la pregunta
 * @param {string} props.answer - Texto de la respuesta
 * 
 * @example
 * <FaqItem 
 *   question="¿Cómo funciona el proceso de compra?" 
 *   answer="Podés realizar tu compra directamente desde nuestra web..." 
 * />
 */
const FaqItem = ({ question, answer }) => {
    // Estado para controlar si el acordeón está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);
    
    // ID único para conectar el botón con el contenido (accesibilidad)
    const id = `faq-${question.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className="border-b border-gray-200">
            {/* Botón que funciona como cabecera del acordeón */}
            <button
                className="w-full flex justify-between items-center py-4 px-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-300 rounded transition-colors duration-300 hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={id}
                type="button"
            >
                <span className="text-lg font-semibold text-gray-800 pr-4">
                    {question}
                </span>
                
                {/* Ícono de flecha que rota cuando está abierto */}
                <svg
                    className={`w-6 h-6 flex-shrink-0 transform transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-purple-600' : 'text-gray-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            
            {/* Contenido de la respuesta (solo visible cuando isOpen es true) */}
            {isOpen && (
                <div
                    id={id}
                    className="px-6 pb-4 text-gray-600 leading-relaxed transition-all duration-500 ease-in-out animate-fadeIn"
                    role="region"
                    aria-labelledby={`button-${id}`}
                >
                    {answer}
                </div>
            )}
        </div>
    );
};

// Nombre para debugging en React DevTools
FaqItem.displayName = 'FaqItem';

// Memoizar para evitar re-renders innecesarios si props no cambian
export default React.memo(FaqItem);
