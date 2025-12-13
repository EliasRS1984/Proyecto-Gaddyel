import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const Registro = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { registrar } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        whatsapp: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // URL de redirección después del registro (por defecto a inicio)
    const from = location.state?.from?.pathname || '/';

    // Limpiar localStorage al llegar a la página de registro
    useEffect(() => {
        console.log('🔄 [Registro] Verificando sesión previa...');
        const tokenExistente = localStorage.getItem('clientToken');
        if (tokenExistente) {
            console.log('⚠️ [Registro] Encontrada sesión previa, limpiar localStorage');
            localStorage.removeItem('clientToken');
            localStorage.removeItem('clientData');
            console.log('✅ [Registro] localStorage limpiado');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Limpiar error al escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones básicas
        if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword || !formData.whatsapp) {
            setError('Por favor completa todos los campos');
            return;
        }

        // Validar contraseña
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingresa un email válido');
            return;
        }

        // Validar WhatsApp (debe tener al menos 10 dígitos)
        const whatsappDigits = formData.whatsapp.replace(/\D/g, '');
        if (whatsappDigits.length < 10) {
            setError('Por favor ingresa un número de WhatsApp válido');
            return;
        }

        setIsLoading(true);

        try {
            const resultado = await registrar(formData);

            if (resultado.exito) {
                console.log('✅ Registro exitoso');
                // Redirigir a la página anterior (checkout) o al inicio
                navigate(from, { replace: true });
            } else {
                setError(resultado.mensaje || 'Error al registrar usuario');
            }
        } catch (error) {
            console.error('❌ Error en registro:', error);
            setError('Error al registrar usuario. Por favor intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Encabezado */}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link 
                            to="/login" 
                            state={{ from: location.state?.from }}
                            className="font-medium text-pink-600 hover:text-pink-500"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                    
                    {/* Mensaje informativo si viene desde checkout */}
                    {from === '/checkout' && (
                        <div className="mt-4 rounded-md bg-blue-50 p-4">
                            <p className="text-sm text-blue-800 text-center">
                                🔒 Crea una cuenta para continuar con tu compra
                            </p>
                        </div>
                    )}
                </div>

                {/* Formulario */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Mensaje de error */}
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Nombre completo */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                Nombre completo *
                            </label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                required
                                value={formData.nombre}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="Juan Pérez"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="tu@email.com"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="Mínimo 6 caracteres"
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Mínimo 6 caracteres
                            </p>
                        </div>

                        {/* Confirmar contraseña */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar contraseña *
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="Repite tu contraseña"
                                disabled={isLoading}
                            />
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                                WhatsApp *
                            </label>
                            <input
                                id="whatsapp"
                                name="whatsapp"
                                type="tel"
                                required
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="+54 11 1234 5678"
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Lo usaremos para coordinar tu pedido
                            </p>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="rounded-md bg-blue-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Registro rápido:</strong> Solo necesitamos estos datos básicos. 
                                    La dirección de envío la podrás agregar cuando realices tu primer pedido.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botón de submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </div>

                    {/* Link de retorno */}
                    <div className="text-center">
                        <Link 
                            to="/" 
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registro;
