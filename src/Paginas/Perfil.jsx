// ============================================================
// ¿QUÉ ES ESTO?
// Página "Mi Perfil" del cliente
// Permite ver y editar información personal y dirección de envío
//
// ¿CÓMO FUNCIONA?
// 1. Al abrir la página, se cargan los datos del cliente desde el contexto global
// 2. El usuario puede editar datos personales o dirección haciendo click en "Editar"
// 3. Al guardar, se llama al backend y se refresca el contexto global
// 4. Los cambios se reflejan en la misma página sin recargar
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Datos no cargan → revisar AuthContext y refrescarPerfil()
// - Guardar falla → revisar authService.actualizarPerfil() / actualizarDireccion()
// - Redirige al login sola → isAuthenticated es false (token expirado)
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../Servicios/authService';

export const Perfil = () => {
    const navigate = useNavigate();
    const { cliente, isAuthenticated, refrescarPerfil, cerrarSesion } = useAuth();

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingDireccion, setIsEditingDireccion] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const [datosPersonales, setDatosPersonales] = useState({
        nombre: '',
        email: '',
        whatsapp: ''
    });

    const [datosDireccion, setDatosDireccion] = useState({
        domicilio: '',
        localidad: '',
        provincia: '',
        codigoPostal: ''
    });

    // ======== CARGA INICIAL DE DATOS ========
    // Cuando el cliente está disponible en el contexto, rellenamos los formularios
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (cliente) {
            setDatosPersonales({
                nombre: cliente.nombre || '',
                email: cliente.email || '',
                whatsapp: cliente.whatsapp || ''
            });
            setDatosDireccion({
                domicilio: cliente.domicilio || cliente.direccion || '',
                localidad: cliente.localidad || cliente.ciudad || '',
                provincia: cliente.provincia || '',
                codigoPostal: cliente.codigoPostal || ''
            });
        }
    }, [isAuthenticated, cliente, navigate]);

    // ======== MANEJADORES DE FORMULARIO ========
    const handlePersonalChange = (e) => {
        setDatosPersonales({ ...datosPersonales, [e.target.name]: e.target.value });
    };

    const handleDireccionChange = (e) => {
        setDatosDireccion({ ...datosDireccion, [e.target.name]: e.target.value });
    };

    // Cuando el usuario guarda sus datos personales, se envían al backend
    const guardarDatosPersonales = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });
        try {
            await authService.actualizarPerfil({
                nombre: datosPersonales.nombre,
                whatsapp: datosPersonales.whatsapp
            });
            await refrescarPerfil();
            setIsEditingPersonal(false);
            setMensaje({ tipo: 'success', texto: 'Datos personales actualizados correctamente' });
            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
        } catch (error) {
            setMensaje({ tipo: 'error', texto: 'Error al actualizar datos personales' });
        } finally {
            setLoading(false);
        }
    };

    // Cuando el usuario guarda su dirección, se envía al backend
    const guardarDireccion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });
        try {
            await authService.actualizarDireccion(datosDireccion);
            await refrescarPerfil();
            setIsEditingDireccion(false);
            setMensaje({ tipo: 'success', texto: 'Dirección actualizada correctamente' });
            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
        } catch (error) {
            setMensaje({ tipo: 'error', texto: 'Error al actualizar dirección' });
        } finally {
            setLoading(false);
        }
    };

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate('/');
    };

    if (!isAuthenticated || !cliente) return null;

    // Iniciales del cliente para el avatar (ej: "Juan Pérez" → "JP")
    const iniciales = (cliente.nombre || '')
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase() || '?';

    // ======== CLASES REUTILIZABLES ========
    // Inputs con foco visible y soporte dark mode
    const inputClass =
        'w-full px-4 py-3 text-[15px] tracking-tight ' +
        'bg-white dark:bg-slate-900 ' +
        'text-slate-900 dark:text-slate-100 ' +
        'border border-slate-200 dark:border-slate-700 rounded-2xl ' +
        'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 ' +
        'transition-all duration-500 ease-out ' +
        'placeholder:text-slate-400 dark:placeholder:text-slate-500';

    const inputDisabledClass =
        'w-full px-4 py-3 text-[15px] tracking-tight ' +
        'bg-slate-50 dark:bg-slate-800 ' +
        'text-slate-400 dark:text-slate-500 ' +
        'border border-slate-200/50 dark:border-slate-700/50 rounded-2xl ' +
        'cursor-not-allowed';

    const labelClass = 'block text-[13px] font-medium tracking-tight text-slate-500 dark:text-slate-400 mb-1.5';

    // Botón primario (guardar)
    const btnPrimary =
        'inline-flex items-center gap-2 px-6 py-2.5 ' +
        'bg-indigo-600 hover:bg-indigo-500 ' +
        'text-white text-[14px] font-medium tracking-tight rounded-2xl ' +
        'transition-all duration-500 ease-out ' +
        'disabled:opacity-40 disabled:cursor-not-allowed';

    // Botón secundario (cancelar)
    const btnSecondary =
        'inline-flex items-center gap-2 px-6 py-2.5 ' +
        'bg-slate-100 dark:bg-slate-800 ' +
        'hover:bg-slate-200 dark:hover:bg-slate-700 ' +
        'text-slate-700 dark:text-slate-300 text-[14px] font-medium tracking-tight rounded-2xl ' +
        'border border-slate-200/50 dark:border-slate-700/50 ' +
        'transition-all duration-500 ease-out';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 transition-colors duration-500">
            <div className="max-w-2xl mx-auto space-y-5">

                {/* ======== HEADER — Avatar + nombre del cliente ======== */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 px-8 py-7">
                    <div className="flex items-center gap-5">
                        {/* Avatar con iniciales */}
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-slate-200 dark:border-slate-700 ring-2 ring-slate-100 dark:ring-slate-800 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 flex items-center justify-center">
                            <span className="text-lg font-semibold tracking-tight text-indigo-600 dark:text-indigo-400">
                                {iniciales}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                                {cliente.nombre || 'Mi Perfil'}
                            </h1>
                            <p className="text-[14px] text-slate-500 dark:text-slate-400 tracking-tight truncate">
                                {cliente.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ======== MENSAJES DE ESTADO ======== */}
                {/* Aparece cuando se guarda con éxito o hay un error */}
                {mensaje.texto && (
                    <div className={`px-5 py-4 rounded-2xl text-[14px] font-medium tracking-tight border transition-all duration-500 ease-out ${
                        mensaje.tipo === 'success'
                            ? 'bg-green-50 dark:bg-green-950/30 border-green-200/60 dark:border-green-800/40 text-green-700 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800/40 text-red-700 dark:text-red-400'
                    }`}>
                        {mensaje.texto}
                    </div>
                )}

                {/* ======== DATOS PERSONALES ======== */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
                    {/* Encabezado de sección */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-3">
                            {/* Ícono persona */}
                            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <h2 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Datos Personales
                            </h2>
                        </div>
                        {/* Botón editar — solo visible cuando no se está editando */}
                        {!isEditingPersonal && (
                            <button
                                onClick={() => setIsEditingPersonal(true)}
                                className="group inline-flex items-center gap-1.5 text-[13px] font-medium tracking-tight text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-all duration-500 ease-out"
                            >
                                <svg className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-500 ease-out" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                </svg>
                                Editar
                            </button>
                        )}
                    </div>

                    <div className="px-8 py-6">
                        {isEditingPersonal ? (
                            /* Formulario de edición de datos personales */
                            <form onSubmit={guardarDatosPersonales} className="space-y-5">
                                <div>
                                    <label className={labelClass}>Nombre Completo *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={datosPersonales.nombre}
                                        onChange={handlePersonalChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input
                                        type="email"
                                        value={datosPersonales.email}
                                        disabled
                                        className={inputDisabledClass}
                                    />
                                    <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1.5 tracking-tight">
                                        El email no puede ser modificado
                                    </p>
                                </div>
                                <div>
                                    <label className={labelClass}>WhatsApp *</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={datosPersonales.whatsapp}
                                        onChange={handlePersonalChange}
                                        required
                                        placeholder="+54 9 11 1234-5678"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <button type="submit" disabled={loading} className={btnPrimary}>
                                        {loading
                                            ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Guardando</>
                                            : 'Guardar cambios'
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditingPersonal(false);
                                            setDatosPersonales({
                                                nombre: cliente.nombre || '',
                                                email: cliente.email || '',
                                                whatsapp: cliente.whatsapp || ''
                                            });
                                        }}
                                        className={btnSecondary}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Vista de solo lectura de datos personales */
                            <dl className="space-y-4">
                                <DatoLectura label="Nombre" valor={cliente.nombre} />
                                <DatoLectura label="Email" valor={cliente.email} />
                                <DatoLectura label="WhatsApp" valor={cliente.whatsapp} />
                            </dl>
                        )}
                    </div>
                </div>

                {/* ======== DIRECCIÓN DE ENVÍO ======== */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
                    {/* Encabezado de sección */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-3">
                            {/* Ícono dirección */}
                            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            </div>
                            <h2 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Dirección de Envío
                            </h2>
                        </div>
                        {!isEditingDireccion && (
                            <button
                                onClick={() => setIsEditingDireccion(true)}
                                className="group inline-flex items-center gap-1.5 text-[13px] font-medium tracking-tight text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-all duration-500 ease-out"
                            >
                                <svg className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-500 ease-out" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                </svg>
                                {(cliente.domicilio || cliente.direccion) ? 'Editar' : 'Agregar'}
                            </button>
                        )}
                    </div>

                    <div className="px-8 py-6">
                        {isEditingDireccion ? (
                            /* Formulario de edición de dirección */
                            <form onSubmit={guardarDireccion} className="space-y-5">
                                <div>
                                    <label className={labelClass}>Domicilio *</label>
                                    <input
                                        type="text"
                                        name="domicilio"
                                        value={datosDireccion.domicilio}
                                        onChange={handleDireccionChange}
                                        required
                                        placeholder="Calle y número"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Localidad *</label>
                                        <input
                                            type="text"
                                            name="localidad"
                                            value={datosDireccion.localidad}
                                            onChange={handleDireccionChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Provincia *</label>
                                        <input
                                            type="text"
                                            name="provincia"
                                            value={datosDireccion.provincia}
                                            onChange={handleDireccionChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="sm:w-1/2">
                                    <label className={labelClass}>Código Postal *</label>
                                    <input
                                        type="text"
                                        name="codigoPostal"
                                        value={datosDireccion.codigoPostal}
                                        onChange={handleDireccionChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <button type="submit" disabled={loading} className={btnPrimary}>
                                        {loading
                                            ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Guardando</>
                                            : 'Guardar cambios'
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditingDireccion(false);
                                            setDatosDireccion({
                                                domicilio: cliente.domicilio || cliente.direccion || '',
                                                localidad: cliente.localidad || cliente.ciudad || '',
                                                provincia: cliente.provincia || '',
                                                codigoPostal: cliente.codigoPostal || ''
                                            });
                                        }}
                                        className={btnSecondary}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Vista de solo lectura de dirección */
                            (cliente.domicilio || cliente.direccion) ? (
                                <dl className="space-y-4">
                                    <DatoLectura label="Domicilio" valor={cliente.domicilio || cliente.direccion} />
                                    <DatoLectura label="Localidad" valor={cliente.localidad || cliente.ciudad} />
                                    <DatoLectura label="Provincia" valor={cliente.provincia} />
                                    <DatoLectura label="Código Postal" valor={cliente.codigoPostal} />
                                </dl>
                            ) : (
                                <p className="text-[14px] text-slate-400 dark:text-slate-500 tracking-tight">
                                    No has agregado una dirección de envío aún
                                </p>
                            )
                        )}
                    </div>
                </div>

                {/* ======== CERRAR SESIÓN ======== */}
                {/* Acción destructiva — estilo sutil, no botón rojo dominante */}
                <div className="flex justify-center pt-2 pb-6">
                    <button
                        onClick={handleCerrarSesion}
                        className="group inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl hover:border-red-200/60 dark:hover:border-red-800/40 transition-all duration-500 ease-out"
                    >
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-500 ease-out" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        Cerrar sesión
                    </button>
                </div>

            </div>
        </div>
    );
};

// ======== COMPONENTE AUXILIAR ========
// Muestra un dato en modo lectura (etiqueta + valor)
// Si el valor es vacío, muestra "No especificado"
function DatoLectura({ label, valor }) {
    return (
        <div>
            <dt className="text-[12px] font-medium tracking-tight text-slate-400 dark:text-slate-500 uppercase">
                {label}
            </dt>
            <dd className="mt-0.5 text-[15px] font-medium tracking-tight text-slate-800 dark:text-slate-200">
                {valor || <span className="text-slate-400 dark:text-slate-500 font-normal">No especificado</span>}
            </dd>
        </div>
    );
}

export default Perfil;
