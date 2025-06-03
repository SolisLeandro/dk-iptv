import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useColorScheme, Platform, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as NavigationBar from 'expo-navigation-bar'
import { lightTheme, darkTheme } from '../theme'

const ThemeContext = createContext()

const THEME_STORAGE_KEY = '@theme_mode'

const themeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_THEME':
            const newMode = action.payload
            const systemColorScheme = action.systemColorScheme || 'light'
            const isDark = newMode === 'auto'
                ? systemColorScheme === 'dark'
                : newMode === 'dark'

            return {
                mode: newMode,
                colors: isDark ? darkTheme.colors : lightTheme.colors,
                isDark,
            }

        case 'SET_SYSTEM_THEME':
            if (state.mode === 'auto') {
                const isDark = action.payload === 'dark'
                return {
                    ...state,
                    colors: isDark ? darkTheme.colors : lightTheme.colors,
                    isDark,
                }
            }
            return state

        default:
            return state
    }
}

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme()

    const [state, dispatch] = useReducer(themeReducer, {
        mode: 'auto',
        colors: systemColorScheme === 'dark' ? darkTheme.colors : lightTheme.colors,
        isDark: systemColorScheme === 'dark',
    })

    useEffect(() => {
        console.log('🎨 Inicializando ThemeProvider...')
        loadTheme()
    }, [])

    useEffect(() => {
        console.log('🎨 Sistema cambió a:', systemColorScheme)
        dispatch({ type: 'SET_SYSTEM_THEME', payload: systemColorScheme || 'light' })
    }, [systemColorScheme])

    // Configurar barras del sistema para la app normal
    useEffect(() => {
        const configureAppBars = async () => {
            if (Platform.OS === 'android') {
                try {
                    console.log('📱 Configurando barras para la app normal')
                    
                    // StatusBar: transparente con iconos según el tema
                    StatusBar.setHidden(false, 'fade')
                    StatusBar.setTranslucent(true)
                    StatusBar.setBackgroundColor('rgba(0,0,0,0)', true) // Transparente
                    StatusBar.setBarStyle(state.isDark ? 'light-content' : 'dark-content', true)
                    
                    // NavigationBar: color de la superficie de la app
                    await NavigationBar.setVisibilityAsync('visible')
                    await NavigationBar.setBackgroundColorAsync(state.colors.surface)
                    await NavigationBar.setButtonStyleAsync(state.isDark ? 'light' : 'dark')
                    
                    console.log(`✅ Barras del sistema configuradas para app: ${state.isDark ? 'dark' : 'light'}`)
                } catch (error) {
                    console.warn('⚠️ Error configurando barras de la app:', error)
                }
            }
        }

        configureAppBars()
    }, [state.isDark, state.colors])

    const loadTheme = async () => {
        try {
            console.log('📱 Cargando tema guardado...')
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
            if (savedTheme) {
                console.log('✅ Tema cargado:', savedTheme)
                dispatch({ 
                    type: 'SET_THEME', 
                    payload: savedTheme,
                    systemColorScheme: systemColorScheme || 'light'
                })
            }
        } catch (error) {
            console.error('❌ Error loading theme:', error)
        }
    }

    const setTheme = async (mode) => {
        try {
            console.log('🎨 Guardando tema:', mode)
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
            dispatch({ 
                type: 'SET_THEME', 
                payload: mode,
                systemColorScheme: systemColorScheme || 'light'
            })
        } catch (error) {
            console.error('❌ Error saving theme:', error)
        }
    }

    const toggleTheme = () => {
        const newMode = state.isDark ? 'light' : 'dark'
        setTheme(newMode)
    }

    return (
        <ThemeContext.Provider value={{ 
            ...state, 
            setTheme, 
            toggleTheme,
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

// NUEVO: Funciones utilitarias para configurar barras del sistema
export const configurePlayerBars = async (isDark, colors, isFullscreen = false) => {
    if (Platform.OS === 'android') {
        try {
            if (isFullscreen) {
                // Pantalla completa: barras ocultas
                console.log('🎬 Configurando barras para pantalla completa')
                StatusBar.setHidden(true, 'fade')
                await NavigationBar.setVisibilityAsync('hidden')
            } else {
                // Reproductor normal: StatusBar oculta, NavigationBar con color del selector
                console.log('🎥 Configurando barras para reproductor normal')
                StatusBar.setHidden(true, 'fade')
                await NavigationBar.setVisibilityAsync('visible')
                await NavigationBar.setBackgroundColorAsync(colors.surface)
                await NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark')
            }
            
            console.log(`✅ Barras del reproductor configuradas: ${isFullscreen ? 'fullscreen' : 'normal'}`)
        } catch (error) {
            console.warn('⚠️ Error configurando barras del reproductor:', error)
        }
    }
}

export const restoreAppBars = async (isDark, colors) => {
    if (Platform.OS === 'android') {
        try {
            console.log('📱 Restaurando barras de la app')
            
            // StatusBar: transparente con iconos según el tema
            StatusBar.setHidden(false, 'fade')
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('rgba(0,0,0,0)', true) // Transparente
            StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true)
            
            // NavigationBar: color de la superficie de la app
            await NavigationBar.setVisibilityAsync('visible')
            await NavigationBar.setBackgroundColorAsync(colors.surface)
            await NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark')
            
            console.log(`✅ Barras de la app restauradas: ${isDark ? 'dark' : 'light'}`)
        } catch (error) {
            console.warn('⚠️ Error restaurando barras de la app:', error)
        }
    }
}