import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import {
    fetchFilters,
    setSelectedCountry,
    setSelectedCategory,
    setSelectedLanguage,
    clearFilters,
} from '../store/slices/filtersSlice'
import { filtersService } from '../services/api/filters'

export const useFilters = () => {
    const dispatch = useDispatch()
    const filters = useSelector(state => state.filters)

    // Query para obtener filtros
    const { data: filtersData, isLoading } = useQuery({
        queryKey: ['filters'],
        queryFn: filtersService.getAllFilters,
        staleTime: 60 * 60 * 1000, // 1 hora (los filtros no cambian frecuentemente)
    })

    // Sincronizar con Redux cuando lleguen los datos
    useEffect(() => {
        if (filtersData) {
            dispatch(fetchFilters.fulfilled(filtersData))
        }
    }, [filtersData, dispatch])

    const setCountry = (country) => {
        dispatch(setSelectedCountry(country))
    }

    const setCategory = (category) => {
        dispatch(setSelectedCategory(category))
    }

    const setLanguage = (language) => {
        dispatch(setSelectedLanguage(language))
    }

    const resetFilters = () => {
        dispatch(clearFilters())
    }

    return {
        ...filters,
        isLoading,
        setCountry,
        setCategory,
        setLanguage,
        clearFilters: resetFilters,
    }
}

