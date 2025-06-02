import { createSlice } from '@reduxjs/toolkit'

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        channels: [],
    },
    reducers: {
        addToFavorites: (state, action) => {
            const channel = action.payload
            const exists = state.channels.find(ch => ch.id === channel.id)
            if (!exists) {
                state.channels.push({
                    ...channel,
                    addedAt: channel.addedAt || new Date().toISOString(),
                })
            }
        },
        removeFromFavorites: (state, action) => {
            const channelId = action.payload
            state.channels = state.channels.filter(ch => ch.id !== channelId)
        },
        toggleFavorite: (state, action) => {
            const channel = action.payload
            const exists = state.channels.find(ch => ch.id === channel.id)

            if (exists) {
                state.channels = state.channels.filter(ch => ch.id !== channel.id)
            } else {
                state.channels.push({
                    ...channel,
                    addedAt: channel.addedAt || new Date().toISOString(),
                })
            }
        },
        clearFavorites: (state) => {
            state.channels = []
        },
        // NUEVO: Actualizar información de un favorito específico
        updateFavoriteInfo: (state, action) => {
            const updatedChannel = action.payload
            const index = state.channels.findIndex(ch => ch.id === updatedChannel.id)
            if (index !== -1) {
                state.channels[index] = {
                    ...state.channels[index],
                    ...updatedChannel,
                    // Mantener el timestamp original
                    addedAt: state.channels[index].addedAt,
                }
            }
        },
    },
})

export const {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    updateFavoriteInfo
} = favoritesSlice.actions

export default favoritesSlice.reducer