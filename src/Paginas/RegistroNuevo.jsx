// ============================================================
// ¿QUÉ ES ESTO?
// Página de registro de nuevos clientes en Gaddyel
//
// ¿CÓMO FUNCIONA?
// 1. El usuario completa nombre, email, whatsapp y contraseña
// 2. Cada campo se valida en tiempo real cuando el usuario lo toca
// 3. La contraseña muestra un medidor de fortaleza conforme se escribe
// 4. Al enviar, se llama al backend; si es exitoso se actualiza el
//    contexto global y se redirige al catálogo
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Error al registrar → revisar authService.registro() y el backend
// - Validaciones que no disparan → revisar validateField() y el array touched
// - Strength meter no aparece → revisar formData.password y calculatePasswordStrength()
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import { registro } from '../Servicios/authService';
import { logger } from '../utils/logger';
import logoGaddyel from '../Activos/Imagenes/Logo-Gaddyel.png';

const RegistroNuevo = () => {
    const navigate = useNavigate();
    const { establecerCliente } = useAuth();
    
    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        passwordConfirm: '',
        whatsapp: ''
    });
    
    // Estados de validación
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Validaciones en tiempo real
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        
        switch (name) {
            case 'nombre':
                if (!value.trim()) {
                    newErrors.nombre = 'El nombre es requerido';
                } else if (value.trim().length < 3) {
                    newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    newErrors.nombre = 'El nombre solo puede contener letras';
                } else {
                    delete newErrors.nombre;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    newErrors.email = 'El email es requerido';
                } else if (!emailRegex.test(value)) {
                    newErrors.email = 'Email inválido';
                } else {
                    delete newErrors.email;
                }
                break;
                
            case 'password':
                if (!value) {
                    newErrors.password = 'La contraseña es requerida';
                } else if (value.length < 8) {
                    newErrors.password = 'Mínimo 8 caracteres';
                } else if (!/(?=.*[a-z])/.test(value)) {
                    newErrors.password = 'Debe contener al menos una minúscula';
                } else if (!/(?=.*[A-Z])/.test(value)) {
                    newErrors.password = 'Debe contener al menos una mayúscula';
                } else if (!/(?=.*\d)/.test(value)) {
                    newErrors.password = 'Debe contener al menos un número';
                } else {
                    delete newErrors.password;
                }
                
                // Validar coincidencia si passwordConfirm ya está lleno
                if (formData.passwordConfirm && value !== formData.passwordConfirm) {
                    newErrors.passwordConfirm = 'Las contraseñas no coinciden';
                } else {
                    delete newErrors.passwordConfirm;
                }
                break;
                
            case 'passwordConfirm':
                if (!value) {
                    newErrors.passwordConfirm = 'Confirma tu contraseña';
                } else if (value !== formData.password) {
                    newErrors.passwordConfirm = 'Las contraseñas no coinciden';
                } else {
                    delete newErrors.passwordConfirm;
                }
                break;
                
            case 'whatsapp':
                // Permitir formato: +54 9 11 1234-5678 o 1112345678
                const cleanPhone = value.replace(/[\s\-+]/g, '');
                if (!cleanPhone) {
                    newErrors.whatsapp = 'El WhatsApp es requerido';
                } else if (!/^\d{10,15}$/.test(cleanPhone)) {
                    newErrors.whatsapp = 'Formato de teléfono inválido';
                } else {
                    delete newErrors.whatsapp;
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
    };
    
    // Calcular fortaleza de contraseña
    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 15;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
        
        return Math.min(strength, 100);
    };
    
    const passwordStrength = calculatePasswordStrength(formData.password);
    
    const getStrengthColor = () => {
        if (passwordStrength < 40) return 'bg-red-500';
        if (passwordStrength < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };
    
    const getStrengthText = () => {
        if (passwordStrength < 40) return 'Débil';
        if (passwordStrength < 70) return 'Media';
        return 'Fuerte';
    };
    
    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validar solo si el campo ya fue tocado
        if (touched[name]) {
            validateField(name, value);
        }
    };
    
    // Marcar campo como tocado al perder foco
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };
    
    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        
        // Marcar todos los campos como tocados
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
        // Validar todos los campos
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key]);
        });
        
        // Si hay errores, no enviar
        if (Object.keys(errors).length > 0) {
            setSubmitError('Por favor corrige los errores antes de continuar');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const resultado = await registro({
                nombre: formData.nombre.trim(),
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                whatsapp: formData.whatsapp.replace(/[\s\-+]/g, '')
            });
            
            if (resultado.exito) {
                // ✅ FLUJO: Actualizar estado global en AuthContext
                establecerCliente(resultado.cliente);
                
                // Registro exitoso - redirigir
                navigate('/catalogo', { 
                    state: { mensaje: 'Cuenta creada exitosamente. ¡Bienvenido!' }
                });
            } else {
                setSubmitError(resultado.mensaje || 'Error al crear la cuenta');
            }
        } catch (error) {
            logger.error('[Registro] Error al registrar:', error.message);
            setSubmitError('Error al conectar con el servidor. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        /*
         * LAYOUT: Split-screen igual que Login para coherencia visual entre hermanas.
         * - Panel izquierdo: identidad de marca (solo desktop, bg-indigo-950)
         * - Panel derecho: formulario de registro (bg-slate-50 / dark:bg-slate-950)
         * - Con más campos que Login, el panel derecho es scrollable en pantallas chicas
         */
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
            <Helmet>
                <title>Crear Cuenta - Gaddyel</title>
                <meta name="description" content="Regístrate en Gaddyel para acceder a blanquería premium y precios exclusivos para profesionales." />
            </Helmet>

            {/* ======== PANEL IZQUIERDO — IDENTIDAD DE MARCA (solo desktop) ======== */}
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
                {/* Círculo de luz ambiental */}
                <div
                    className="absolute top-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-[0.12]"
                    style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
                    aria-hidden="true"
                />

                {/* Logo con halo pulsante y animación flotante */}
                {/* Wrapper h-28 w-28 fijo — idéntico al de Login para coherencia visual */}
                <div className="relative z-20 flex items-center justify-center h-28 w-28">
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

                {/* Mensaje central — propuesta de valor para nuevos clientes */}
                <div className="relative z-20 flex-1 flex flex-col justify-center">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-300 mb-5">
                        Nuevo cliente
                    </p>
                    <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white mb-6">
                        Comenzá tu<br />
                        <span className="text-indigo-200/60">experiencia</span><br />
                        Gaddyel
                    </h2>
                    <p className="text-[14px] font-medium tracking-tight text-indigo-200/50 leading-relaxed max-w-xs">
                        Creá tu cuenta y accedé a precios exclusivos, personalizá tus pedidos y gestioná tus envíos desde un solo lugar.
                    </p>
                </div>

                {/* Pie — beneficios de registrarse */}
                <div className="relative z-20 flex flex-col gap-3 w-full">
                    {[
                        { label: 'Precios exclusivos para profesionales' },
                        { label: 'Seguimiento de pedidos en tiempo real' },
                        { label: 'Personalización con tu logo' },
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
            <div className="w-full lg:w-1/2 flex items-start justify-center px-4 py-12 lg:px-12
                bg-slate-50 dark:bg-slate-950 overflow-y-auto">

                <div className="w-full max-w-sm
                    bg-white dark:bg-slate-800
                    border border-slate-200/60 dark:border-slate-700
                    rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/80
                    px-8 py-10">

                    {/* ======== CABECERA DEL FORMULARIO ======== */}
                    <div className="mb-8">
                        {/* Ícono de marca — solo visible en mobile (el panel izquierdo está oculto) */}
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
                            Crear cuenta
                        </h1>
                        <p className="text-[14px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
                            ¿Ya tenés cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300
                                    transition-colors duration-500 ease-out font-semibold"
                            >
                                Iniciá sesión
                            </Link>
                        </p>
                    </div>

                    {/* ======== FORMULARIO ======== */}
                    <form onSubmit={handleSubmit} noValidate>

                        {/* Error global de envío */}
                        {submitError && (
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
                                    {submitError}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-5 mb-8">

                            {/* ======== NOMBRE ======== */}
                            <div>
                                <label htmlFor="nombre"
                                    className="block text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    autoComplete="name"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Juan Pérez"
                                    className={`w-full px-5 py-3.5
                                        bg-white/80 dark:bg-slate-800/80
                                        border text-[14px] font-medium tracking-tight
                                        text-slate-800 dark:text-slate-200
                                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                                        rounded-2xl
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                        transition-all duration-500 ease-out
                                        ${touched.nombre && errors.nombre
                                            ? 'border-red-400/80 dark:border-red-700/80'
                                            : 'border-slate-200/70 dark:border-slate-700/70'
                                        }`}
                                />
                                {touched.nombre && errors.nombre && (
                                    <p className="mt-1.5 text-[12px] font-medium tracking-tight text-red-600 dark:text-red-400">
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            {/* ======== EMAIL ======== */}
                            <div>
                                <label htmlFor="email"
                                    className="block text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="tu@email.com"
                                    className={`w-full px-5 py-3.5
                                        bg-white/80 dark:bg-slate-800/80
                                        border text-[14px] font-medium tracking-tight
                                        text-slate-800 dark:text-slate-200
                                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                                        rounded-2xl
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                        transition-all duration-500 ease-out
                                        ${touched.email && errors.email
                                            ? 'border-red-400/80 dark:border-red-700/80'
                                            : 'border-slate-200/70 dark:border-slate-700/70'
                                        }`}
                                />
                                {touched.email && errors.email && (
                                    <p className="mt-1.5 text-[12px] font-medium tracking-tight text-red-600 dark:text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* ======== WHATSAPP ======== */}
                            <div>
                                <label htmlFor="whatsapp"
                                    className="block text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-2">
                                    WhatsApp
                                </label>
                                <input
                                    id="whatsapp"
                                    name="whatsapp"
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="+54 9 11 1234-5678"
                                    className={`w-full px-5 py-3.5
                                        bg-white/80 dark:bg-slate-800/80
                                        border text-[14px] font-medium tracking-tight
                                        text-slate-800 dark:text-slate-200
                                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                                        rounded-2xl
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                        transition-all duration-500 ease-out
                                        ${touched.whatsapp && errors.whatsapp
                                            ? 'border-red-400/80 dark:border-red-700/80'
                                            : 'border-slate-200/70 dark:border-slate-700/70'
                                        }`}
                                />
                                {touched.whatsapp && errors.whatsapp && (
                                    <p className="mt-1.5 text-[12px] font-medium tracking-tight text-red-600 dark:text-red-400">
                                        {errors.whatsapp}
                                    </p>
                                )}
                            </div>

                            {/* ======== CONTRASEÑA ======== */}
                            <div>
                                <label htmlFor="password"
                                    className="block text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Mínimo 8 caracteres"
                                        className={`w-full px-5 py-3.5 pr-12
                                            bg-white/80 dark:bg-slate-800/80
                                            border text-[14px] font-medium tracking-tight
                                            text-slate-800 dark:text-slate-200
                                            placeholder:text-slate-400 dark:placeholder:text-slate-500
                                            rounded-2xl
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                            transition-all duration-500 ease-out
                                            ${touched.password && errors.password
                                                ? 'border-red-400/80 dark:border-red-700/80'
                                                : 'border-slate-200/70 dark:border-slate-700/70'
                                            }`}
                                    />
                                    {/* Botón ojo — mostrar/ocultar contraseña */}
                                    {formData.password && (
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-4 flex items-center
                                                text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                                                transition-colors duration-500 ease-out"
                                        >
                                            {showPassword ? (
                                                // Ojo tachado — contraseña visible
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                // Ojo abierto — contraseña oculta
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Medidor de fortaleza — aparece cuando el usuario escribe */}
                                {formData.password && (
                                    <div className="mt-2.5 flex items-center gap-2.5">
                                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ease-out ${getStrengthColor()}`}
                                                style={{ width: `${passwordStrength}%` }}
                                            />
                                        </div>
                                        <span className="text-[11px] font-semibold tracking-tight text-slate-500 dark:text-slate-400 w-10 text-right">
                                            {getStrengthText()}
                                        </span>
                                    </div>
                                )}

                                {touched.password && errors.password && (
                                    <p className="mt-1.5 text-[12px] font-medium tracking-tight text-red-600 dark:text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* ======== CONFIRMAR CONTRASEÑA ======== */}
                            <div>
                                <label htmlFor="passwordConfirm"
                                    className="block text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-2">
                                    Confirmar contraseña
                                </label>
                                <input
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Repetí tu contraseña"
                                    className={`w-full px-5 py-3.5
                                        bg-white/80 dark:bg-slate-800/80
                                        border text-[14px] font-medium tracking-tight
                                        text-slate-800 dark:text-slate-200
                                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                                        rounded-2xl
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                        transition-all duration-500 ease-out
                                        ${touched.passwordConfirm && errors.passwordConfirm
                                            ? 'border-red-400/80 dark:border-red-700/80'
                                            : 'border-slate-200/70 dark:border-slate-700/70'
                                        }`}
                                />
                                {touched.passwordConfirm && errors.passwordConfirm && (
                                    <p className="mt-1.5 text-[12px] font-medium tracking-tight text-red-600 dark:text-red-400">
                                        {errors.passwordConfirm}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* ======== BOTÓN ENVIAR ======== */}
                        {/* Deshabilitado si hay errores de validación activos */}
                        <button
                            type="submit"
                            disabled={isSubmitting || Object.keys(errors).length > 0}
                            className="w-full flex items-center justify-center gap-2
                                py-3.5 px-6
                                bg-indigo-600 hover:bg-indigo-500
                                disabled:bg-slate-300 dark:disabled:bg-slate-700
                                text-white disabled:text-slate-400 dark:disabled:text-slate-500
                                text-[14px] font-semibold tracking-tight
                                rounded-2xl
                                transition-all duration-500 ease-out
                                disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creando cuenta...
                                </>
                            ) : (
                                'Crear cuenta'
                            )}
                        </button>

                    </form>

                    {/* ======== LINK VOLVER ======== */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-tight
                                text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300
                                transition-colors duration-500 ease-out"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Volver al inicio
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegistroNuevo;
