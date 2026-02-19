import React from 'react';
import { Helmet } from 'react-helmet-async';

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
            </Helmet>
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-2xl text-center">
                    <h1 className="italic text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
                        Ponte en Contacto
                    </h1>
                    <p className="text-lg text-gray-700 mb-10 max-w-xl mx-auto">
                        Elige tu método de contacto preferido. Estamos listos para atenderte y ayudarte a crear productos únicos.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Ícono de WhatsApp */}
                        <a
                            href="https://wa.me/message/NBXNXYM5ZVE7D1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center p-6 bg-green-100 text-green-700 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:bg-green-200 duration-300"
                        >
                            <img src={whatsappIcono} alt="Contacta a Gaddyel por WhatsApp para consultas de personalización" className="w-12 h-12 mb-2" />
                            <span className="font-bold text-lg mt-2">WhatsApp</span>
                            <span className="text-sm text-center">Envía un mensaje rápido.</span>
                        </a>

                        {/* Ícono de Instagram */}
                        <a
                            href="https://www.instagram.com/gaddyel.oficial/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center p-6 bg-pink-100 text-pink-600 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:bg-pink-200 duration-300"
                        >
                            <img src={instagramIcono} alt="Síguenos en Instagram - Gaddyel blanquería personalizada" className="w-12 h-12 mb-2" />
                            <span className="font-bold text-lg mt-2">Instagram</span>
                            <span className="text-sm text-center">Síguenos y descubre nuestros diseños.</span>
                        </a>

                        {/* Ícono de Facebook */}
                        <a
                            href="https://www.facebook.com/gaddyel.gaddyel.184/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center p-6 bg-blue-100 text-blue-600 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:bg-blue-200 duration-300"
                        >
                            <img src={facebookIcono} alt="Visita nuestra página de Facebook - Gaddyel" className="w-12 h-12 mb-2" />
                            <span className="font-bold text-lg mt-2">Facebook</span>
                            <span className="text-sm text-center">Descubre nuestra comunidad y novedades.</span>
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Contacto;