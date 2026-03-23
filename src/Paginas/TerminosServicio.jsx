// ============================================================
// ¿QUÉ ES ESTO?
// Página legal: Términos y Condiciones de Servicio
//
// ¿CÓMO FUNCIONA?
// 1. El usuario llega desde un link en el footer
// 2. Hace scroll automático al top
// 3. Muestra los términos legales con estructura semántica
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Contenido a actualizar → editar directamente las secciones de abajo
// - Fecha no actualiza → el componente usa new Date() dinámico
// ============================================================

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const TerminosServicio = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <Helmet>
                <title>Términos de Servicio - Gaddyel</title>
                <meta name="description" content="Lee nuestros Términos y Condiciones de Servicio. Información sobre el uso de Gaddyel y nuestros productos." />
                {/* Hardcoded: window.location.origin falla en pre-render/SSR y puede variar entre entornos. */}
                <link rel="canonical" href="https://gaddyel.vercel.app/terminos-servicio" />
            </Helmet>

            {/* Fondo consistente con el resto del sitio */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 transition-colors duration-500">
            <article className="max-w-3xl mx-auto">
                    {/* ======== CABECERA ======== */}
                    <header className="mb-10">
                        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-500 dark:text-indigo-400 mb-4">
                            Documento legal
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-3">
                            Términos y Condiciones de Servicio
                        </h1>
                        <p className="text-[14px] font-medium tracking-tight text-slate-500 dark:text-slate-400 mb-6">
                            Última actualización: {new Date().toLocaleDateString('es-AR')}
                        </p>
                        <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl px-6 py-4">
                            <p className="text-[14px] tracking-tight text-slate-700 dark:text-slate-300 leading-relaxed">
                                Al acceder y utilizar Gaddyel, aceptás estar vinculado por estos Términos y Condiciones.
                            </p>
                        </div>
                    </header>

                    {/* ======== CONTENIDO LEGAL ======== */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden">

                        {[
                            {
                                titulo: '1. Aceptación de Términos',
                                texto: 'Al usar nuestro sitio web y realizar compras, confirmás que aceptás completamente estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no debés usar nuestros servicios.'
                            },
                            {
                                titulo: '2. Uso Permitido',
                                contenido: 'Al usar Gaddyel, te comprometés a:',
                                items: [
                                    'Usar el sitio solo para propósitos legales y autorizados',
                                    'No transmitir virus, malware o código dañino',
                                    'No intentar acceso no autorizado a nuestros sistemas',
                                    'No usar información de otros usuarios sin permiso',
                                    'No interferir con el funcionamiento normal del sitio',
                                ]
                            },
                            {
                                titulo: '3. Cuentas de Usuario',
                                contenido: 'Para acceder a ciertos servicios, debés crear una cuenta. Sos responsable de:',
                                items: [
                                    'Mantener la confidencialidad de tu contraseña',
                                    'Proporcionar información precisa y actualizada',
                                    'Aceptar responsabilidad por todas las actividades bajo tu cuenta',
                                    'Notificar inmediatamente cualquier acceso no autorizado',
                                ]
                            },
                            {
                                titulo: '4. Productos y Servicios',
                                contenido: 'Gaddyel ofrece blanquería personalizada de alta calidad. Garantizamos que:',
                                items: [
                                    'Los productos se describen con precisión en el catálogo',
                                    'Los precios son exactos en el momento de la compra',
                                    'Procesamos pedidos dentro de los plazos indicados',
                                    'Los productos cumplen con estándares de calidad',
                                ]
                            },
                            {
                                titulo: '5. Precios y Disponibilidad',
                                contenido: 'Los precios están sujetos a cambios sin previo aviso. Gaddyel se reserva el derecho de:',
                                items: [
                                    'Limitar las cantidades de compra por cliente',
                                    'Rechazar o cancelar pedidos',
                                    'Corregir errores en precios o descripciones',
                                    'Descontinuar productos sin previo aviso',
                                ]
                            },
                            {
                                titulo: '6. Proceso de Compra y Pago',
                                contenido: 'Al realizar una compra en Gaddyel:',
                                items: [
                                    'Confirmás que sos mayor de edad y tenés autoridad legal',
                                    'Proporcionás información de pago precisa',
                                    'Aceptás ser responsable del costo total',
                                    'Autorizás el cargo a tu método de pago',
                                ],
                                nota: 'Utilizamos procesadores de pago seguros y encriptados.'
                            },
                            {
                                titulo: '7. Envíos y Entregas',
                                contenido: 'Gaddyel procesa envíos a través de empresas logísticas asociadas:',
                                items: [
                                    'Los tiempos de entrega son estimados, no garantizados',
                                    'El cliente es responsable de proporcionar dirección correcta',
                                    'Reclamos por daños se deben reportar en 48 horas',
                                    'Consultá el estado del envío con tu número de seguimiento',
                                ]
                            },
                            {
                                titulo: '8. Política de Devoluciones',
                                contenido: 'Aceptamos devoluciones dentro de 30 días de la compra si:',
                                items: [
                                    'El producto está en perfecto estado',
                                    'Incluye etiquetas originales y embalaje',
                                    'Se solicita dentro del plazo establecido',
                                    'No es un pedido personalizado completado',
                                ],
                                nota: 'El cliente corre con los gastos de envío de retorno, excepto en caso de defecto de fábrica.'
                            },
                            {
                                titulo: '9. Garantía',
                                contenido: 'Todos los productos Gaddyel incluyen garantía de 12 meses contra defectos de fabricación:',
                                items: [
                                    'Cubre defectos no causados por mal uso',
                                    'No cubre desgaste normal o daño accidental',
                                    'Contactá a nuestro equipo para reclamaciones de garantía',
                                ]
                            },
                            {
                                titulo: '10. Responsabilidad Limitada',
                                texto: 'Gaddyel no es responsable por: daños incidentales, pérdida de ganancias, interrupción de negocio, pérdida de datos o cualquier otro daño indirecto que surja del uso de nuestros servicios. Nuestra responsabilidad total no excederá el monto pagado por el producto.'
                            },
                            {
                                titulo: '11. Propiedad Intelectual',
                                texto: 'Todo contenido en el sitio de Gaddyel, incluyendo texto, imágenes, logos y diseños, están protegidos por derechos de autor. No podés reproducir, distribuir o usar este contenido sin permiso explícito de Gaddyel.'
                            },
                            {
                                titulo: '12. Cambios a los Términos',
                                texto: 'Gaddyel se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigor cuando se publican en el sitio. El uso continuado del sitio después de cambios constituye aceptación de los nuevos términos.'
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
                                13. Contacto
                            </h2>
                            <p className="text-[14px] tracking-tight text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                Para preguntas sobre estos Términos y Condiciones, contactanos:
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
                            Estos Términos y Condiciones son válidos desde {new Date().toLocaleDateString('es-AR')}.
                        </p>
                    </footer>

                </article>
            </div>
        </>
    );
};

export default React.memo(TerminosServicio);
