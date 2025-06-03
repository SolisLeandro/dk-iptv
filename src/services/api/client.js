import axios from 'axios'

const BASE_URL = 'https://iptv-org.github.io/api'

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptors para manejo de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error)
        return Promise.reject(error)
    }
)


