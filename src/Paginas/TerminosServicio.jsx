import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * TerminosServicio - Página de Términos y Condiciones de Servicio
 * 
 * FLUJO:
 * 1. Usuario hace click en "Términos de Servicio" en footer
 * 2. NavLink navega a /terminos-servicio
 * 3. useEffect hace scroll al top
 * 4. Página renderea con términos legales genéricos
 * 5. Usuario puede leer y modificar según necesidades de la empresa
 * 
 * SEO:
 * - Meta tags para SEO
 * - HTML5 semántico con <article> y <section>
 * - Estructura clara para lectores de pantalla
 */
const TerminosServicio = () => {
    // ✅ HELPER: Scroll al top al cargar página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <Helmet>
                <title>Términos de Servicio - Gaddyel</title>
                <meta name="description" content="Lee nuestros Términos y Condiciones de Servicio. Información sobre el uso de Gaddyel y nuestros productos." />
                <link rel="canonical" href={`${window.location.origin}/terminos-servicio`} />
            </Helmet>

            <article className="max-w-4xl mx-auto px-6 py-16 md:py-24 bg-white">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Términos y Condiciones de Servicio
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        Última actualización: {new Date().toLocaleDateString('es-AR')}
                    </p>
                    <p className="text-gray-700">
                        Al acceder y utilizar Gaddyel, aceptas estar vinculado por estos Términos y Condiciones.
                    </p>
                </header>

                {/* Contenido Principal */}
                <div className="space-y-8 text-gray-700 leading-relaxed">
                    {/* Sección 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de Términos</h2>
                        <p>
                            Al usar nuestro sitio web y realizar compras, confirmas que aceptas completamente estos Términos y Condiciones. 
                            Si no estás de acuerdo con alguno de estos términos, no debes usar nuestros servicios.
                        </p>
                    </section>

                    {/* Sección 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso Permitido</h2>
                        <p className="mb-4">
                            Al usar Gaddyel, te comprometes a:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Usar el sitio solo para propósitos legales y autorizados</li>
                            <li>No transmitir virus, malware o código dañino</li>
                            <li>No intentar acceso no autorizado a nuestros sistemas</li>
                            <li>No usar información de otros usuarios sin permiso</li>
                            <li>No interferir con el funcionamiento normal del sitio</li>
                        </ul>
                    </section>

                    {/* Sección 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cuentas de Usuario</h2>
                        <p className="mb-4">
                            Para acceder a ciertos servicios, debes crear una cuenta. Usted es responsable de:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Mantener la confidencialidad de tu contraseña</li>
                            <li>Proporcionar información precisa y actualizada</li>
                            <li>Aceptar responsabilidad por todas las actividades bajo tu cuenta</li>
                            <li>Notificar inmediatamente cualquier acceso no autorizado</li>
                        </ul>
                    </section>

                    {/* Sección 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Productos y Servicios</h2>
                        <p className="mb-4">
                            Gaddyel ofrece blanquería personalizada de alta calidad. Garantizamos que:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Los productos se describen con precisión en el catálogo</li>
                            <li>Los precios son exactos en el momento de la compra</li>
                            <li>Procesamos pedidos dentro de los plazos indicados</li>
                            <li>Los productos cumplen con estándares de calidad</li>
                        </ul>
                    </section>

                    {/* Sección 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Precios y Disponibilidad</h2>
                        <p className="mb-4">
                            Los precios están sujetos a cambios sin previo aviso. Gaddyel se reserva el derecho de:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Limitar las cantidades de compra por cliente</li>
                            <li>Rechazar o cancelar pedidos</li>
                            <li>Corregir errores en precios o descripciones</li>
                            <li>Descontinuar productos sin previo aviso</li>
                        </ul>
                    </section>

                    {/* Sección 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Proceso de Compra y Pago</h2>
                        <p className="mb-4">
                            Al realizar una compra en Gaddyel:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Confirmas que eres mayor de edad y autoridad legal</li>
                            <li>Proporcionas información de pago precisa</li>
                            <li>Aceptas ser responsable del costo total</li>
                            <li>Autorizas el cargo a tu método de pago</li>
                        </ul>
                        <p className="mt-4">
                            Utilizamos procesadores de pago seguros y encriptados.
                        </p>
                    </section>

                    {/* Sección 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Envíos y Entregas</h2>
                        <p className="mb-4">
                            Gaddyel procesa envíos a través de empresas logísticas asociadas:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Los tiempos de entrega son estimados, no garantizados</li>
                            <li>El cliente es responsable de proporcionar dirección correcta</li>
                            <li>Reclamos por daños se deben reportar en 48 horas</li>
                            <li>Consulta el estado del envío con tu número de seguimiento</li>
                        </ul>
                    </section>

                    {/* Sección 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Política de Devoluciones</h2>
                        <p className="mb-4">
                            Aceptamos devoluciones dentro de 30 días de la compra si:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>El producto está en perfecto estado</li>
                            <li>Incluye etiquetas originales y embalaje</li>
                            <li>Se solicita dentro del plazo establecido</li>
                            <li>No es un pedido personalizado completado</li>
                        </ul>
                        <p className="mt-4">
                            El cliente corre con los gastos de envío de retorno, excepto en caso de defecto de fábrica.
                        </p>
                    </section>

                    {/* Sección 9 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Garantía</h2>
                        <p className="mb-4">
                            Todos los productos Gaddyel incluyen garantía de 12 meses contra defectos de fabricación:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Cubre defectos no causados por mal uso</li>
                            <li>No cubre desgaste normal o daño accidental</li>
                            <li>Contacta a nuestro equipo para reclamaciones de garantía</li>
                        </ul>
                    </section>

                    {/* Sección 10 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Responsabilidad Limitada</h2>
                        <p>
                            Gaddyel no es responsable por: daños incidentales, pérdida de ganancias, interrupción de negocio, 
                            pérdida de datos o cualquier otro daño indirecto que surja del uso de nuestros servicios. 
                            Nuestra responsabilidad total no excederá el monto pagado por el producto.
                        </p>
                    </section>

                    {/* Sección 11 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Propiedad Intelectual</h2>
                        <p>
                            Todo contenido en el sitio de Gaddyel, incluyendo texto, imágenes, logos y diseños, están protegidos por 
                            derechos de autor. No puedes reproducir, distribuir o usar este contenido sin permiso explícito de Gaddyel.
                        </p>
                    </section>

                    {/* Sección 12 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Cambios a los Términos</h2>
                        <p>
                            Gaddyel se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigor 
                            cuando se publican en el sitio. El uso continuado del sitio después de cambios constituye aceptación de los nuevos términos.
                        </p>
                    </section>

                    {/* Sección 13 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contacto</h2>
                        <p className="mb-4">
                            Para preguntas sobre estos Términos y Condiciones, contáctanos:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="mb-2"><strong>Email:</strong> gaddyel.gaddyel@gmail.com</p>
                            <p className="mb-2"><strong>Teléfono:</strong> +54 9 11 5509-8426</p>
                            <p><strong>Ubicación:</strong> Virrey del Pino, Buenos Aires</p>
                        </div>
                    </section>
                </div>

                {/* Footer de términos */}
                <footer className="mt-16 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Estos Términos y Condiciones son válidos desde {new Date().toLocaleDateString('es-AR')}.
                    </p>
                </footer>
            </article>
        </>
    );
};

export default React.memo(TerminosServicio);
