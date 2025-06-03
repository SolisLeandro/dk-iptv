import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        mode: 'auto', // 'light', 'dark', 'auto'
        isDark: false,
    },
    reducers: {
        setThemeMode: (state, action) => {
            state.mode = action.payload
        },
        setIsDark: (state, action) => {
            state.isDark = action.payload
        },
        toggleTheme: (state) => {
            if (state.mode === 'auto') {
                state.mode = 'light'
                state.isDark = false
            } else if (state.mode === 'light') {
                state.mode = 'dark'
                state.isDark = true
            } else {
                state.mode = 'light'
                state.isDark = false
            }
        },
    },
})

export const { setThemeMode, setIsDark, toggleTheme } = themeSlice.actions

export default themeSlice.reducer