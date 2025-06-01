// src/services/api/channels.js
import { apiClient } from './client'
import { ENDPOINTS } from './endpoints'
import { streamsService } from './streams'

export const channelsService = {
    // Obtener todos los canales con streams disponibles
    async getChannels() {
        try {
            console.log('📡 Obteniendo canales y streams...')
            
            // Obtener canales y streams en paralelo
            const [channelsResponse, streamsResponse] = await Promise.all([
                apiClient.get(ENDPOINTS.CHANNELS),
                apiClient.get(ENDPOINTS.STREAMS)
            ])

            const allChannels = channelsResponse.data
            const allStreams = streamsResponse.data

            console.log(`📺 Total canales obtenidos: ${allChannels.length}`)
            console.log(`🎥 Total streams obtenidos: ${allStreams.length}`)

            // Crear un Set de channel IDs que tienen streams disponibles
            const channelsWithStreams = new Set(
                allStreams
                    .filter(stream => stream.channel) // Solo streams con channel ID
                    .map(stream => stream.channel)
            )

            console.log(`✅ Canales con streams: ${channelsWithStreams.size}`)

            // Filtrar solo canales que tienen streams disponibles
            const availableChannels = allChannels.filter(channel => 
                channelsWithStreams.has(channel.id)
            )

            console.log(`🎯 Canales finales disponibles: ${availableChannels.length}`)

            // Enriquecer canales con información de streams
            const enrichedChannels = availableChannels.map(channel => {
                const channelStreams = allStreams.filter(stream => stream.channel === channel.id)
                
                return {
                    ...channel,
                    streamCount: channelStreams.length,
                    hasHDStreams: channelStreams.some(stream => 
                        stream.quality && (stream.quality.includes('720p') || stream.quality.includes('1080p'))
                    ),
                    availableQualities: [...new Set(channelStreams.map(s => s.quality).filter(Boolean))],
                }
            })

            return enrichedChannels
        } catch (error) {
            console.error('❌ Error fetching channels:', error)
            throw new Error('Error fetching channels: ' + error.message)
        }
    },

    // Obtener canal por ID (solo si tiene streams)
    async getChannelById(id) {
        try {
            const channels = await this.getChannels()
            return channels.find(channel => channel.id === id)
        } catch (error) {
            throw new Error('Error fetching channel: ' + error.message)
        }
    },

    // Buscar canales (solo entre los disponibles)
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
                ) ||
                channel.country.toLowerCase().includes(lowercaseQuery) ||
                channel.network?.toLowerCase().includes(lowercaseQuery)
            )
        } catch (error) {
            throw new Error('Error searching channels: ' + error.message)
        }
    },

    // Filtrar canales por país (solo disponibles)
    async getChannelsByCountry(countryCode) {
        try {
            const channels = await this.getChannels()
            return channels.filter(channel => channel.country === countryCode)
        } catch (error) {
            throw new Error('Error filtering channels by country: ' + error.message)
        }
    },

    // Filtrar canales por categoría (solo disponibles)
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

    // Obtener estadísticas de canales disponibles
    async getChannelStats() {
        try {
            const channels = await this.getChannels()
            
            const stats = {
                total: channels.length,
                byCountry: {},
                byCategory: {},
                withHD: channels.filter(ch => ch.hasHDStreams).length,
                avgStreamsPerChannel: Math.round(
                    channels.reduce((sum, ch) => sum + ch.streamCount, 0) / channels.length
                )
            }

            // Contar por país
            channels.forEach(channel => {
                stats.byCountry[channel.country] = (stats.byCountry[channel.country] || 0) + 1
            })

            // Contar por categoría
            channels.forEach(channel => {
                channel.categories?.forEach(category => {
                    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
                })
            })

            return stats
        } catch (error) {
            throw new Error('Error getting channel stats: ' + error.message)
        }
    }
}