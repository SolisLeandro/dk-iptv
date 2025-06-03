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

// Función para actualizar la barra de navegación de Android
const updateNavigationBar = async (isDark, colors) => {
    if (Platform.OS === 'android') {
        try {
            // Configurar color de fondo de la barra de navegación
            await NavigationBar.setBackgroundColorAsync(
                isDark ? colors.surface : '#FFFFFF'
            )
            
            // Configurar estilo de los botones (light/dark)
            await NavigationBar.setButtonStyleAsync(
                isDark ? 'light' : 'dark'
            )
            
            console.log(`🎨 Navigation bar actualizada: ${isDark ? 'dark' : 'light'}`)
        } catch (error) {
            console.warn('⚠️ Error actualizando navigation bar:', error)
        }
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

    // Efecto para actualizar la barra de navegación cuando cambie el tema
    useEffect(() => {
        updateNavigationBar(state.isDark, state.colors)
        
        // También actualizar StatusBar
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(state.colors.surface, true)
            StatusBar.setBarStyle(state.isDark ? 'light-content' : 'dark-content', true)
        }
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
        <ThemeContext.Provider value={{ ...state, setTheme, toggleTheme }}>
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