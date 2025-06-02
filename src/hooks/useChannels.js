
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    fetchChannels,
    filterChannels,
    clearFilters
} from '../store/slices/channelsSlice'
import { channelsService } from '../services/api/channels'

export const useChannels = () => {
    const dispatch = useDispatch()
    const {
        list,
        filteredList,
        searchResults,
        loading,
        error,
        searchQuery,
        initialized
    } = useSelector(state => state.channels)

    const {
        selectedCountry,
        selectedCategory,
        selectedLanguage
    } = useSelector(state => state.filters)

    // Aplicar filtros cuando cambien
    useEffect(() => {
        if (list.length > 0) {
            if (selectedCountry || selectedCategory || selectedLanguage) {
                dispatch(filterChannels({
                    country: selectedCountry,
                    category: selectedCategory,
                    language: selectedLanguage,
                }))
            } else {
                dispatch(clearFilters())
            }
        }
    }, [selectedCountry, selectedCategory, selectedLanguage, dispatch, list])

    // Función de refetch manual (NO automática)
    const refetch = async () => {
        try {
            console.log('🔄 Recargando canales manualmente...')
            dispatch(fetchChannels.pending())
            const channels = await channelsService.getChannels()
            dispatch(fetchChannels.fulfilled(channels))
            console.log('✅ Canales recargados')
        } catch (error) {
            console.error('❌ Error recargando canales:', error)
            dispatch(fetchChannels.rejected(error.message))
        }
    }

    // Determinar qué canales mostrar
    const getDisplayChannels = () => {
        // Si hay filtros activos, usar la lista filtrada
        if (selectedCountry || selectedCategory || selectedLanguage) {
            return filteredList
        }
        // Si no hay filtros, usar la lista completa
        return list
    }

    const displayChannels = getDisplayChannels()

    return {
        channels: displayChannels,
        allChannels: list,
        filteredChannels: filteredList,
        searchResults,
        isLoading: loading,
        error,
        searchQuery,
        refetch,
        hasActiveFilters: !!(selectedCountry || selectedCategory || selectedLanguage),
        totalChannels: list.length,
        filteredCount: displayChannels.length,
        initialized, // Para saber si ya se cargaron los datos iniciales
    }
}
