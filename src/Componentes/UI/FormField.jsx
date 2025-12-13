import React from 'react';

/**
 * Componente reutilizable para campos de formulario con validación visual
 */
export const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    error,
    touched,
    helpText,
    successMessage,
    maxLength,
    rows,
    className = ''
}) => {
    const isValid = value && !error && touched;
    const isInvalid = error && touched;

    const baseInputClass = `w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
        isInvalid
            ? 'border-red-500 focus:ring-red-500'
            : isValid
            ? 'border-green-500 focus:ring-green-500'
            : 'border-gray-300 focus:ring-blue-500'
    } ${className}`;

    const InputComponent = type === 'textarea' ? 'textarea' : 'input';

    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {helpText && (
                    <span className="text-gray-500 text-xs ml-2 font-normal">
                        {helpText}
                    </span>
                )}
            </label>

            <div className="relative">
                <InputComponent
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={rows}
                    className={baseInputClass}
                />

                {/* Indicador visual de estado */}
                {(isValid || isInvalid) && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isValid ? (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                        )}
                    </div>
                )}
            </div>

            {/* Mensajes de error o éxito */}
            {isInvalid && (
                <p className="text-red-500 text-sm flex items-start">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </p>
            )}

            {isValid && successMessage && (
                <p className="text-green-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {successMessage}
                </p>
            )}

            {/* Contador de caracteres para textarea */}
            {type === 'textarea' && maxLength && (
                <p className="text-gray-500 text-xs text-right">
                    {value.length}/{maxLength} caracteres
                </p>
            )}
        </div>
    );
};

export default FormField;
