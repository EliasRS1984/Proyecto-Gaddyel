import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * PoliticaPrivacidad - Página de Política de Privacidad
 * 
 * FLUJO:
 * 1. Usuario hace click en "Política de Privacidad" en footer
 * 2. NavLink navega a /politica-privacidad
 * 3. useEffect hace scroll al top
 * 4. Página renderea con contenido legal genérico
 * 5. Usuario puede leer y modificar según necesidades de la empresa
 * 
 * SEO:
 * - Meta tags para SEO
 * - HTML5 semántico con <article> y <section>
 * - Estructura clara para lectores de pantalla
 */
const PoliticaPrivacidad = () => {
    // ✅ HELPER: Scroll al top al cargar página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <Helmet>
                <title>Política de Privacidad - Gaddyel</title>
                <meta name="description" content="Conoce cómo Gaddyel protege y utiliza tus datos personales. Política de privacidad completa y actualizada." />
                <link rel="canonical" href={`${window.location.origin}/politica-privacidad`} />
            </Helmet>

            <article className="max-w-4xl mx-auto px-6 py-16 md:py-24 bg-white">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Política de Privacidad
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        Última actualización: {new Date().toLocaleDateString('es-AR')}
                    </p>
                    <p className="text-gray-700">
                        En Gaddyel, tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información.
                    </p>
                </header>

                {/* Contenido Principal */}
                <div className="space-y-8 text-gray-700 leading-relaxed">
                    {/* Sección 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información que Recopilamos</h2>
                        <p className="mb-4">
                            Recopilamos información que proporcionas directamente, tales como:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li><strong>Información de Contacto:</strong> nombre, email, teléfono y dirección</li>
                            <li><strong>Información de Cuenta:</strong> datos de autenticación y preferencias de usuario</li>
                            <li><strong>Información de Transacción:</strong> historial de pedidos y métodos de pago</li>
                            <li><strong>Información de Navegación:</strong> cookies, dirección IP y comportamiento en sitio web</li>
                        </ul>
                    </section>

                    {/* Sección 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cómo Usamos tu Información</h2>
                        <p className="mb-4">
                            Utilizamos tu información para:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Proporcionar y mejorar nuestros productos y servicios</li>
                            <li>Procesar transacciones y envíos</li>
                            <li>Comunicarte sobre pedidos, actualizaciones y promociones</li>
                            <li>Personalizar tu experiencia en nuestro sitio</li>
                            <li>Cumplir con obligaciones legales y normativas</li>
                        </ul>
                    </section>

                    {/* Sección 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Protección de Datos</h2>
                        <p className="mb-4">
                            Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Encriptación SSL/TLS en todas las transmisiones de datos</li>
                            <li>Autenticación de dos factores para cuentas de usuario</li>
                            <li>Acceso restringido a información personal</li>
                            <li>Auditorías regulares de seguridad</li>
                        </ul>
                    </section>

                    {/* Sección 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies y Tecnologías de Rastreo</h2>
                        <p className="mb-4">
                            Utilizamos cookies y tecnologías similares para:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Mantener tu sesión activa</li>
                            <li>Recordar tus preferencias</li>
                            <li>Analizar el tráfico del sitio</li>
                            <li>Mejorar la experiencia de usuario</li>
                        </ul>
                        <p className="mt-4">
                            Puedes controlar o eliminar cookies a través de la configuración de tu navegador.
                        </p>
                    </section>

                    {/* Sección 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compartir Información con Terceros</h2>
                        <p className="mb-4">
                            No vendemos tu información personal. Solo compartimos datos cuando es necesario para:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Procesar pagos (procesadores de pago autorizados)</li>
                            <li>Gestionar envíos (empresas logísticas asociadas)</li>
                            <li>Cumplir con leyes y regulaciones</li>
                        </ul>
                    </section>

                    {/* Sección 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Derechos del Usuario</h2>
                        <p className="mb-4">
                            Tienes derecho a:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            <li>Acceder a tus datos personales</li>
                            <li>Solicitar la corrección de información incorrecta</li>
                            <li>Eliminar tu cuenta y datos personales</li>
                            <li>Optar por no recibir comunicaciones de marketing</li>
                            <li>Revocar consentimientos previos</li>
                        </ul>
                    </section>

                    {/* Sección 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
                        <p>
                            Conservamos tu información personal el tiempo necesario para cumplir con los propósitos descritos en esta política, 
                            o según lo requiera la ley. Puedes solicitar la eliminación de tus datos en cualquier momento contactándonos.
                        </p>
                    </section>

                    {/* Sección 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cambios a Esta Política</h2>
                        <p>
                            Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos 
                            publicando la versión actualizada en nuestro sitio con una nueva fecha de "Última actualización".
                        </p>
                    </section>

                    {/* Sección 9 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contacto</h2>
                        <p className="mb-4">
                            Si tienes preguntas sobre esta política de privacidad o deseas ejercer tus derechos, contáctanos:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="mb-2"><strong>Email:</strong> gaddyel.gaddyel@gmail.com</p>
                            <p className="mb-2"><strong>Teléfono:</strong> +54 9 11 5509-8426</p>
                            <p><strong>Ubicación:</strong> Virrey del Pino, Buenos Aires</p>
                        </div>
                    </section>
                </div>

                {/* Footer de política */}
                <footer className="mt-16 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Esta política de privacidad es válida desde {new Date().toLocaleDateString('es-AR')} y puede ser modificada en cualquier momento.
                    </p>
                </footer>
            </article>
        </>
    );
};

export default React.memo(PoliticaPrivacidad);
