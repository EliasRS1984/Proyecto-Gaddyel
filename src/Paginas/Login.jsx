import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../Servicios/authService';
import { logger } from '../utils/logger';
import logoGaddyel from '../Activos/Imagenes/Logo-Gaddyel.png';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { establecerCliente } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // URL de redirección después del login (por defecto a inicio)
    const from = location.state?.from?.pathname || '/';

    // ✅ FLUJO: Al llegar a Login, limpiar sesión anterior si existe
    // Responsabilidad: Asegurar que no hay sesión activa antes de nuevo login
    useEffect(() => {
        authService.limpiarSesionAnterior();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación básica
        if (!formData.email || !formData.password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setIsLoading(true);

        try {
            // ✅ FLUJO: Llamar authService.login() directamente (responsabilidad única)
            const resultado = await authService.login(formData.email, formData.password);

            if (resultado.exito) {
                // ✅ Actualizar estado global en AuthContext
                establecerCliente(resultado.cliente);
                navigate(from, { replace: true });
            } else {
                setError(resultado.mensaje || 'Error al iniciar sesión');
            }
        } catch (error) {
            logger.error('[Login] Error al iniciar sesión:', error.message);
            setError('Error al iniciar sesión. Por favor intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /*
         * LAYOUT: Pantalla completa dividida en dos mitades
         * - Izquierda (solo desktop): Panel decorativo con identidad de marca
         * - Derecha: Formulario de login con glassmorphism
         * En mobile: solo el formulario centrado
         */
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">

            {/* ======== PANEL IZQUIERDO — IDENTIDAD DE MARCA (solo desktop) ======== */}
            {/*
             * BORDE DERECHO CURVO: se logra con rounded-r-[3rem] directo en el div.
             * CSS border-radius es nativo y no genera el seam de 1px que tenía el SVG.
             * El outer container (bg-slate-50/950) se ve en la esquina redondeada,
             * creando la ilusión de que el panel tiene borde curvo intencional.
             */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                bg-indigo-950 dark:bg-slate-900
                rounded-r-[3rem]
                flex-col items-start justify-between
                p-14"
            >
                {/* Cuadrícula decorativa de fondo */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(165,180,252,1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(165,180,252,1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                    aria-hidden="true"
                />

                {/* Círculo de luz ambiental — sutileza visual */}
                <div
                    className="absolute top-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-[0.12]"
                    style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
                    aria-hidden="true"
                />

                {/*
                 * LOGO con animación flotante + halo de luz
                 * - animate-float: movimiento vertical suave (definido en index.css)
                 * - El halo es un div circular con blur detrás del logo
                 *   que pulsa con animate-pulse para simular un brillo vivo
                 */}
                {/*
                 * Wrapper de altura fija (h-28) para que el espacio sea idéntico
                 * al panel del Registro. Así el logo no cambia de posición al
                 * navegar entre Login y RegistroNuevo.
                 */}
                <div className="relative z-20 flex items-center justify-center h-28 w-28">
                    {/* Halo de luz detrás del logo */}
                    <div
                        className="absolute inset-0 rounded-full animate-pulse opacity-30"
                        style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', filter: 'blur(16px)' }}
                        aria-hidden="true"
                    />
                    <img
                        src={logoGaddyel}
                        alt="Gaddyel"
                        className="relative h-24 w-auto max-w-[9rem] object-contain drop-shadow-2xl animate-float"
                        draggable={false}
                    />
                </div>

                {/* Mensaje central — propuesta de valor */}
                <div className="relative z-20 flex-1 flex flex-col justify-center">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-300 mb-5">
                        Portal de clientes
                    </p>
                    <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white mb-6">
                        Blanquería<br />
                        <span className="text-indigo-200/60">pensada para</span><br />
                        profesionales
                    </h2>
                    <p className="text-[14px] font-medium tracking-tight text-indigo-200/50 leading-relaxed max-w-xs">
                        Gestioná tus pedidos, seguí tus envíos y accedé a precios exclusivos para centros de estética y spa.
                    </p>
                </div>

                {/* Pie del panel — tres atributos de producto */}
                <div className="relative z-20 flex flex-col gap-3 w-full">
                    {[
                        { label: 'Bordado industrial con tu logo' },
                        { label: 'Diseños profesionales' },
                        { label: 'Envíos a todo el país' },
                    ].map(({ label }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                            <span className="text-[13px] font-medium tracking-tight text-indigo-200/50">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ======== PANEL DERECHO — FORMULARIO ======== */}
            {/*
             * JERARQUÍA DE CAPAS EN DARK MODE:
             *   slate-950 → fondo del panel derecho (más oscuro que el panel izquierdo)
             *   slate-900 → panel izquierdo de marca
             *   slate-800 → card del formulario (la capa más "elevada" y visible)
             * → El ojo percibe la diferencia de profundidad entre las tres capas.
             */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 lg:px-12
                bg-slate-50 dark:bg-slate-950">
                {/* Card — fondo sólido para que nunca se confunda con el panel */}
                <div className="w-full max-w-sm
                    bg-white dark:bg-slate-800
                    border border-slate-200/60 dark:border-slate-700
                    rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/80
                    px-8 py-10">

                    {/* Cabecera del formulario */}
                    <div className="mb-10">
                        {/* Píldora de contexto — visible solo en mobile */}
                        <div className="flex items-center gap-2 mb-7 lg:hidden">
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40
                                border border-indigo-200 dark:border-indigo-800/60
                                flex items-center justify-center">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400">
                                Gaddyel
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mb-2">
                            Bienvenido de vuelta
                        </h1>
                        <p className="text-[14px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
                            ¿No tenés cuenta?{' '}
                            <Link
                                to="/registro"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300
                                    transition-colors duration-500 ease-out font-semibold"
                            >
                                Registrate aquí
                            </Link>
                        </p>
                    </div>

                    {/* Aviso si viene desde checkout */}
                    {from === '/checkout' && (
                        <div className="mb-7 flex items-start gap-3
                            px-5 py-4
                            bg-indigo-50/80 dark:bg-indigo-900/20
                            border border-indigo-200/60 dark:border-indigo-700/40
                            rounded-2xl"
                        >
                            <svg className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <p className="text-[13px] font-medium tracking-tight text-indigo-700 dark:text-indigo-300">
                                Iniciá sesión para continuar con tu compra
                            </p>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} noValidate>

                        {/* Mensaje de error */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3
                                px-5 py-4
                                bg-red-50/80 dark:bg-red-950/30
                                border border-red-200/60 dark:border-red-800/50
                                rounded-2xl"
                                role="alert"
                            >
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-[13px] font-medium tracking-tight text-red-700 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-5 mb-8">

                            {/* Campo: Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-[13px] font-semibold tracking-tight
                                        text-slate-700 dark:text-slate-300 mb-2"
                                >
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="tu@email.com"
                                    className="w-full px-5 py-3.5
                                        bg-white/80 dark:bg-slate-800/80
                                        border border-slate-200/70 dark:border-slate-700/70
                                        text-[14px] font-medium tracking-tight
                                        text-slate-800 dark:text-slate-200
                                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                                        rounded-2xl
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all duration-500 ease-out"
                                />
                            </div>

                            {/* Campo: Contraseña con toggle de visibilidad */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[13px] font-semibold tracking-tight
                                        text-slate-700 dark:text-slate-300 mb-2"
                                >
                                    Contraseña
                                </label>
                                {/* Contenedor relativo para posicionar el botón de ojo dentro del input */}
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        placeholder="Tu contraseña"
                                        className="w-full px-5 py-3.5 pr-12
                                            bg-white/80 dark:bg-slate-800/80
                                            border border-slate-200/70 dark:border-slate-700/70
                                            text-[14px] font-medium tracking-tight
                                            text-slate-800 dark:text-slate-200
                                            placeholder:text-slate-400 dark:placeholder:text-slate-500
                                            rounded-2xl
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            transition-all duration-500 ease-out"
                                    />
                                    {/* Botón para mostrar u ocultar la contraseña */}
                                    {/* Aparece solo si hay texto escrito */}
                                    {formData.password && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2
                                                p-1.5 rounded-xl
                                                text-slate-400 hover:text-slate-600
                                                dark:text-slate-500 dark:hover:text-slate-300
                                                transition-colors duration-500 ease-out
                                                focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                /* Ojo tachado — indica que la contraseña está visible */
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                /* Ojo abierto — indica que la contraseña está oculta */
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón principal */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center gap-2
                                px-6 py-4
                                bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
                                text-white text-[14px] font-bold tracking-tight
                                rounded-2xl
                                shadow-lg shadow-indigo-500/20
                                hover:shadow-xl hover:shadow-indigo-500/30
                                hover:-translate-y-0.5
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                                transition-all duration-500 ease-out
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                dark:focus:ring-offset-slate-950"
                        >
                            {isLoading ? (
                                <>
                                    {/* Spinner de carga */}
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    Iniciar sesión
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                    </form>

                    {/* Separador */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-400 dark:text-slate-600">
                            o
                        </span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {/* Link de retorno */}
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5
                                text-[13px] font-medium tracking-tight
                                text-slate-500 dark:text-slate-400
                                hover:text-slate-700 dark:hover:text-slate-200
                                transition-colors duration-500 ease-out"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al inicio
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Login;
