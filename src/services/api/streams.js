import { apiClient } from './client'
import { ENDPOINTS } from './endpoints'

export const streamsService = {
    // Obtener todos los streams
    async getStreams() {
        try {
            const response = await apiClient.get(ENDPOINTS.STREAMS)
            return response.data
        } catch (error) {
            throw new Error('Error fetching streams: ' + error.message)
        }
    },

    // Obtener streams por canal
    async getStreamsByChannel(channelId) {
        try {
            const streams = await this.getStreams()
            return streams.filter(stream => stream.channel === channelId)
        } catch (error) {
            throw new Error('Error fetching streams for channel: ' + error.message)
        }
    },

    // Validar si un stream está activo
    async validateStream(streamUrl) {
        try {
            const response = await fetch(streamUrl, {
                method: 'HEAD',
                timeout: 5000
            })
            return response.ok
        } catch (error) {
            return false
        }
    },

    // Obtener calidad de streams disponibles
    async getStreamQualities(channelId) {
        try {
            const streams = await this.getStreamsByChannel(channelId)
            const qualities = streams
                .map(stream => stream.quality)
                .filter(quality => quality)
                .filter((quality, index, arr) => arr.indexOf(quality) === index)

            return qualities.sort((a, b) => {
                const qualityOrder = ['1080p', '720p', '480p', '360p', '240p']
                return qualityOrder.indexOf(a) - qualityOrder.indexOf(b)
            })
        } catch (error) {
            throw new Error('Error getting stream qualities: ' + error.message)
        }
    },
}

