import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
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
        searchQuery
    } = useSelector(state => state.channels)

    const {
        selectedCountry,
        selectedCategory,
        selectedLanguage
    } = useSelector(state => state.filters)

    // Query para obtener canales con React Query
    const {
        data: channels,
        isLoading: queryLoading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: ['channels'],
        queryFn: channelsService.getChannels,
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
    })

    // Sincronizar con Redux cuando lleguen los datos
    useEffect(() => {
        if (channels && channels !== list) {
            dispatch(fetchChannels.fulfilled(channels))
        }
    }, [channels, dispatch, list])

    // Aplicar filtros cuando cambien
    useEffect(() => {
        if (selectedCountry || selectedCategory || selectedLanguage) {
            dispatch(filterChannels({
                country: selectedCountry,
                category: selectedCategory,
                language: selectedLanguage,
            }))
        } else {
            dispatch(clearFilters())
        }
    }, [selectedCountry, selectedCategory, selectedLanguage, dispatch])

    return {
        channels: filteredList.length > 0 ? filteredList : list,
        allChannels: list,
        filteredChannels: filteredList,
        searchResults,
        isLoading: loading || queryLoading,
        error: error || queryError?.message,
        searchQuery,
        refetch,
    }
}



