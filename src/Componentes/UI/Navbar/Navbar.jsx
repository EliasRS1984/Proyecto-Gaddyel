import { useState, useCallback, useEffect, useRef, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import CartIcon from '../../CartIcon';
import LogoGaddyel from '../../../Activos/Imagenes/Logo-Gaddyel.png';
import { logger } from '../../../utils/logger';

/**
 * ============================================================================
 * BARRA DE NAVEGACIÓN PRINCIPAL (Navbar)
 * ============================================================================
 * 
 * ¿QUÉ ES ESTO?
 * La barra superior que aparece en todas las páginas. Contiene el logo,
 * los enlaces de navegación, el carrito y el menú de usuario.
 * 
 * ¿CÓMO FUNCIONA?
 * 1. En pantallas grandes: Muestra todos los enlaces en horizontal
 * 2. En móviles: Muestra un botón de hamburguesa que abre un menú desplegable
 * 3. El menú de usuario muestra opciones según si está logueado o no
 * 4. Al hacer scroll, la barra gana más sombra para indicar que "flota"
 * 
 * ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
 * 
 * → "El menú móvil no se abre/cierra"
 *   Revisa toggleMenu() y el estado 'isOpen'
 * 
 * → "El menú de usuario no funciona"
 *   Revisa toggleUserMenu() y el estado 'isUserMenuOpen'
 * 
 * → "El logo no lleva al inicio"
 *   Revisa handleLogoClick()
 * 
 * → "El carrito no aparece"
 *   Revisa si CartIcon está importado y renderizado
 * 
 * → "Los enlaces no cambian de color cuando estoy en esa página"
 *   Revisa la clase 'isActive' en los NavLink
 * 
 * ARCHIVOS RELACIONADOS:
 * - hooks/useAuth.js - Maneja el estado de login del usuario
 * - CartIcon.jsx - Icono del carrito con contador
 */

// ============================================================================
// ENLACES DE NAVEGACIÓN
// ============================================================================
/**
 * Lista de páginas que aparecen en el menú.
 * Si necesitas agregar una nueva página, añádela aquí.
 * - 'to': La ruta URL (debe coincidir con App.jsx)
 * - 'label': El texto que se muestra al usuario
 */
const ENLACES_NAVEGACION = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/proceso', label: 'Nuestro Proceso' },
];

