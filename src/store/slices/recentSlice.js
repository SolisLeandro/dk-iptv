import { createSlice } from '@reduxjs/toolkit'

const recentSlice = createSlice({
    name: 'recent',
    initialState: {
        channels: [],
        maxRecent: 20,
    },
    reducers: {
        addToRecent: (state, action) => {
            const channel = action.payload

            // Remover si ya existe
            state.channels = state.channels.filter(ch => ch.id !== channel.id)

            // Agregar al inicio
            state.channels.unshift({
                ...channel,
                watchedAt: new Date().toISOString(),
            })

            // Mantener solo los últimos N canales
            if (state.channels.length > state.maxRecent) {
                state.channels = state.channels.slice(0, state.maxRecent)
            }
        },
        clearRecent: (state) => {
            state.channels = []
        },
    },
})

export const { addToRecent, clearRecent } = recentSlice.actions

export default recentSlice.reducer

