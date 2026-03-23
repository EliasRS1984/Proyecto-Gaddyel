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
        <div className="border-b border-slate-200 dark:border-slate-700/60">
            {/* Botón que funciona como cabecera del acordeón */}
            <button
                className="w-full flex justify-between items-center py-4 px-6 text-left
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-inset
                    rounded-2xl
                    hover:bg-slate-50 dark:hover:bg-slate-800/50
                    transition-all duration-500 ease-out"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={id}
                type="button"
            >
                <span className="text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 pr-4">
                    {question}
                </span>
                
                {/* Ícono de flecha que rota cuando está abierto */}
                <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 ease-out ${
                        isOpen
                            ? 'rotate-180 text-indigo-500 dark:text-indigo-400'
                            : 'text-slate-400 dark:text-slate-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                    className="px-6 pb-5 text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed"
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
