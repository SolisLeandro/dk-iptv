import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightTheme, darkTheme } from '../theme'

const ThemeContext = createContext()

const THEME_STORAGE_KEY = '@theme_mode'

const themeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_THEME':
            const newMode = action.payload
            const systemColorScheme = useColorScheme()
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
        loadTheme()
    }, [])

    useEffect(() => {
        dispatch({ type: 'SET_SYSTEM_THEME', payload: systemColorScheme || 'light' })
    }, [systemColorScheme])

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
            if (savedTheme) {
                dispatch({ type: 'SET_THEME', payload: savedTheme })
            }
        } catch (error) {
            console.error('Error loading theme:', error)
        }
    }

    const setTheme = async (mode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
            dispatch({ type: 'SET_THEME', payload: mode })
        } catch (error) {
            console.error('Error saving theme:', error)
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

