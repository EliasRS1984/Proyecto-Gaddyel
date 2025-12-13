import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import * as authService from '../Servicios/authService';

/**
 * Página de perfil del cliente
 * Permite ver y editar información personal y dirección de envío
 */
export const Perfil = () => {
    const navigate = useNavigate();
    const { cliente, isAuthenticated, refrescarPerfil, cerrarSesion } = useContext(AuthContext);
    
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

    // Cargar datos del cliente
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

    const handlePersonalChange = (e) => {
        setDatosPersonales({
            ...datosPersonales,
            [e.target.name]: e.target.value
        });
    };

    const handleDireccionChange = (e) => {
        setDatosDireccion({
            ...datosDireccion,
            [e.target.name]: e.target.value
        });
    };

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
            setMensaje({ tipo: 'success', texto: '✅ Datos personales actualizados correctamente' });
            
            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
        } catch (error) {
            setMensaje({ tipo: 'error', texto: '❌ Error al actualizar datos personales' });
        } finally {
            setLoading(false);
        }
    };

    const guardarDireccion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            await authService.actualizarDireccion(datosDireccion);
            await refrescarPerfil();
            setIsEditingDireccion(false);
            setMensaje({ tipo: 'success', texto: '✅ Dirección actualizada correctamente' });
            
            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
        } catch (error) {
            setMensaje({ tipo: 'error', texto: '❌ Error al actualizar dirección' });
        } finally {
            setLoading(false);
        }
    };

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate('/');
    };

    if (!isAuthenticated || !cliente) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
                    <p className="text-gray-600">Gestiona tu información personal y dirección de envío</p>
                </div>

                {/* Mensajes */}
                {mensaje.texto && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        mensaje.tipo === 'success' 
                            ? 'bg-green-50 border border-green-200 text-green-800' 
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        {mensaje.texto}
                    </div>
                )}

                {/* Datos Personales */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Datos Personales</h2>
                        {!isEditingPersonal && (
                            <button
                                onClick={() => setIsEditingPersonal(true)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Editar
                            </button>
                        )}
                    </div>

                    {isEditingPersonal ? (
                        <form onSubmit={guardarDatosPersonales}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={datosPersonales.nombre}
                                        onChange={handlePersonalChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={datosPersonales.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={datosPersonales.whatsapp}
                                        onChange={handlePersonalChange}
                                        required
                                        placeholder="+54 9 11 1234-5678"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Guardando...' : 'Guardar'}
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
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Nombre</p>
                                <p className="text-base font-medium text-gray-900">{cliente.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-base font-medium text-gray-900">{cliente.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">WhatsApp</p>
                                <p className="text-base font-medium text-gray-900">{cliente.whatsapp || 'No especificado'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dirección de Envío */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Dirección de Envío</h2>
                        {!isEditingDireccion && (
                            <button
                                onClick={() => setIsEditingDireccion(true)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {(cliente.domicilio || cliente.direccion) ? 'Editar' : 'Agregar'}
                            </button>
                        )}
                    </div>

                    {isEditingDireccion ? (
                        <form onSubmit={guardarDireccion}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Domicilio *
                                    </label>
                                    <input
                                        type="text"
                                        name="domicilio"
                                        value={datosDireccion.domicilio}
                                        onChange={handleDireccionChange}
                                        required
                                        placeholder="Calle y número"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Localidad *
                                        </label>
                                        <input
                                            type="text"
                                            name="localidad"
                                            value={datosDireccion.localidad}
                                            onChange={handleDireccionChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Provincia *
                                        </label>
                                        <input
                                            type="text"
                                            name="provincia"
                                            value={datosDireccion.provincia}
                                            onChange={handleDireccionChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Código Postal *
                                    </label>
                                    <input
                                        type="text"
                                        name="codigoPostal"
                                        value={datosDireccion.codigoPostal}
                                        onChange={handleDireccionChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Guardando...' : 'Guardar'}
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
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            {(cliente.domicilio || cliente.direccion) ? (
                                <>
                                    <div>
                                        <p className="text-sm text-gray-600">Domicilio</p>
                                        <p className="text-base font-medium text-gray-900">
                                            {cliente.domicilio || cliente.direccion}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Localidad</p>
                                        <p className="text-base font-medium text-gray-900">
                                            {cliente.localidad || cliente.ciudad || 'No especificado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Provincia</p>
                                        <p className="text-base font-medium text-gray-900">
                                            {cliente.provincia || 'No especificado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Código Postal</p>
                                        <p className="text-base font-medium text-gray-900">
                                            {cliente.codigoPostal || 'No especificado'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 italic">No has agregado una dirección de envío aún</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Cerrar Sesión */}
                <div className="bg-white rounded-lg shadow p-6">
                    <button
                        onClick={handleCerrarSesion}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
