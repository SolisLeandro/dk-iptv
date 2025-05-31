import { apiClient } from './client'
import { ENDPOINTS } from './endpoints'

export const filtersService = {
    // Obtener países
    async getCountries() {
        try {
            const response = await apiClient.get(ENDPOINTS.COUNTRIES)
            return response.data
        } catch (error) {
            throw new Error('Error fetching countries: ' + error.message)
        }
    },

    // Obtener categorías
    async getCategories() {
        try {
            const response = await apiClient.get(ENDPOINTS.CATEGORIES)
            return response.data
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message)
        }
    },

    // Obtener idiomas
    async getLanguages() {
        try {
            const response = await apiClient.get(ENDPOINTS.LANGUAGES)
            return response.data
        } catch (error) {
            throw new Error('Error fetching languages: ' + error.message)
        }
    },

    // Obtener regiones
    async getRegions() {
        try {
            const response = await apiClient.get(ENDPOINTS.REGIONS)
            return response.data
        } catch (error) {
            throw new Error('Error fetching regions: ' + error.message)
        }
    },

    // Obtener subdivisiones
    async getSubdivisions() {
        try {
            const response = await apiClient.get(ENDPOINTS.SUBDIVISIONS)
            return response.data
        } catch (error) {
            throw new Error('Error fetching subdivisions: ' + error.message)
        }
    },

    // Obtener todos los filtros de una vez
    async getAllFilters() {
        try {
            const [countries, categories, languages, regions] = await Promise.all([
                this.getCountries(),
                this.getCategories(),
                this.getLanguages(),
                this.getRegions(),
            ])

            return {
                countries,
                categories,
                languages,
                regions,
            }
        } catch (error) {
            throw new Error('Error fetching filters: ' + error.message)
        }
    },
}

