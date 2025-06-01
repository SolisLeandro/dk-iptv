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
                    addedAt: new Date().toISOString(),
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
                    addedAt: new Date().toISOString(),
                })
            }
        },
        clearFeatured: (state) => {
            state.channels = []
        },
    },
})

export const {
    addToFeatured,
    removeFromFeatured,
    toggleFeatured,
    clearFeatured
} = featuredSlice.actions

export default featuredSlice.reducer