const Navbar = () => {
    // ========================================================================
    // ESTADOS DEL COMPONENTE
    // ========================================================================
    
    // ¿El menú móvil (hamburguesa) está abierto?
    const [isOpen, setIsOpen] = useState(false);
    
    // ¿El menú desplegable de usuario está abierto?
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    
    // ¿El usuario ha hecho scroll? (para agregar más sombra)
    const [scrolled, setScrolled] = useState(false);
    
    // Datos de autenticación del usuario
    const { isAuthenticated, cliente, cerrarSesion } = useAuth();
    
    // Para navegar programáticamente a otras páginas
    const navigate = useNavigate();
    
    // Referencia al menú de usuario (para detectar clicks fuera)
    const userMenuRef = useRef(null);
    
    // Logo con fallback si no carga
    const logoSrc = LogoGaddyel || 'https://via.placeholder.com/64?text=Logo';

    // ========================================================================
    // FUNCIÓN AUXILIAR: Obtener iniciales del usuario
    // ========================================================================
    /**
     * Convierte "Carlos Martínez" → "CM"
     * Usa las primeras letras del nombre completo.
     */
    const getInitials = (nombre) => {
        if (!nombre) return 'U';
        const parts = nombre.trim().split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // ========================================================================
    // DETECCIÓN DE SCROLL (para sombra dinámica)
    // ========================================================================
    /**
     * Cuando el usuario hace scroll hacia abajo (más de 10px),
     * la barra de navegación gana más sombra para parecer que "flota".
     */
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ========================================================================
    // CERRAR MENÚ AL HACER CLICK FUERA
    // ========================================================================
    /**
     * Si el usuario hace click en cualquier parte fuera del menú de usuario,
     * el menú se cierra automáticamente.
     * 
     * ¿El menú no se cierra al hacer click fuera? Revisa este bloque.
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        
        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    // Log para depuración (solo en desarrollo)
    useEffect(() => {
        logger.debug('[Navbar] Estado actualizado:', {
            isAuthenticated,
            cliente: cliente?.nombre || 'No autenticado'
        });
    }, [isAuthenticated, cliente]);

    // ========================================================================
    // FUNCIONES DEL MENÚ MÓVIL (hamburguesa)
    // ========================================================================
    
    /**
     * Abre o cierra el menú móvil (el de las 3 rayitas).
     * También cierra el menú de usuario si estaba abierto.
     */
    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
        setIsUserMenuOpen(false); // Cerrar menú de usuario al abrir móvil
    }, []);

    /**
     * Cierra el menú móvil. Se usa cuando el usuario selecciona una opción.
     */
    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    // ========================================================================
    // FUNCIONES DEL MENÚ DE USUARIO
    // ========================================================================
    
    /**
     * Abre o cierra el menú desplegable de "Cuenta" o del nombre del usuario.
     */
    const toggleUserMenu = useCallback(() => {
        setIsUserMenuOpen((prev) => !prev);
    }, []);

    /**
     * Cierra el menú de usuario.
     */
    const closeUserMenu = useCallback(() => {
        setIsUserMenuOpen(false);
    }, []);

    // Cierra la sesión del usuario y lo lleva a la página de inicio.
    // ¿El logout no funciona? Revisá esta función y cerrarSesion en AuthContext.jsx.
    const handleLogout = useCallback(() => {
        logger.info('[Navbar] Logout iniciado');
        cerrarSesion();
        closeUserMenu();
        navigate('/', { replace: true });
    }, [cerrarSesion, closeUserMenu, navigate]);

    // ========================================================================
    // FUNCIONES DEL LOGO
    // ========================================================================
    
    /**
     * Hace scroll suave hasta arriba de la página.
     */
    const handleScrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /**
     * Cuando el usuario hace click en el logo:
     * - Si ya está en la página de inicio: Solo hace scroll arriba
     * - Si está en otra página: Navega al inicio y luego scroll arriba
     */
    const handleLogoClick = useCallback((e) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            handleScrollToTop();
        } else {
            setTimeout(handleScrollToTop, 0);
        }
    }, [handleScrollToTop]);

    // ========================================================================
    // INTERFAZ VISUAL
    // ========================================================================
    return (
        <header className={`bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 border-b transition-all duration-500 ease-out ${scrolled ? 'border-slate-200/60 dark:border-slate-800/60 shadow-sm' : 'border-transparent'}`}>
            <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center py-3">
                
                {/* ------------------------------------------------------------
                    LOGO
                    Click lleva al inicio. En desktop tiene efecto hover.
                ------------------------------------------------------------ */}
                <div className="flex-shrink-0">
                    <NavLink
                        to="/"
                        onClick={handleLogoClick}
                        className="flex items-center group"
                        aria-label="Ir a la página de inicio de Gaddyel (volver al top)"
                    >
                        <img
                            src={logoSrc}
                            alt="Logo de Gaddyel"
                            width={168}
                            height={56}
                            className="h-14 w-auto transition-all duration-700 ease-out group-hover:brightness-110"
                        />
                    </NavLink>
                </div>

                {/* ------------------------------------------------------------
                    BOTÓN HAMBURGUESA (solo móvil y tablet hasta 768px)
                    Abre/cierra el menú desplegable en pantallas pequeñas.
                    
                    ¿El ícono no cambia? Revisa las clases de opacity.
                ------------------------------------------------------------ */}
                <div className="md:hidden flex items-center gap-4">
                    {/* Carrito en móvil */}
                    <CartIcon />
                    
                    <button
                        onClick={toggleMenu}
                        className="relative z-50 p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none active:scale-95 transition-all duration-300"
                        aria-label="Menú de navegación"
                        aria-expanded={isOpen}
                    >
                        <div className="relative h-6 w-6">
                            {/* Ícono hamburguesa (3 líneas) */}
                            <svg
                                className={`h-6 w-6 absolute transition-all duration-300 ${isOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            {/* Ícono X (cerrar) */}
                            <svg
                                className={`h-6 w-6 absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* ------------------------------------------------------------
                    MENÚ DESKTOP (enlaces horizontales)
                    Visible desde tablets en adelante (768px+).
                ------------------------------------------------------------ */}
                <div className="hidden md:flex items-center gap-1" role="navigation" aria-label="Menú principal">
                    {ENLACES_NAVEGACION.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `relative px-5 py-2.5 text-[15px] font-medium tracking-tight transition-all duration-500 ease-out group ${isActive ? 'text-slate-900 dark:text-slate-50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {link.label}
                                    {/* Indicador de página activa: barra inferior con animación */}
                                    <span className={`absolute left-0 bottom-0 h-[2px] bg-slate-900 dark:bg-slate-100 transition-all duration-500 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Carrito (solo desktop, en móvil está junto al hamburguesa) */}
                    <div className="ml-4">
                        <CartIcon />
                    </div>

                    {/* ------------------------------------------------------------
                        MENÚ DE USUARIO (desktop)
                        Muestra avatar con iniciales si está logueado, o "Cuenta" si no.
                        
                        ¿No se abre el dropdown? Revisa toggleUserMenu.
                    ------------------------------------------------------------ */}
                    <div className="relative ml-6" ref={userMenuRef}>
                        {isAuthenticated ? (
                            <>
                                {/* Botón con avatar y nombre del usuario */}
                                <button
                                    onClick={toggleUserMenu}
                                    className="relative flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-500 ease-out group"
                                    aria-label="Menú de usuario"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    {/* Avatar circular con iniciales - diseño más sofisticado */}
                                    <div className="relative w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-semibold text-sm ring-2 ring-slate-200 dark:ring-slate-800 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 transition-all duration-500 group-hover:ring-slate-300 dark:group-hover:ring-slate-700">
                                        {getInitials(cliente?.nombre)}
                                    </div>
                                    <span className="hidden xl:block font-medium text-[15px] tracking-tight">{cliente?.nombre?.split(' ')[0] || 'Usuario'}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown: Usuario autenticado */}
                                <div className={`absolute right-0 mt-3 w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 py-3 z-50 transition-all duration-500 ease-out origin-top-right ${isUserMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                                    <div className="px-5 py-3 border-b border-slate-200/50 dark:border-slate-800/50">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{cliente?.nombre}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{cliente?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/perfil');
                                            closeUserMenu();
                                        }}
                                        className="w-full text-left px-5 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300 flex items-center gap-3 group"
                                    >
                                        {/* Icono de perfil */}
                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="font-medium tracking-tight">Mi Perfil</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 flex items-center gap-3 group"
                                    >
                                        {/* Icono de logout */}
                                        <svg className="w-4 h-4 text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="font-medium tracking-tight">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Botón "Cuenta" para usuarios no logueados */}
                                <button
                                    onClick={toggleUserMenu}
                                    className="relative flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-500 ease-out group"
                                    aria-label="Menú de autenticación"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <svg className="w-9 h-9 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors duration-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden xl:block font-medium text-[15px] tracking-tight">Cuenta</span>
                                    <svg className={`w-4 h-4 transition-transform duration-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown: Usuario no logueado */}
                                <div className={`absolute right-0 mt-3 w-56 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 py-2 z-50 transition-all duration-500 ease-out origin-top-right ${isUserMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                                    {/*
                                     * Solo se muestra "Iniciar Sesión".
                                     * El registro está disponible dentro de la misma página
                                     * de login con el link "Registrate aquí" — evita redundancia.
                                     */}
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            closeUserMenu();
                                        }}
                                        className="w-full text-left px-5 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300 flex items-center gap-3 group"
                                    >
                                        {/* Icono de login */}
                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="font-medium tracking-tight">Iniciar Sesión</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ----------------------------------------------------------------
                MENÚ MÓVIL DESPLEGABLE
                Aparece cuando el usuario presiona el botón hamburguesa.
                Se desliza desde arriba con animación.
                
                ¿El menú no aparece? Revisa el estado 'isOpen'.
                ¿Los colores no se ven bien? Revisa las clases con '!' que fuerzan colores.
            ---------------------------------------------------------------- */}
            <div
                id="mobile-menu"
                className={`md:hidden absolute w-full transition-all duration-500 ease-out transform origin-top bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            >
                <div className="px-6 py-6 space-y-1 flex flex-col">
                    {/* Enlaces de navegación */}
                    {ENLACES_NAVEGACION.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `
                                relative w-full block text-left px-5 py-4 text-base font-medium tracking-tight rounded-xl transition-all duration-300
                                ${isActive
                                    ? '!text-slate-900 dark:!text-slate-50 bg-slate-100 dark:bg-slate-900'
                                    : '!text-slate-600 dark:!text-slate-400 hover:!bg-slate-50 dark:hover:!bg-slate-900/50 hover:!text-slate-900 dark:hover:!text-slate-100'
                                }
                            `}
                            onClick={closeMenu}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    
                    {/* Separador */}
                    <div className="w-full border-t border-slate-200 dark:border-slate-800 my-3"></div>

                    {/* Opciones de usuario en móvil */}
                    {isAuthenticated ? (
                        <>
                            {/* Info del usuario */}
                            <div className="w-full text-left py-3 px-5">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{cliente?.nombre}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cliente?.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigate('/perfil');
                                    closeMenu();
                                }}
                                className="w-full text-left px-5 py-4 text-base font-medium tracking-tight rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300"
                            >
                                Mi Perfil
                            </button>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    closeMenu();
                                }}
                                className="w-full text-left px-5 py-4 text-base font-medium tracking-tight rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Solo Iniciar Sesión — el registro está dentro de esa página */}
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    closeMenu();
                                }}
                                className="w-full text-left px-5 py-4 text-base font-medium tracking-tight rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300"
                            >
                                Iniciar Sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

// El Navbar no recibe props: esta línea evita que se redibuje cuando un componente padre
// cambia por razones que no le afectan directamente.
export default memo(Navbar);