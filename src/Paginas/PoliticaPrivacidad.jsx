// ============================================================
// ¿QUÉ ES ESTO?
// Página legal: Política de Privacidad
//
// ¿CÓMO FUNCIONA?
// 1. El usuario llega desde un link en el footer
// 2. Hace scroll automático al top
// 3. Muestra el contenido legal con estructura semántica
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Contenido a actualizar → editar directamente las secciones de abajo
// - Fecha no actualiza → el componente usa new Date() dinámico
// ============================================================

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const PoliticaPrivacidad = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <Helmet>
                <title>Política de Privacidad - Gaddyel</title>
                <meta name="description" content="Conoce cómo Gaddyel protege y utiliza tus datos personales. Política de privacidad completa y actualizada." />
                {/* Hardcoded: window.location.origin falla en pre-render/SSR y puede variar entre entornos. */}
                <link rel="canonical" href="https://gaddyel.vercel.app/politica-privacidad" />
            </Helmet>

            {/* Fondo consistente con el resto del sitio */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 transition-colors duration-500">
                <article className="max-w-3xl mx-auto">

                    {/* ======== CABECERA ======== */}
                    <header className="mb-10">
                        {/* Etiqueta de categoría */}
                        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-500 dark:text-indigo-400 mb-4">
                            Documento legal
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-3">
                            Política de Privacidad
                        </h1>
                        <p className="text-[14px] font-medium tracking-tight text-slate-500 dark:text-slate-400 mb-6">
                            Última actualización: {new Date().toLocaleDateString('es-AR')}
                        </p>
                        {/* Card intro */}
                        <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl px-6 py-4">
                            <p className="text-[14px] tracking-tight text-slate-700 dark:text-slate-300 leading-relaxed">
                                En Gaddyel, tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información.
                            </p>
                        </div>
                    </header>

                    {/* ======== CONTENIDO LEGAL ======== */}
                    {/* Card principal que contiene todas las secciones */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden">

                        {[
                            {
                                titulo: '1. Información que Recopilamos',
                                contenido: 'Recopilamos información que proporcionas directamente, tales como:',
                                items: [
                                    <><strong className="text-slate-700 dark:text-slate-300">Información de Contacto:</strong> nombre, email, teléfono y dirección</>,
                                    <><strong className="text-slate-700 dark:text-slate-300">Información de Cuenta:</strong> datos de autenticación y preferencias de usuario</>,
                                    <><strong className="text-slate-700 dark:text-slate-300">Información de Transacción:</strong> historial de pedidos y métodos de pago</>,
                                    <><strong className="text-slate-700 dark:text-slate-300">Información de Navegación:</strong> cookies, dirección IP y comportamiento en sitio web</>,
                                ]
                            },
                            {
                                titulo: '2. Cómo Usamos tu Información',
                                contenido: 'Utilizamos tu información para:',
                                items: [
                                    'Proporcionar y mejorar nuestros productos y servicios',
                                    'Procesar transacciones y envíos',
                                    'Comunicarte sobre pedidos, actualizaciones y promociones',
                                    'Personalizar tu experiencia en nuestro sitio',
                                    'Cumplir con obligaciones legales y normativas',
                                ]
                            },
                            {
                                titulo: '3. Protección de Datos',
                                contenido: 'Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información:',
                                items: [
                                    'Encriptación SSL/TLS en todas las transmisiones de datos',
                                    'Autenticación de dos factores para cuentas de usuario',
                                    'Acceso restringido a información personal',
                                    'Auditorías regulares de seguridad',
                                ]
                            },
                            {
                                titulo: '4. Cookies y Tecnologías de Rastreo',
                                contenido: 'Utilizamos cookies y tecnologías similares para:',
                                items: [
                                    'Mantener tu sesión activa',
                                    'Recordar tus preferencias',
                                    'Analizar el tráfico del sitio',
                                    'Mejorar la experiencia de usuario',
                                ],
                                nota: 'Puedes controlar o eliminar cookies a través de la configuración de tu navegador.'
                            },
                            {
                                titulo: '5. Compartir Información con Terceros',
                                contenido: 'No vendemos tu información personal. Solo compartimos datos cuando es necesario para:',
                                items: [
                                    'Procesar pagos (procesadores de pago autorizados)',
                                    'Gestionar envíos (empresas logísticas asociadas)',
                                    'Cumplir con leyes y regulaciones',
                                ]
                            },
                            {
                                titulo: '6. Derechos del Usuario',
                                contenido: 'Tenés derecho a:',
                                items: [
                                    'Acceder a tus datos personales',
                                    'Solicitar la corrección de información incorrecta',
                                    'Eliminar tu cuenta y datos personales',
                                    'Optar por no recibir comunicaciones de marketing',
                                    'Revocar consentimientos previos',
                                ]
                            },
                            {
                                titulo: '7. Retención de Datos',
                                texto: 'Conservamos tu información personal el tiempo necesario para cumplir con los propósitos descritos en esta política, o según lo requiera la ley. Podés solicitar la eliminación de tus datos en cualquier momento contactándonos.'
                            },
                            {
                                titulo: '8. Cambios a Esta Política',
                                texto: 'Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la versión actualizada en nuestro sitio con una nueva fecha de "Última actualización".'
                            },
                        ].map(({ titulo, contenido, items, nota, texto }, i, arr) => (
                            <section
                                key={titulo}
                                className={`px-8 py-7 ${
                                    i < arr.length - 1
                                        ? 'border-b border-slate-100 dark:border-slate-800/60'
                                        : ''
                                }`}
                            >
                                {/* Título de sección con acento indigo a la izquierda */}
                                <h2 className="flex items-center gap-3 text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-200 mb-3">
                                    <span className="w-0.5 h-4 bg-indigo-400 dark:bg-indigo-500 rounded-full flex-shrink-0" aria-hidden="true" />
                                    {titulo}
                                </h2>
                                {contenido && (
                                    <p className="text-[14px] tracking-tight text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                        {contenido}
                                    </p>
                                )}
                                {texto && (
                                    <p className="text-[14px] tracking-tight text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {texto}
                                    </p>
                                )}
                                {items && (
                                    <ul className="space-y-2">
                                        {items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-2.5 text-[14px] tracking-tight text-slate-600 dark:text-slate-400 leading-relaxed">
                                                <span className="w-1 h-1 rounded-full bg-indigo-400 dark:bg-indigo-500 flex-shrink-0 mt-2" aria-hidden="true" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {nota && (
                                    <p className="mt-3 text-[14px] tracking-tight text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {nota}
                                    </p>
                                )}
                            </section>
                        ))}

                        {/* ======== SECCIÓN CONTACTO ======== */}
                        <section className="px-8 py-7">
                            <h2 className="flex items-center gap-3 text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-200 mb-3">
                                <span className="w-0.5 h-4 bg-indigo-400 dark:bg-indigo-500 rounded-full flex-shrink-0" aria-hidden="true" />
                                9. Contacto
                            </h2>
                            <p className="text-[14px] tracking-tight text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                Si tenés preguntas sobre esta política o deseás ejercer tus derechos, contactanos:
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl px-6 py-5 space-y-2">
                                <p className="text-[14px] tracking-tight text-slate-700 dark:text-slate-300">
                                    <span className="font-semibold">Email:</span> gaddyel.gaddyel@gmail.com
                                </p>
                                <p className="text-[14px] tracking-tight text-slate-700 dark:text-slate-300">
                                    <span className="font-semibold">Teléfono:</span> +54 9 11 5509-8426
                                </p>
                                <p className="text-[14px] tracking-tight text-slate-700 dark:text-slate-300">
                                    <span className="font-semibold">Ubicación:</span> Virrey del Pino, Buenos Aires
                                </p>
                            </div>
                        </section>

                    </div>

                    {/* ======== PIE DE PÁGINA LEGAL ======== */}
                    <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-[12px] tracking-tight text-slate-400 dark:text-slate-500">
                            Esta política de privacidad es válida desde {new Date().toLocaleDateString('es-AR')} y puede ser modificada en cualquier momento.
                        </p>
                    </footer>

                </article>
            </div>
        </>
    );
};

export default React.memo(PoliticaPrivacidad);
