import React from 'react';
import ScrollReveal from  '../Componentes/Layout/ScrollReveal/ScrollReveal.jsx'

const procesos = [
    {
        title: "Diseño y Personalización",
        description: "Nuestro equipo trabaja contigo para entender tu visión. A partir de tu logo o idea, creamos un diseño que captura la esencia de tu marca.",
        image: "https://placehold.co/400x300/F0F2F5/3B82F6?text=Diseño"
    },
    {
        title: "Selección de Materia Prima",
        description: "Utilizamos solo tejidos de alta calidad, seleccionados cuidadosamente para asegurar la máxima durabilidad, suavidad y resistencia al lavado.",
        image: "https://placehold.co/400x300/E5E7EB/EF4444?text=Materia+Prima"
    },
    {
        title: "Bordado de Precisión",
        description: "Con tecnología de punta, aplicamos tu diseño a cada prenda con la más alta precisión. El resultado es un bordado limpio, detallado y duradero.",
        image: "https://placehold.co/400x300/C0EFEA/10B981?text=Bordado"
    },
    {
        title: "Control de Calidad",
        description: "Cada pieza es inspeccionada minuciosamente. Nos aseguramos de que no haya defectos y de que el producto final cumpla con nuestros estrictos estándares de calidad.",
        image: "https://placehold.co/400x300/FEE2E2/EF4444?text=Control"
    },
    {
        title: "Empaquetado y Envío",
        description: "Empaquetamos tus productos con cuidado, listos para ser enviados a tu negocio. Nos aseguramos de que lleguen en perfectas condiciones, listos para ser usados.",
        image: "https://placehold.co/400x300/D1FAE5/16A34A?text=Envío"
    }
];

const NuestroProceso = () => {
    return (
        <section className="bg-gray-100 py-16 rounded-xl my-16 shadow-xl">
            <div className="container mx-auto px-4 text-center">
                <ScrollReveal>
                    <h2 className="italic text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Nuestro Proceso de Creación
                    </h2>
                </ScrollReveal>
                <ScrollReveal>
                    <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                        Cada pieza que creamos es el resultado de un proceso meticuloso, donde la calidad y la atención al detalle son nuestra máxima prioridad.
                    </p>
                </ScrollReveal>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {procesos.map((proceso, index) => (
                        <ScrollReveal key={index}>
                            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 duration-300">
                                <img 
                                    src={proceso.image} 
                                    alt={proceso.title} 
                                    className="w-full h-48 object-cover rounded-xl mb-4" 
                                />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {proceso.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {proceso.description}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NuestroProceso;
