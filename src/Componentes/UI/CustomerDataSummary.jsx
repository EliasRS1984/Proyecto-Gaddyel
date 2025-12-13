import React from 'react';

/**
 * Componente que muestra un resumen visual de los datos del cliente antes de enviar
 * Útil para que el usuario verifique su información
 */
export const CustomerDataSummary = ({ formData, onEdit }) => {
    const hasCompleteData = formData.nombre && formData.email && formData.direccion && formData.ciudad && formData.codigoPostal;

    if (!hasCompleteData) {
        return null;
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <h3 className="font-semibold text-blue-900">Verifica tus datos</h3>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 font-medium">Nombre:</span>
                    <span className="col-span-2 text-gray-900">{formData.nombre}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="col-span-2 text-gray-900">{formData.email}</span>
                </div>

                {formData.whatsapp && (
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600 font-medium">WhatsApp:</span>
                        <span className="col-span-2 text-gray-900">{formData.whatsapp}</span>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 font-medium">Dirección:</span>
                    <span className="col-span-2 text-gray-900">{formData.direccion}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 font-medium">Ciudad:</span>
                    <span className="col-span-2 text-gray-900">{formData.ciudad}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 font-medium">C.P.:</span>
                    <span className="col-span-2 text-gray-900">{formData.codigoPostal}</span>
                </div>

                {formData.notasAdicionales && (
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600 font-medium">Notas:</span>
                        <span className="col-span-2 text-gray-900 italic">{formData.notasAdicionales}</span>
                    </div>
                )}
            </div>

            <p className="text-xs text-blue-700 mt-3">
                Esta información será utilizada para la entrega de tu pedido
            </p>
        </div>
    );
};

export default CustomerDataSummary;
