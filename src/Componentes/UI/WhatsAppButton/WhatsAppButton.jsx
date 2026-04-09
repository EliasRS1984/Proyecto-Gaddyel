// =====================================================
// ¿QUÉ ES ESTO?
// Botón flotante de WhatsApp que aparece en todas las páginas
// del sitio. Permite al visitante contactar directamente con
// un mensaje pre-escrito adaptado al negocio de Gaddyel.
//
// ¿CÓMO FUNCIONA?
// 1. Se posiciona fijo en la esquina inferior derecha de la pantalla
// 2. Al hacer click, abre WhatsApp (web o app) con un mensaje ya redactado
// 3. Se oculta automáticamente en /checkout y /carrito para no
//    interrumpir al cliente en el momento del pago
// 4. Al poner el mouse encima, aparece una etiqueta con el texto
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El botón no aparece?  Revisar si la ruta está en RUTAS_OCULTAS
// ¿El link no abre WA?   Revisar CONTACT_INFO.whatsapp.number en contactInfo.js
// ¿El mensaje cambió?    Editar la variable MENSAJE_WA en este archivo
// =====================================================
import { useLocation } from 'react-router-dom';
import { CONTACT_INFO } from '../../../constants/contactInfo';

// ======== CONFIGURACIÓN ========
// Mensaje que verá el cliente al abrir WhatsApp.
// Editarlo acá actualiza automáticamente el link.
const MENSAJE_WA = 'Hola, me interesó la blanquería de Gaddyel. ¿Me podés asesorar?';

// Páginas donde el botón NO debe aparecer para no distraer al cliente
// en momentos críticos (proceso de pago) o donde ya hay contacto directo (/contacto)
const RUTAS_OCULTAS = ['/checkout', '/carrito', '/contacto'];

// ======== COMPONENTE ========
const WhatsAppButton = () => {
    const { pathname } = useLocation();

    // Si estamos en una ruta donde no debe mostrarse, no renderiza nada
    if (RUTAS_OCULTAS.includes(pathname)) return null;

    // Construye el link de WhatsApp con el número y el mensaje pre-cargado.
    // El número se limpia para quitar el "+" y no usar el link de Business Message,
    // ya que ese formato no acepta mensajes pre-escritos.
    const numero = CONTACT_INFO.whatsapp.number.replace(/\D/g, '');
    const href = `https://wa.me/${numero}?text=${encodeURIComponent(MENSAJE_WA)}`;

    return (
        // ======== BOTÓN FLOTANTE ========
        // El grupo permite mostrar la etiqueta de texto al pasar el mouse
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar a Gaddyel por WhatsApp"
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
            {/* Etiqueta de texto que aparece al pasar el mouse — se oculta por defecto */}
            <span
                aria-hidden="true"
                className="
                    pointer-events-none select-none
                    opacity-0 translate-x-2
                    group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-500 ease-out
                    whitespace-nowrap
                    px-3.5 py-2 rounded-2xl
                    bg-white/90 dark:bg-slate-900/90
                    backdrop-blur-xl
                    border border-slate-200/50 dark:border-slate-700/50
                    shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50
                    text-[13px] font-semibold tracking-tight
                    text-slate-700 dark:text-slate-300
                "
            >
                Hablemos por WhatsApp
            </span>

            {/* Botón circular con ícono de WhatsApp */}
            <span
                className="
                    flex items-center justify-center
                    w-14 h-14 rounded-2xl
                    bg-[#25D366] hover:bg-[#1fab55]
                    shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-[#25D366]/25
                    transition-all duration-500 ease-out
                    hover:-translate-y-1
                    ring-2 ring-white/20 ring-offset-0
                "
            >
                {/* Ícono SVG oficial de WhatsApp */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 text-white"
                    aria-hidden="true"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            </span>
        </a>
    );
};

export default WhatsAppButton;
