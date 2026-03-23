// =====================================================
// ¿QUÉ ES ESTO?
// Formulario que el usuario llena para finalizar su compra.
// Contiene los campos de contacto (nombre, email, WhatsApp)
// y los de envío (dirección, localidad, provincia, código postal).
//
// ¿CÓMO FUNCIONA?
// 1. Recibe los datos y las funciones desde index.jsx (que los toma de useCheckoutState)
// 2. Cada campo valida al salir del foco: si hay error, muestra el mensaje en rojo
// 3. Al hacer click en "Pagar con Mercado Pago", ejecuta handleSubmit definido en useCheckoutState
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿Los campos no guardan el texto?     Revisá onChange en useCheckoutState.js
// ¿Los errores no aparecen?            Revisá fieldErrors y touched en useCheckoutState.js
// ¿El botón de pago no responde?       Revisá handleSubmit en useCheckoutState.js
// ¿El banner de MP no tiene colores?   Revisá que Tailwind no purgue bg-[#009ee3]
// =====================================================
export const CheckoutForm = ({
    formData,
    fieldErrors,
    touched,
    isAuthenticated,
    loading,
    error,
    onSubmit,
    onChange,
    onBlur,
}) => {
    const getFieldError = (fieldName) => {
        return touched[fieldName] && fieldErrors[fieldName];
    };

    // ======== CLASES DE INPUT ========
    // Varía el borde según si el campo tiene error o no
    // ¿Inputs no se ven? Revisá tailwind.config.js para safelist
    const inputClassName = (fieldName) => {
        const base = "w-full px-4 py-3 rounded-2xl border text-[15px] text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-500 ease-out disabled:opacity-50";
        const errorClass = getFieldError(fieldName)
            ? "border-red-400 dark:border-red-500"
            : "border-slate-200 dark:border-slate-700";
        return `${base} ${errorClass}`;
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">

            {/* ---- Sección: Datos de contacto ---- */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 p-6 sm:p-8">
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-6">Datos de Contacto</h2>

                {/* Mensaje de error global del formulario */}
                {error && (
                    <div className="mb-6 px-4 py-3.5 bg-red-50/80 dark:bg-red-950/20 border border-red-200/60 dark:border-red-700/30 text-red-700 dark:text-red-400 rounded-2xl text-[14px]">
                        {error}
                    </div>
                )}

                {/* Nombre */}
                <div className="mb-5">
                    <label htmlFor="nombre" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
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
                        <p className="text-red-500 dark:text-red-400 text-[13px] mt-1.5">{fieldErrors.nombre}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-5">
                    <label htmlFor="email" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
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
                        <p className="text-red-500 dark:text-red-400 text-[13px] mt-1.5">{fieldErrors.email}</p>
                    )}
                </div>

                {/* WhatsApp */}
                <div className="mb-5">
                    <label htmlFor="whatsapp" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
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
                        <p className="text-red-500 dark:text-red-400 text-[13px] mt-1.5">{fieldErrors.whatsapp}</p>
                    )}
                </div>
            </div>

            {/* ---- Sección: Dirección de envío ---- */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Dirección de Envío</h2>
                    
                </div>

                {/* Domicilio */}
                <div className="mb-5">
                    <label htmlFor="domicilio" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
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
                        <p className="text-red-500 dark:text-red-400 text-[13px] mt-1.5">{fieldErrors.domicilio}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Localidad */}
                    <div>
                        <label htmlFor="localidad" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
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
                            <p className="text-red-500 dark:text-red-400 text-[13px] mt-1.5">{fieldErrors.localidad}</p>
                        )}
                    </div>

                    {/* Provincia */}
                    <div>
                        <label htmlFor="provincia" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
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
                            <p className="text-red-500 dark:text-red-400 text-[13px] mt-1.5">{fieldErrors.provincia}</p>
                        )}
                    </div>
                </div>

                {/* Código Postal */}
                <div className="mt-5">
                    <label htmlFor="codigoPostal" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
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
                        <p className="text-red-500 dark:text-red-400 text-[13px] mt-1.5">{fieldErrors.codigoPostal}</p>
                    )}
                </div>

                {/* Notas Adicionales — campo opcional */}
                <div className="mt-5">
                    <label htmlFor="notasAdicionales" className="block text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 mb-2">
                        Notas Adicionales
                        <span className="ml-1.5 font-normal text-slate-400">(Opcional)</span>
                    </label>
                    <textarea
                        id="notasAdicionales"
                        name="notasAdicionales"
                        value={formData.notasAdicionales}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows="3"
                        placeholder="Instrucciones especiales de entrega, horarios, etc."
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-[15px] text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-500 ease-out disabled:opacity-50 resize-none"
                        disabled={loading}
                    />
                </div>
            </div>

            {/* ======== BANNER MERCADO PAGO OFICIAL ======== */}
            {/* Informa al usuario que será redirigido al entorno seguro de MP */}
            {/* ¿El banner no muestra bien los colores? Revisá que Tailwind no purgue bg-[#009ee3] */}
            <div className="rounded-2xl overflow-hidden border border-[#009ee3]/30 dark:border-[#009ee3]/20">

                {/* Franja superior: logo Mercado Pago en HTML — garantiza visibilidad del nombre */}
                <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: '#009ee3' }}>
                    <div className="flex items-center gap-2.5">
                        {/* Círculo con punto interior = ícono reconocible de Mercado Pago */}
                        <div className="w-7 h-7 rounded-full border-2 border-white/60 flex items-center justify-center flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-white" />
                        </div>
                        <span className="text-white font-bold text-[15px] tracking-tight">
                            Mercado Pago
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/90 text-[11px] font-semibold tracking-widest uppercase">
                            Pago Seguro
                        </span>
                        {/* Ícono candado = cifrado SSL */}
                        <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                {/* Cuerpo con medios de pago realmente disponibles */}
                {/* IMPORTANTE: Solo se listan métodos compatibles con binary_mode:true del backend */}
                {/* Rapipago/Pago Fácil NO están: son pagos pendientes → incompatibles con binary_mode */}
                <div className="px-5 py-4 bg-[#009ee3]/5 dark:bg-[#009ee3]/10">
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                        Al confirmar tu pedido serás redirigido al entorno seguro de Mercado Pago.
                        Tu información de pago nunca pasa por nuestros servidores.
                    </p>

                    {/* Medios habilitados — coherentes con la configuración del backend */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {[
                            'Tarjetas de crédito y débito',
                            'Cuenta Mercado Pago',
                            'Mercado Crédito (cuotas sin tarjeta)',
                            'Hasta 12 cuotas sin interés',
                            'Pago como invitado (sin cuenta)',
                            'Aprobación instantánea',
                        ].map((medio) => (
                            <div key={medio} className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-[#009ee3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-[12px] text-slate-600 dark:text-slate-400">{medio}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ======== BOTÓN OFICIAL MERCADO PAGO ======== */}
            {/* Color oficial MP: #009ee3. NO cambiar por azul genérico */}
            {/* ¿No responde al click? Revisá handleSubmit en useCheckoutState */}
            <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3
                    py-4 rounded-2xl
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-white text-[15px] font-bold tracking-tight
                    transition-all duration-500 ease-out
                    hover:-translate-y-0.5"
                style={{
                    backgroundColor: loading ? '#7EC8E3' : '#009ee3',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(0,158,227,0.35)',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#0080c0'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#009ee3'; }}
            >
                {loading ? (
                    <>
                        {/* Spinner de carga mientras MP procesa */}
                        <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Procesando...
                    </>
                ) : (
                    <>
                        {/* Ícono MP — círculo con punto central, símbolo reconocible */}
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" fill="white" opacity="0.25"/>
                            <circle cx="12" cy="12" r="5" fill="white"/>
                        </svg>
                        Pagar con Mercado Pago
                    </>
                )}
            </button>

            {/* Términos y condiciones — apuntan a la documentación oficial de Mercado Pago */}
            <p className="text-[13px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                Al confirmar aceptás los{' '}
                <a
                    href="https://www.mercadopago.com.ar/ayuda/terminos-y-politicas_194"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#009ee3] hover:underline transition-colors duration-500"
                >
                    Términos y Condiciones
                </a>
                {' '}y la{' '}
                <a
                    href="https://www.mercadopago.com.ar/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#009ee3] hover:underline transition-colors duration-500"
                >
                    Política de Privacidad
                </a>
                {' '}de Mercado Pago.
            </p>
        </form>
    );
};

export default CheckoutForm;
