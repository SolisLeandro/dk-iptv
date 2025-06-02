import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    fetchFilters,
    setSelectedCountry,
    setSelectedCategory,
    setSelectedLanguage,
    clearFilters,
} from '../store/slices/filtersSlice'

export const useFilters = () => {
    const dispatch = useDispatch()
    const filters = useSelector(state => state.filters)

    // Ya no usamos React Query - los datos se cargan desde useInitialLoad
    // Solo retornamos los datos del estado de Redux

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
        isLoading: filters.loading, // Usar el loading del estado Redux
        setCountry,
        setCategory,
        setLanguage,
        clearFilters: resetFilters,
    }
}