import React from 'react';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../Componentes/Layout/ScrollReveal/ScrollReveal.jsx';
import { NavLink } from 'react-router-dom';
import diseñopersonalizacion from '../Activos/Img-procesos/diseño-personalizacion.jpeg';
import seleccionmateriaprima from '../Activos/Img-procesos/seleccion-materiaprima.png';
import bordado from '../Activos/Img-procesos/bordado.jpeg';
import controlcalidad from '../Activos/Img-procesos/control-calidad.png';
import entrega from '../Activos/Img-procesos/empaquetado-envio.jpeg';
/**
 * ============================================================================
 * NUESTRO PROCESO - Página de transparencia de producción
 * ============================================================================
 * Muestra las 5 etapas del proceso de blanquería personalizada de Gaddyel.
 * Cada etapa incluye imagen representativa, número de paso, descripción
 * detallada y un detalle técnico diferenciador.
 *
 * LAYOUT:
 * - Desktop: Alternado (imagen izquierda/derecha por paso)
 * - Mobile: Vertical stack con imagen arriba y texto abajo
 *
 * IMÁGENES:
 * Temporalmente usa imágenes de Unsplash con temática textil/bordado.
 * Reemplazar con fotos reales del proceso de Gaddyel cuando estén disponibles.
 */

const procesos = [
    {
        paso: '01',
        title: 'Diseño y personalización',
        etiqueta: 'Punto de partida',
        description: 'Todo comienza con tu logo o idea. Nuestro equipo analiza los colores, el nivel de detalle y el tipo de prenda para traducir tu marca en un diseño digital optimizado para bordado. Este proceso no es automático: cada archivo es revisado y ajustado a mano para garantizar que el resultado final sea fiel a tu identidad visual.',
        detalle: 'Formato de entrega: archivo .DST optimizado para bordadora industrial.',
        image: diseñopersonalizacion,
        alt: 'Diseño digital de logo para bordado industrial - Proceso Gaddyel'
    },
    {
        paso: '02',
        title: 'Selección de materia prima',
        etiqueta: 'Calidad desde el origen',
        description: 'No todos los textiles son iguales. Seleccionamos cada tela evaluando gramaje, densidad del hilo y tolerancia al lavado industrial. Las vinchas, batas y toallas de Gaddyel están fabricadas con materiales que mantienen su forma, color y suavidad después de decenas de lavados. Esta selección es el primer filtro de calidad antes de tocar la bordadora.',
        detalle: 'Materia prima certificada: gramaje verificado por lote de producción.',
        image: seleccionmateriaprima,
        alt: 'Selección de telas y materia prima textil premium - Proceso Gaddyel'
    },
    {
        paso: '03',
        title: 'Bordado de precisión',
        etiqueta: 'El corazón del proceso',
        description: 'Usando bordadora industrial de múltiples cabezales, aplicamos tu diseño puntada a puntada sobre cada prenda. La densidad del bordado, la tensión del hilo y la velocidad de la máquina se calibran por tipo de tela. El resultado es un bordado limpio, con relieve natural, que no se deforma ni destiñe. Cada pieza es cargada y retirada de la máquina de forma individual.',
        detalle: 'Tecnología: bordadora industrial multi-cabezal con calibración por tejido.',
        image: bordado,
        alt: 'Bordado industrial de precisión con logo en blanquería - Proceso Gaddyel'
    },
    {
        paso: '04',
        title: 'Control de calidad',
        etiqueta: 'Cero tolerancia al defecto',
        description: 'Antes de salir de producción, cada pieza pasa por una revisión visual y táctil. Verificamos que el bordado esté centrado, que no haya hilos sueltos ni tensión incorrecta, y que la prenda no tenga manchas ni irregularidades en la tela. Las piezas que no cumplen con el estándar son retiradas del lote. Solo aprobamos lo que nosotros mismos usaríamos.',
        detalle: 'Revisión pieza a pieza: no se aprueba por muestreo, se inspecciona el 100% del pedido.',
        image: controlcalidad,
        alt: 'Control de calidad y revisión de blanquería personalizada - Proceso Gaddyel'
    },
    {
        paso: '05',
        title: 'Empaquetado y envío',
        etiqueta: 'Llegada en condiciones perfectas',
        description: 'Cada pedido se empaqueta de forma que las prendas lleguen sin arrugas, sin humedad y en el orden correcto. Utilizamos bolsas individuales por pieza y cajas reforzadas para el envío. Una vez despachado, te compartimos el número de seguimiento para que puedas monitorear la entrega. Trabajamos con Correos Argentinos que proporciona logística de alcance nacional para garantizar tiempos de entrega predecibles.',
        detalle: 'Envíos a todo el país con seguimiento en tiempo real.',
        image: entrega,
        alt: 'Empaquetado y envío de blanquería personalizada a todo el país - Proceso Gaddyel'
    }
];

