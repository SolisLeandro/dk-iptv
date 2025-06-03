import { useSelector, useDispatch } from 'react-redux'
import { useColorScheme } from 'react-native'
import { setThemeMode, setIsDark } from '../store/slices/themeSlice'
import { lightTheme, darkTheme } from '../theme'

export const useTheme = () => {
    const dispatch = useDispatch()
    const systemColorScheme = useColorScheme()
    const { mode, isDark: storedIsDark } = useSelector(state => state.theme)

    // Determinar si debe usar tema oscuro
    const isDark = mode === 'auto'
        ? systemColorScheme === 'dark'
        : mode === 'dark'

    // Actualizar estado si cambió el sistema
    if (mode === 'auto' && isDark !== storedIsDark) {
        dispatch(setIsDark(isDark))
    }

    const colors = isDark ? darkTheme.colors : lightTheme.colors

    const setTheme = (newMode) => {
        dispatch(setThemeMode(newMode))
        const newIsDark = newMode === 'auto'
            ? systemColorScheme === 'dark'
            : newMode === 'dark'
        dispatch(setIsDark(newIsDark))
    }

    return {
        mode,
        isDark,
        colors,
        setTheme,
    }
}

