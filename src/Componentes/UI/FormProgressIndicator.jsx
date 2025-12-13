import React from 'react';

/**
 * Indicador de progreso del formulario de checkout
 * Muestra visualmente qué campos están completos
 */
export const FormProgressIndicator = ({ formData, fieldErrors, touched }) => {
    const requiredFields = [
        { name: 'nombre', label: 'Nombre' },
        { name: 'email', label: 'Email' },
        { name: 'whatsapp', label: 'WhatsApp' },
        { name: 'direccion', label: 'Dirección' },
        { name: 'ciudad', label: 'Ciudad' },
        { name: 'codigoPostal', label: 'Código Postal' }
    ];

    const completedFields = requiredFields.filter(field => {
        const hasValue = formData[field.name] && formData[field.name].trim().length > 0;
        const hasError = fieldErrors[field.name];
        const isTouched = touched[field.name];
        return hasValue && !hasError && isTouched;
    });

    const progress = (completedFields.length / requiredFields.length) * 100;
    const allComplete = progress === 100;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                    Progreso del formulario
                </span>
                <span className="text-sm font-semibold text-blue-600">
                    {completedFields.length}/{requiredFields.length}
                </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                        allComplete ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Lista de campos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {requiredFields.map(field => {
                    const isComplete = completedFields.some(f => f.name === field.name);
                    const hasError = fieldErrors[field.name] && touched[field.name];
                    
                    return (
                        <div 
                            key={field.name}
                            className="flex items-center text-xs"
                        >
                            {isComplete ? (
                                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            ) : hasError ? (
                                <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
                                </svg>
                            )}
                            <span className={
                                isComplete 
                                    ? 'text-green-700' 
                                    : hasError 
                                    ? 'text-red-700' 
                                    : 'text-gray-600'
                            }>
                                {field.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {allComplete && (
                <div className="mt-3 flex items-center text-green-700 text-sm">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    ¡Formulario completo! Puedes continuar al pago
                </div>
            )}
        </div>
    );
};

export default FormProgressIndicator;
