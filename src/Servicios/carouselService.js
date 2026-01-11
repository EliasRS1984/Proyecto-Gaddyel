import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://gaddyel-backend.onrender.com';
const API_URL = `${API_BASE}/api/carousel`;

/**
 * Servicio para obtener imágenes del carrusel (frontend público)
 */
const carouselService = {
    getCarouselImages: async () => {
        try {
            // Endpoint correcto: /api/carousel/public
            const response = await axios.get(`${API_URL}/public`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener imágenes del carrusel:', error);
            return [];
        }
    }
};

export default carouselService;
