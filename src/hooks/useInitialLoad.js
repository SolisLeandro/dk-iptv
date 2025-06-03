import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { channelsService } from '../services/api/channels'
import { filtersService } from '../services/api/filters'
import { fetchChannels } from '../store/slices/channelsSlice'
import { fetchFilters } from '../store/slices/filtersSlice'

const CACHE_KEY = '@initial_load_complete'
const CACHE_DATA_KEY = '@cached_app_data'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas

export const useInitialLoad = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)

    // Verificar si ya hay datos en Redux
    const channelsInRedux = useSelector(state => state.channels.list)
    const filtersInRedux = useSelector(state => state.filters.countries)

    // Ref para evitar múltiples llamadas
    const isLoadingRef = useRef(false)
    const hasInitializedRef = useRef(false)

    // NUEVO: Estado para controlar cuándo empezar la carga
    const [shouldStartLoading, setShouldStartLoading] = useState(false)

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

    // Función para comprimir datos antes del cache
    const compressDataForCache = (channels, filters) => {
        // Solo guardar los campos esenciales de los canales
        const compressedChannels = channels.map(channel => ({
            id: channel.id,
            name: channel.name,
            country: channel.country,
            categories: channel.categories,
            logo: channel.logo,
            streamCount: channel.streamCount,
            hasHDStreams: channel.hasHDStreams,
            availableQualities: channel.availableQualities,
            // Omitir campos grandes como alt_names, network, etc.
        }))

        return {
            channels: compressedChannels,
            filters: filters,
            compressed: true,
            timestamp: Date.now()
        }
    }

    const loadCachedData = async () => {
        try {
            const cachedDataString = await AsyncStorage.getItem(CACHE_DATA_KEY)
            if (cachedDataString) {
                // Verificar tamaño del cache
                const sizeInBytes = new Blob([cachedDataString]).size
                const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)
                console.log(`📦 Tamaño del cache: ${sizeInMB} MB`)

                if (sizeInBytes > 2 * 1024 * 1024) { // Si es mayor a 2MB
                    console.warn('⚠️ Cache muy grande, limpiando...')
                    await AsyncStorage.removeItem(CACHE_DATA_KEY)
                    return false
                }

                const cachedData = JSON.parse(cachedDataString)

                if (cachedData && cachedData.channels && cachedData.filters) {
                    console.log('📋 Cargando datos del cache a Redux...')
                    console.log(`📺 Canales en cache: ${cachedData.channels.length}`)
                    console.log(`🔍 Países en cache: ${cachedData.filters.countries?.length || 0}`)

                    // Cargar datos a Redux (los datos ya están comprimidos apropiadamente)
                    dispatch(fetchChannels.fulfilled(cachedData.channels))
                    dispatch(fetchFilters.fulfilled(cachedData.filters))

                    return true
                }
            }
            return false
        } catch (error) {
            console.warn('Error loading cached data:', error)
            console.log('🧹 Limpiando cache corrupto...')

            // Limpiar cache corrupto
            try {
                await AsyncStorage.removeItem(CACHE_DATA_KEY)
                await AsyncStorage.removeItem(CACHE_KEY)
            } catch (cleanError) {
                console.warn('Error cleaning corrupted cache:', cleanError)
            }

            return false
        }
    }

    const saveCachedData = async (channels, filters) => {
        try {
            console.log('💾 Preparando datos para cache...')

            // Comprimir datos para reducir tamaño
            const compressedData = compressDataForCache(channels, filters)
            const dataString = JSON.stringify(compressedData)

            // Verificar tamaño antes de guardar
            const sizeInBytes = new Blob([dataString]).size
            const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)

            console.log(`📦 Tamaño de datos comprimidos: ${sizeInMB} MB`)

            if (sizeInBytes > 2 * 1024 * 1024) { // Límite de 2MB
                console.warn('⚠️ Datos muy grandes para cache, saltando...')
                return
            }

            await AsyncStorage.setItem(CACHE_DATA_KEY, dataString)

            const cacheInfo = {
                timestamp: Date.now(),
                version: '1.0.0',
                size: sizeInMB + ' MB'
            }
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheInfo))

            console.log('✅ Datos guardados en cache exitosamente')
        } catch (error) {
            console.warn('Error saving cached data:', error)

            if (error.message?.includes('quota') || error.message?.includes('storage')) {
                console.log('🚫 Storage lleno, limpiando cache antiguo...')
                try {
                    await AsyncStorage.removeItem(CACHE_DATA_KEY)
                    await AsyncStorage.removeItem(CACHE_KEY)
                } catch (cleanError) {
                    console.warn('Error cleaning storage:', cleanError)
                }
            }
        }
    }

    const loadInitialData = useCallback(async () => {
        // NUEVO: No cargar si no se debe empezar
        if (!shouldStartLoading) {
            console.log('⏸️ Esperando para empezar la carga de datos...')
            return
        }

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

            const channels = await channelsService.getChannels()
            setProgress(50)

            console.log(`✅ Canales cargados: ${channels.length}`)

            // Paso 2: Cargar filtros (35% adicional = 85% total)
            console.log('🔍 Cargando filtros...')
            setProgress(55)

            const filters = await filtersService.getAllFilters()
            setProgress(85)

            console.log('✅ Filtros cargados')

            // Paso 3: Guardar en Redux Y cache (10% adicional = 95% total)
            console.log('⚙️ Procesando datos...')
            setProgress(90)

            // Dispatch a Redux
            dispatch(fetchChannels.fulfilled(channels))
            dispatch(fetchFilters.fulfilled(filters))

            // Guardar en cache para próximas sesiones (async, no bloquea)
            saveCachedData(channels, filters).catch(console.warn)

            setProgress(95)

            // Paso 4: Finalizar (5% adicional = 100% total)
            console.log('🎉 Carga inicial completa')
            setProgress(100)

            // Pequeña pausa antes de completar
            await new Promise(resolve => setTimeout(resolve, 500))

        } catch (error) {
            console.error('❌ Error en carga inicial:', error)
            setError(error.message)
        } finally {
            isLoadingRef.current = false
            setIsLoading(false)
        }
    }, [dispatch, shouldStartLoading]) // AGREGADO shouldStartLoading como dependencia

    // NUEVO: Hook para activar la carga cuando se permita
    useEffect(() => {
        if (shouldStartLoading && !hasInitializedRef.current) {
            const initializeApp = async () => {
                try {
                    hasInitializedRef.current = true

                    // PRIMERO: Verificar si ya hay datos en Redux (puede ser de persistencia)
                    if (channelsInRedux.length > 0 && filtersInRedux.length > 0) {
                        console.log('📊 Datos ya disponibles en Redux')
                        setProgress(100)
                        setIsLoading(false)
                        return
                    }

                    // SEGUNDO: Verificar si hay datos válidos en cache
                    const isCacheValid = await checkCacheValidity()

                    if (isCacheValid) {
                        console.log('📋 Usando datos del cache')
                        const loaded = await loadCachedData()

                        if (loaded) {
                            setProgress(100)
                            setIsLoading(false)
                            return
                        } else {
                            console.log('⚠️ Cache inválido, cargando datos frescos...')
                        }
                    }

                    // TERCERO: Si no hay datos válidos, cargar desde API
                    console.log('🌐 Cargando datos desde API...')
                    await loadInitialData()

                } catch (error) {
                    console.error('❌ Error inicializando app:', error)
                    setError(error.message)
                    setIsLoading(false)
                }
            }

            initializeApp()
        }
    }, [shouldStartLoading, loadInitialData, channelsInRedux.length, filtersInRedux.length])

    // NUEVO: Función para permitir la carga (será llamada desde App.js)
    const allowLoading = useCallback(() => {
        console.log('🎯 Permitiendo carga de datos...')
        setShouldStartLoading(true)
    }, [])

    // EFECTO: Auto-permitir carga después de cierto tiempo como fallback
    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            if (!shouldStartLoading) {
                console.log('⏰ Fallback: permitiendo carga después de 3 segundos')
                setShouldStartLoading(true)
            }
        }, 3000) // 3 segundos como fallback

        return () => clearTimeout(fallbackTimer)
    }, [shouldStartLoading])

    const retryLoad = useCallback(() => {
        isLoadingRef.current = false
        hasInitializedRef.current = false
        setError(null)
        setShouldStartLoading(true) // Permitir carga en retry
        loadInitialData()
    }, [loadInitialData])

    const forceReload = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(CACHE_KEY)
            await AsyncStorage.removeItem(CACHE_DATA_KEY)
            isLoadingRef.current = false
            hasInitializedRef.current = false
            setError(null)
            setShouldStartLoading(true) // Permitir carga en force reload
            await loadInitialData()
        } catch (error) {
            console.error('Error forcing reload:', error)
        }
    }, [loadInitialData])

    // Función pública para limpiar cache
    const clearCache = useCallback(async () => {
        try {
            console.log('🧹 Limpiando cache...')
            await AsyncStorage.removeItem(CACHE_KEY)
            await AsyncStorage.removeItem(CACHE_DATA_KEY)
            console.log('✅ Cache limpiado exitosamente')
            return true
        } catch (error) {
            console.error('❌ Error limpiando cache:', error)
            return false
        }
    }, [])

    return {
        isLoading,
        progress,
        error,
        retryLoad,
        forceReload,
        clearCache,
        allowLoading, // NUEVO: función para permitir carga
        shouldStartLoading, // NUEVO: estado para saber si se debe cargar
    }
}