const NuestroProceso = () => {
    return (
        <>
            <Helmet>
                <title>Nuestro Proceso de Personalización | Gaddyel Blanquería</title>
                <meta 
                    name="description" 
                    content="Conocé cómo llevamos a cabo la personalización de tu blanquería: desde el diseño hasta la entrega. Proceso transparente y garantizado."
                />
                <meta
                    name="keywords"
                    content="proceso personalización, bordado, diseño textiles, garantía, gaddyel"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://gaddyel.vercel.app/proceso" />
                <meta property="og:title" content="Nuestro Proceso - Gaddyel" />
                <meta property="og:description" content="Pasos claros para tu proyecto personalizado." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://gaddyel.vercel.app/proceso" />
            </Helmet>
            <div className="w-full min-h-screen bg-transparent">
                <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 pt-24 max-w-5xl">

                    {/* ===== ENCABEZADO CON ADN DE MARCA ===== */}
                    <ScrollReveal>
                        <header className="
                            text-center mb-16
                            px-8 py-12 md:px-12 md:py-16
                            bg-white/80 dark:bg-slate-900/80
                            backdrop-blur-xl
                            border border-slate-200/50 dark:border-slate-800/50
                            rounded-2xl shadow-xl
                        ">
                            <span className="
                                inline-flex items-center mb-5
                                text-[11px] font-semibold tracking-[0.15em] uppercase
                                text-indigo-700 dark:text-indigo-400
                                bg-indigo-50 dark:bg-indigo-950/60
                                border border-indigo-200/60 dark:border-indigo-800/60
                                px-4 py-1.5 rounded-full
                            ">
                                De tu logo a tus manos · 5 etapas garantizadas
                            </span>

                            <h1 className="
                                italic text-4xl md:text-6xl font-extrabold tracking-tight
                                text-slate-800 dark:text-slate-100
                                leading-tight mb-5
                            ">
                                Nuestro proceso de{' '}
                                <span className="text-indigo-700 dark:text-indigo-400">creación</span>
                            </h1>

                            <p className="
                                text-[16px] md:text-[17px] font-medium tracking-tight
                                text-slate-500 dark:text-slate-400
                                max-w-2xl mx-auto leading-relaxed
                            ">
                                Cada pieza de blanquería con tu logo atraviesa cinco etapas controladas.
                                Nada sale de producción sin pasar por cada una de ellas.
                            </p>
                        </header>
                    </ScrollReveal>

                    {/* ===== TIMELINE ALTERNADO ===== */}
                    {/*
                     * Layout:
                     * - Pasos impares (01, 03, 05): imagen izquierda, texto derecha
                     * - Pasos pares (02, 04): imagen derecha, texto izquierda
                     * - Mobile: siempre imagen arriba, texto abajo
                     */}
                    <div className="space-y-10">
                        {procesos.map((proceso, index) => {
                            const esImpar = index % 2 === 0;
                            return (
                                <ScrollReveal key={proceso.paso}>
                                    <article className="
                                        grid grid-cols-1 md:grid-cols-2 gap-0
                                        bg-white/80 dark:bg-slate-900/80
                                        backdrop-blur-xl
                                        border border-slate-200/50 dark:border-slate-800/50
                                        rounded-2xl shadow-lg overflow-hidden
                                        transition-all duration-500 ease-out
                                        hover:shadow-xl hover:border-indigo-200/60 dark:hover:border-indigo-800/60
                                    ">
                                        {/* Imagen: izquierda en impares, derecha en pares */}
                                        <div className={`relative overflow-hidden min-h-[240px] sm:min-h-[280px] md:h-full
                                            bg-slate-100 dark:bg-slate-800
                                            ${esImpar ? 'md:order-1' : 'md:order-2'}
                                        `}>
                                            <img
                                                src={proceso.image}
                                                alt={proceso.alt}
                                                className="absolute inset-0 w-full h-full object-cover object-center"
                                                loading="lazy"
                                            />
                                            {/* Overlay con número de paso */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" aria-hidden="true" />
                                            <span className="
                                                absolute bottom-5 left-5
                                                text-[64px] font-extrabold tracking-tighter
                                                text-white/40 leading-none select-none
                                            ">
                                                {proceso.paso}
                                            </span>
                                        </div>

                                        {/* Contenido de texto */}
                                        <div className={`
                                            flex flex-col justify-center
                                            p-8 md:p-10 lg:p-12
                                            ${ esImpar ? 'md:order-2' : 'md:order-1' }
                                        `}>
                                            {/* Etiqueta de etapa */}
                                            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                                                Paso {proceso.paso} · {proceso.etiqueta}
                                            </p>

                                            <h2 className="
                                                text-2xl md:text-3xl font-bold tracking-tight
                                                text-slate-900 dark:text-slate-100
                                                mb-4 border-l-4 border-indigo-500 dark:border-indigo-400 pl-5
                                            ">
                                                {proceso.title}
                                            </h2>

                                            <p className="
                                                text-[15px] font-medium tracking-tight
                                                text-slate-700 dark:text-slate-300
                                                leading-relaxed mb-6
                                            ">
                                                {proceso.description}
                                            </p>

                                            {/* Detalle técnico diferenciador */}
                                            <div className="
                                                flex items-start gap-3
                                                p-4
                                                bg-indigo-50/60 dark:bg-indigo-950/30
                                                border border-indigo-200/50 dark:border-indigo-800/40
                                                rounded-2xl
                                            ">
                                                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <p className="text-[13px] font-medium tracking-tight text-indigo-700 dark:text-indigo-300">
                                                    {proceso.detalle}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    {/* ===== CTA FINAL ===== */}
                    <ScrollReveal>
                        <footer className="
                            text-center mt-16
                            px-8 py-12
                            bg-white/80 dark:bg-slate-900/80
                            backdrop-blur-xl
                            border border-slate-200/50 dark:border-slate-800/50
                            rounded-2xl shadow-xl
                        ">
                            <p className="
                                text-[15px] font-medium tracking-tight
                                text-slate-600 dark:text-slate-400
                                max-w-xl mx-auto leading-relaxed mb-8
                            ">
                                ¿Listo para ver qué puede hacer Gaddyel por la identidad de tu Centro de Estética?
                                Explorá el catálogo o contactanos directamente para un presupuesto.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <NavLink
                                    to="/catalogo"
                                    className="
                                        inline-block font-semibold tracking-tight
                                        bg-indigo-600 hover:bg-indigo-700
                                        dark:bg-indigo-500 dark:hover:bg-indigo-600
                                        text-white py-3 px-8 rounded-full
                                        transition-all duration-500 ease-out
                                        hover:scale-105 shadow-lg hover:shadow-xl
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                    "
                                >
                                    Ver catálogo
                                </NavLink>
                                <NavLink
                                    to="/contacto"
                                    className="
                                        inline-block font-semibold tracking-tight
                                        bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800
                                        text-slate-700 dark:text-slate-300
                                        border border-slate-300 dark:border-slate-700
                                        py-3 px-8 rounded-full
                                        transition-all duration-500 ease-out
                                        hover:scale-105
                                        focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                                    "
                                >
                                    Pedir presupuesto
                                </NavLink>
                            </div>
                        </footer>
                    </ScrollReveal>

                </div>
            </div>
        </>
    );
};

export default NuestroProceso;
