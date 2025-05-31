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
                state.channels.push(channel)
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
                state.channels.push(channel)
            }
        },
        clearFavorites: (state) => {
            state.channels = []
        },
    },
})

export const {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites
} = favoritesSlice.actions

export default favoritesSlice.reducer

