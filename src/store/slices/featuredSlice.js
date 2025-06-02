
import { createSlice } from '@reduxjs/toolkit'

const featuredSlice = createSlice({
    name: 'featured',
    initialState: {
        channels: [],
    },
    reducers: {
        addToFeatured: (state, action) => {
            const channel = action.payload
            const exists = state.channels.find(ch => ch.id === channel.id)
            if (!exists) {
                state.channels.push({
                    ...channel,
                    addedAt: channel.addedAt || new Date().toISOString(),
                })
            }
        },
        removeFromFeatured: (state, action) => {
            const channelId = action.payload
            state.channels = state.channels.filter(ch => ch.id !== channelId)
        },
        toggleFeatured: (state, action) => {
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
        clearFeatured: (state) => {
            state.channels = []
        },
        // NUEVO: Actualizar información de un destacado específico
        updateFeaturedInfo: (state, action) => {
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
    addToFeatured,
    removeFromFeatured,
    toggleFeatured,
    clearFeatured,
    updateFeaturedInfo
} = featuredSlice.actions

export default featuredSlice.reducer
