import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import * as authService from '../Servicios/authService';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { establecerCliente } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            console.error('❌ Error en login:', error);
            setError('Error al iniciar sesión. Por favor intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Encabezado */}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <Link to="/registro" className="font-medium text-pink-600 hover:text-pink-500">
                            Regístrate aquí
                        </Link>
                    </p>
                    
                    {/* Mensaje informativo si viene desde checkout */}
                    {from === '/checkout' && (
                        <div className="mt-4 rounded-md bg-blue-50 p-4">
                            <p className="text-sm text-blue-800 text-center">
                                🔒 Necesitas iniciar sesión para continuar con tu compra
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
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="tu@email.com"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="Tu contraseña"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Botón de submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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

export default Login;
