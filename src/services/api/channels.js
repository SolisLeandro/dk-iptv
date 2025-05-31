import { apiClient } from './client'
import { ENDPOINTS } from './endpoints'

export const channelsService = {
    // Obtener todos los canales
    async getChannels() {
        try {
            const response = await apiClient.get(ENDPOINTS.CHANNELS)
            return response.data
        } catch (error) {
            throw new Error('Error fetching channels: ' + error.message)
        }
    },

    // Obtener canal por ID
    async getChannelById(id) {
        try {
            const channels = await this.getChannels()
            return channels.find(channel => channel.id === id)
        } catch (error) {
            throw new Error('Error fetching channel: ' + error.message)
        }
    },

    // Buscar canales
    async searchChannels(query) {
        try {
            const channels = await this.getChannels()
            const lowercaseQuery = query.toLowerCase()

            return channels.filter(channel =>
                channel.name.toLowerCase().includes(lowercaseQuery) ||
                channel.alt_names?.some(name =>
                    name.toLowerCase().includes(lowercaseQuery)
                ) ||
                channel.categories?.some(category =>
                    category.toLowerCase().includes(lowercaseQuery)
                )
            )
        } catch (error) {
            throw new Error('Error searching channels: ' + error.message)
        }
    },

    // Filtrar canales por país
    async getChannelsByCountry(countryCode) {
        try {
            const channels = await this.getChannels()
            return channels.filter(channel => channel.country === countryCode)
        } catch (error) {
            throw new Error('Error filtering channels by country: ' + error.message)
        }
    },

    // Filtrar canales por categoría
    async getChannelsByCategory(category) {
        try {
            const channels = await this.getChannels()
            return channels.filter(channel =>
                channel.categories?.includes(category)
            )
        } catch (error) {
            throw new Error('Error filtering channels by category: ' + error.message)
        }
    },
}
