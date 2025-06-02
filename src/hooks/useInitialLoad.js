import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { channelsService } from '../services/api/channels'
import { filtersService } from '../services/api/filters'
import { fetchChannels } from '../store/slices/channelsSlice'
import { fetchFilters } from '../store/slices/filtersSlice'

const CACHE_KEY = '@initial_load_complete'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas

export const useInitialLoad = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    
    // Ref para evitar múltiples llamadas
    const isLoadingRef = useRef(false)
    const hasInitializedRef = useRef(false)

    const checkCacheValidity = async () => {
        try {
            const cacheData = await AsyncStorage.getItem(CACHE_KEY)
            if (cacheData) {
                const { timestamp } = JSON.parse(cacheData)
                const now = Date.now()
                return (now - timestamp) < CACHE_EXPIRY
            }
            return false
        } catch (error) {
            console.warn('Error checking cache validity:', error)
            return false
        }
    }

    const setCacheComplete = async () => {
        try {
            const cacheData = {
                timestamp: Date.now(),
                version: '1.0.0'
            }
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        } catch (error) {
            console.warn('Error setting cache:', error)
        }
    }

    const loadInitialData = useCallback(async () => {
        // Evitar múltiples llamadas simultáneas
        if (isLoadingRef.current) {
            console.log('⚠️ Carga ya en progreso, saltando...')
            return
        }

        try {
            isLoadingRef.current = true
            setIsLoading(true)
            setProgress(0)
            setError(null)

            console.log('🚀 Iniciando carga inicial de datos...')

            // Paso 1: Cargar canales (50% del progreso)
            console.log('📡 Cargando canales...')
            setProgress(5)
            
            // Una sola llamada a canales
            const channels = await channelsService.getChannels()
            setProgress(50)
            
            console.log(`✅ Canales cargados: ${channels.length}`)

            // Paso 2: Cargar filtros (35% adicional = 85% total)
            console.log('🔍 Cargando filtros...')
            setProgress(55)
            
            const filters = await filtersService.getAllFilters()
            setProgress(85)
            
            console.log('✅ Filtros cargados')

            // Paso 3: Procesar datos (10% adicional = 95% total)
            console.log('⚙️ Procesando datos...')
            setProgress(90)
            
            // Dispatch a Redux - SIN llamadas adicionales al API
            dispatch(fetchChannels.fulfilled(channels))
            dispatch(fetchFilters.fulfilled(filters))
            
            setProgress(95)

            // Paso 4: Finalizar (5% adicional = 100% total)
            console.log('🎉 Carga inicial completa')
            setProgress(100)
            
            // Marcar como completo en cache
            await setCacheComplete()
            
            // Pequeña pausa antes de completar
            await new Promise(resolve => setTimeout(resolve, 500))
            
        } catch (error) {
            console.error('❌ Error en carga inicial:', error)
            setError(error.message)
        } finally {
            isLoadingRef.current = false
            setIsLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        // Evitar inicialización múltiple
        if (hasInitializedRef.current) {
            return
        }

        const initializeApp = async () => {
            try {
                hasInitializedRef.current = true
                
                // Verificar si ya tenemos datos en cache válidos
                const isCacheValid = await checkCacheValidity()
                
                if (isCacheValid) {
                    console.log('📋 Usando datos del cache')
                    setProgress(100)
                    setIsLoading(false)
                    return
                }

                // Si no hay cache válido, cargar datos
                await loadInitialData()
                
            } catch (error) {
                console.error('❌ Error inicializando app:', error)
                setError(error.message)
                setIsLoading(false)
            }
        }

        initializeApp()
    }, [loadInitialData])

    const retryLoad = useCallback(() => {
        isLoadingRef.current = false
        hasInitializedRef.current = false
        setError(null)
        loadInitialData()
    }, [loadInitialData])

    const forceReload = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(CACHE_KEY)
            isLoadingRef.current = false
            hasInitializedRef.current = false
            setError(null)
            await loadInitialData()
        } catch (error) {
            console.error('Error forcing reload:', error)
        }
    }, [loadInitialData])

    return {
        isLoading,
        progress,
        error,
        retryLoad,
        forceReload,
    }
}