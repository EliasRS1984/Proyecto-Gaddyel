import { Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

/**
 * ============================================================================
 * ICONO DEL CARRITO DE COMPRAS
 * ============================================================================
 * 
 * ¿QUÉ ES ESTO?
 * Un icono que muestra el carrito de compras con un contador de productos.
 * Al hacer click, lleva al usuario a la página del carrito.
 * 
 * ¿CÓMO FUNCIONA?
 * 1. Obtiene el número de items del carrito desde CartContext
 * 2. Muestra un badge con el número solo si hay items
 * 3. El icono cambia de color al hacer hover
 * 4. En modo oscuro, ajusta los colores automáticamente
 * 
 * ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
 * → "No se ve el contador": Revisa useCart() y la variable itemCount
 * → "El icono no se ve en dark mode": Revisa las clases dark:text-xxx
 * → "El badge no aparece": Revisa la condición !isEmpty
 */

export const CartIcon = () => {
    const { itemCount, isEmpty } = useCart();

    return (
        <Link 
            to="/carrito"
            className="relative inline-flex items-center justify-center group"
            aria-label={`Ver carrito ${!isEmpty ? `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})` : ''}`}
            title={`Carrito de compras${!isEmpty ? ` - ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}` : ''}`}
        >
            {/* ================================================================
                ICONO DEL CARRITO
                En modo claro: slate-700
                En modo oscuro: slate-300
                Hover: se vuelve slate-900 / slate-50 (más oscuro/claro)
            ================================================================ */}
            <svg 
                className="w-7 h-7 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-500 ease-out" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2}
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
            </svg>

            {/* ================================================================
                BADGE CON CONTADOR DE ITEMS
                Solo se muestra si hay productos en el carrito.
                Diseño: Ring system elegante (no fondo rojo agresivo)
                
                ¿El badge no aparece? Revisa useCart() y !isEmpty
            ================================================================ */}
            {!isEmpty && (
                <span
                    // aria-live="polite": cuando el número cambia (el usuario agrega un
                    // producto), el lector de pantalla lo anuncia sin interrumpir al usuario.
                    // aria-atomic="true": anuncia el contenido completo del badge, no solo
                    // el carácter que cambió.
                    aria-live="polite"
                    aria-atomic="true"
                    className="
                        absolute -top-1.5 -right-1.5
                        min-w-[20px] h-5 px-1.5
                        flex items-center justify-center
                        bg-slate-900 dark:bg-slate-100
                        text-white dark:text-slate-900
                        text-[11px] font-bold tracking-tight
                        rounded-full
                        ring-2 ring-white dark:ring-slate-950
                        shadow-lg
                        transition-all duration-500 ease-out
                        group-hover:ring-slate-100 dark:group-hover:ring-slate-900
                        group-hover:scale-110
                    "
                >
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </Link>
    );
};

export default CartIcon;
