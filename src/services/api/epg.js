import { apiClient } from './client'
import { ENDPOINTS } from './endpoints'

export const epgService = {
    // Obtener guías EPG
    async getGuides() {
        try {
            const response = await apiClient.get(ENDPOINTS.GUIDES)
            return response.data
        } catch (error) {
            throw new Error('Error fetching EPG guides: ' + error.message)
        }
    },

    // Obtener guía por canal
    async getGuideByChannel(channelId) {
        try {
            const guides = await this.getGuides()
            return guides.filter(guide => guide.channel === channelId)
        } catch (error) {
            throw new Error('Error fetching guide for channel: ' + error.message)
        }
    },

    // Obtener programación actual (mock - en una app real vendría de un servicio EPG)
    async getCurrentProgram(channelId) {
        try {
            // Mock data - en una app real esto vendría de un servicio EPG real
            const mockProgram = {
                id: 'program_' + channelId + '_current',
                channel: channelId,
                title: 'Programa en Vivo',
                description: 'Descripción del programa actual',
                start: new Date().toISOString(),
                end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                category: 'General',
            }

            return mockProgram
        } catch (error) {
            throw new Error('Error fetching current program: ' + error.message)
        }
    },

    // Obtener horario del día
    async getDaySchedule(channelId, date = new Date()) {
        try {
            // Mock data - en una app real esto vendría de un servicio EPG real
            const schedule = []
            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)

            for (let hour = 0; hour < 24; hour += 2) {
                const programStart = new Date(startOfDay)
                programStart.setHours(hour)

                const programEnd = new Date(startOfDay)
                programEnd.setHours(hour + 2)

                schedule.push({
                    id: `program_${channelId}_${hour}`,
                    channel: channelId,
                    title: `Programa ${hour}:00`,
                    description: `Descripción del programa de las ${hour}:00`,
                    start: programStart.toISOString(),
                    end: programEnd.toISOString(),
                    category: 'General',
                })
            }

            return schedule
        } catch (error) {
            throw new Error('Error fetching day schedule: ' + error.message)
        }
    },
}