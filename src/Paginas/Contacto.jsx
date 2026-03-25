import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SOCIAL_URLS } from '../constants/contactInfo';

// Importa las imágenes de los iconos. Asegúrate de que estos archivos estén en la misma carpeta que este componente.
import whatsappIcono from '../Activos/Imagenes/whatsapp-icono.png';
import instagramIcono from '../Activos/Imagenes/instagram-icono.png';
import facebookIcono from '../Activos/Imagenes/facebook-icono.png';

const Contacto = () => {
    return (
        <>
            <Helmet>
                <title>Contactar Gaddyel | Personalización de Blanquería para Estética y Spa</title>
                <meta 
                    name="description" 
                    content="Contactanos para conocer nuestras opciones de personalización. Asesoramiento gratuito sobre bordado de logos, mínimos y envíos a todo Argentina."
                />
                <meta
                    name="keywords"
                    content="contactar gaddyel, asesor personalización, bordado logos, blanquería personalizada, consulta gratis"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://gaddyel.vercel.app/contacto" />
                <meta property="og:title" content="Contacto - Gaddyel Blanquería Personalizada" />
                <meta property="og:description" content="Estamos aquí para ayudarte. Consulta sin cargo sobre tu proyecto de personalización." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://gaddyel.vercel.app/contacto" />
                <meta property="og:image" content="https://gaddyel.vercel.app/og-contact.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
            </Helmet>
            <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-4 md:p-8 lg:p-12 pt-24">
                <div className="
                    bg-white/80 dark:bg-slate-900/80
                    backdrop-blur-xl
                    border border-slate-200/50 dark:border-slate-800/50
                    rounded-2xl shadow-2xl 
                    p-8 md:p-16 
                    w-full max-w-5xl 
                    text-center
                    transition-all duration-500 ease-out
                ">
                    {/* ===== ENCABEZADO CON ADN DE MARCA ===== */}
                    <header className="mb-12">
                        <span className="
                            inline-flex items-center mb-5
                            text-[11px] font-semibold tracking-[0.15em] uppercase
                            text-indigo-700 dark:text-indigo-400
                            bg-indigo-50 dark:bg-indigo-950/60
                            border border-indigo-200/60 dark:border-indigo-800/60
                            px-4 py-1.5 rounded-full
                        ">
                            Atención Personalizada · Asesoramiento
                        </span>
                        
                        <h1 className="
                            italic text-4xl md:text-6xl font-extrabold tracking-tight
                            text-slate-800 dark:text-slate-100
                            leading-tight mb-6
                        ">
                            Comenzá a potenciar <br className="hidden md:block" />
                            <span className="text-indigo-700 dark:text-indigo-400">tu identidad profesional.</span>
                        </h1>
                        
                        <p className="text-[15px] md:text-[17px] font-medium tracking-tight text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Elegí el canal que prefieras. Estamos listos para asesorarte y elevar tu identidad profesional.
                        </p>
                    </header>

                    {/* ===== GRID DE CONTACTO PREMIUM ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                        {/* WhatsApp - El canal principal B2B */}
                        <a
                            href={SOCIAL_URLS.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group
                                flex flex-col items-center p-8 
                                bg-slate-50/50 dark:bg-slate-800/50
                                border border-slate-200/60 dark:border-slate-700/60
                                rounded-2xl shadow-sm
                                transition-all duration-500 ease-out
                                hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700
                                hover:-translate-y-1
                            "
                        >
                            <div className="
                                w-16 h-16 mb-4 rounded-2xl
                                bg-green-50 dark:bg-green-950/30
                                flex items-center justify-center
                                transition-colors duration-500
                                group-hover:bg-green-100 dark:group-hover:bg-green-900/40
                            ">
                                <img src={whatsappIcono} alt="WhatsApp" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">WhatsApp</span>
                            <span className="text-[13px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
                                Asesoramiento directo y presupuestos rápidos.
                            </span>
                        </a>

                        {/* Instagram - Portfolio visual */}
                        <a
                            href={SOCIAL_URLS.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group
                                flex flex-col items-center p-8 
                                bg-slate-50/50 dark:bg-slate-800/50
                                border border-slate-200/60 dark:border-slate-700/60
                                rounded-2xl shadow-sm
                                transition-all duration-500 ease-out
                                hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700
                                hover:-translate-y-1
                            "
                        >
                            <div className="
                                w-16 h-16 mb-4 rounded-2xl
                                bg-pink-50 dark:bg-pink-950/30
                                flex items-center justify-center
                                transition-colors duration-500
                                group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40
                            ">
                                <img src={instagramIcono} alt="Instagram" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Instagram</span>
                            <span className="text-[13px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
                                Descubrí nuestros últimos trabajos y diseños.
                            </span>
                        </a>

                        {/* Facebook - Comunidad */}
                        <a
                            href={SOCIAL_URLS.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group
                                flex flex-col items-center p-8 
                                bg-slate-50/50 dark:bg-slate-800/50
                                border border-slate-200/60 dark:border-slate-700/60
                                rounded-2xl shadow-sm
                                transition-all duration-500 ease-out
                                hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700
                                hover:-translate-y-1
                            "
                        >
                            <div className="
                                w-16 h-16 mb-4 rounded-2xl
                                bg-blue-50 dark:bg-blue-950/30
                                flex items-center justify-center
                                transition-colors duration-500
                                group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40
                            ">
                                <img src={facebookIcono} alt="Facebook" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Facebook</span>
                            <span className="text-[13px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
                                Conocé nuestra trayectoria y novedades.
                            </span>
                        </a>
                    </div>

                    {/* ===== INFORMACIÓN ADICIONAL DE VALOR ===== */}
                    <footer className="
                        pt-10 
                        border-t border-slate-200/50 dark:border-slate-700/50
                        grid grid-cols-1 md:grid-cols-2 gap-8 text-left
                    ">
                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                                Horarios de atención
                            </p>
                            <p className="text-[14px] font-medium tracking-tight text-slate-600 dark:text-slate-400">
                                Lunes a Viernes: 09:00 a 18:00 hs.<br />
                                Sábados: 09:00 a 13:00 hs.
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                                Datos de contacto directo
                            </p>
                            <p className="text-[14px] font-medium tracking-tight text-slate-600 dark:text-slate-400">
                                Email: gaddyel.gaddyel@gmail.com<br />
                                Buenos Aires, Argentina.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Contacto;