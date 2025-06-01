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

    // Query para obtener países
    const { data: countriesData, isLoading: countriesLoading } = useQuery({
        queryKey: ['countries'],
        queryFn: filtersService.getCountries,
        staleTime: 60 * 60 * 1000, // 1 hora
    })

    // Query para obtener categorías
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: filtersService.getCategories,
        staleTime: 60 * 60 * 1000, // 1 hora
    })

    // Query para obtener idiomas
    const { data: languagesData, isLoading: languagesLoading } = useQuery({
        queryKey: ['languages'],
        queryFn: filtersService.getLanguages,
        staleTime: 60 * 60 * 1000, // 1 hora
    })

    // Sincronizar con Redux cuando lleguen los datos
    useEffect(() => {
        if (countriesData && categoriesData && languagesData) {
            const filtersData = {
                countries: countriesData,
                categories: categoriesData,
                languages: languagesData,
                regions: [] // No lo usamos por ahora
            }
            dispatch(fetchFilters.fulfilled(filtersData))
        }
    }, [countriesData, categoriesData, languagesData, dispatch])

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
        isLoading: countriesLoading || categoriesLoading || languagesLoading,
        setCountry,
        setCategory,
        setLanguage,
        clearFilters: resetFilters,
    }
}