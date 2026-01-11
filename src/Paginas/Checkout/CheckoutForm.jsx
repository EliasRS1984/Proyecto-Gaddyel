import React from 'react';

/**
 * CheckoutForm - Formulario de datos del cliente
 * Componente de presentación puro que recibe props y emite eventos
 */
export const CheckoutForm = ({
    formData,
    fieldErrors,
    touched,
    isEditingAddress,
    isAuthenticated,
    loading,
    error,
    onSubmit,
    onChange,
    onBlur,
    onToggleEditAddress
}) => {
    const getFieldError = (fieldName) => {
        return touched[fieldName] && fieldErrors[fieldName];
    };

    const inputClassName = (fieldName) => {
        const baseClass = "w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
        const errorClass = getFieldError(fieldName) ? "border-red-500" : "border-gray-300";
        return `${baseClass} ${errorClass}`;
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Datos de Contacto</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Nombre */}
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium mb-1">
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={inputClassName('nombre')}
                        required
                        disabled={loading}
                    />
                    {getFieldError('nombre') && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.nombre}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={inputClassName('email')}
                        required
                        disabled={loading}
                    />
                    {getFieldError('email') && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                    )}
                </div>

                {/* WhatsApp */}
                <div className="mb-4">
                    <label htmlFor="whatsapp" className="block text-sm font-medium mb-1">
                        WhatsApp *
                    </label>
                    <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="11 2233 4455"
                        className={inputClassName('whatsapp')}
                        required
                        disabled={loading}
                    />
                    {getFieldError('whatsapp') && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.whatsapp}</p>
                    )}
                </div>
            </div>

            {/* Dirección de Envío */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Dirección de Envío</h2>
                    
                </div>

                {/* Domicilio */}
                <div className="mb-4">
                    <label htmlFor="domicilio" className="block text-sm font-medium mb-1">
                        Dirección *
                    </label>
                    <input
                        type="text"
                        id="domicilio"
                        name="domicilio"
                        value={formData.domicilio}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="Calle y número"
                        className={inputClassName('domicilio')}
                        required
                        disabled={loading}
                    />
                    {getFieldError('domicilio') && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.domicilio}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Localidad */}
                    <div>
                        <label htmlFor="localidad" className="block text-sm font-medium mb-1">
                            Localidad *
                        </label>
                        <input
                            type="text"
                            id="localidad"
                            name="localidad"
                            value={formData.localidad}
                            onChange={onChange}
                            onBlur={onBlur}
                            className={inputClassName('localidad')}
                            required
                            disabled={loading}
                        />
                        {getFieldError('localidad') && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.localidad}</p>
                        )}
                    </div>

                    {/* Provincia */}
                    <div>
                        <label htmlFor="provincia" className="block text-sm font-medium mb-1">
                            Provincia *
                        </label>
                        <input
                            type="text"
                            id="provincia"
                            name="provincia"
                            value={formData.provincia}
                            onChange={onChange}
                            onBlur={onBlur}
                            className={inputClassName('provincia')}
                            required
                            disabled={loading}
                        />
                        {getFieldError('provincia') && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.provincia}</p>
                        )}
                    </div>
                </div>

                {/* Código Postal */}
                <div className="mt-4">
                    <label htmlFor="codigoPostal" className="block text-sm font-medium mb-1">
                        Código Postal *
                    </label>
                    <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="1234"
                        className={inputClassName('codigoPostal')}
                        required
                        disabled={loading}
                    />
                    {getFieldError('codigoPostal') && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.codigoPostal}</p>
                    )}
                </div>

                {/* Notas Adicionales */}
                <div className="mt-4">
                    <label htmlFor="notasAdicionales" className="block text-sm font-medium mb-1">
                        Notas Adicionales (Opcional)
                    </label>
                    <textarea
                        id="notasAdicionales"
                        name="notasAdicionales"
                        value={formData.notasAdicionales}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows="3"
                        placeholder="Instrucciones especiales de entrega, horarios, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    />
                </div>
            </div>

            {/* Botón de envío */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>

            {/* Términos y condiciones */}
            <p className="!text-sm !text-gray-700 text-center mt-4 font-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>
                Al confirmar tu pedido, aceptas nuestros <a href="/terminos" className="text-blue-600 hover:text-blue-800 underline">términos y condiciones</a>
            </p>
        </form>
    );
};

export default CheckoutForm;
