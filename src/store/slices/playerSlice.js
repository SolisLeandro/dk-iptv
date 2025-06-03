import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
    name: 'player',
    initialState: {
        currentChannel: null,
        currentStream: null,
        isPlaying: false,
        isFullscreen: false,
        volume: 1.0,
        position: 0,
        duration: 0,
        isLoading: false,
        error: null,
        quality: 'auto',
    },
    reducers: {
        setCurrentChannel: (state, action) => {
            state.currentChannel = action.payload
        },
        setCurrentStream: (state, action) => {
            state.currentStream = action.payload
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload
        },
        setIsFullscreen: (state, action) => {
            state.isFullscreen = action.payload
        },
        setVolume: (state, action) => {
            state.volume = action.payload
        },
        setPosition: (state, action) => {
            state.position = action.payload
        },
        setDuration: (state, action) => {
            state.duration = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setQuality: (state, action) => {
            state.quality = action.payload
        },
        resetPlayer: (state) => {
            state.currentChannel = null
            state.currentStream = null
            state.isPlaying = false
            state.isFullscreen = false
            state.position = 0
            state.duration = 0
            state.isLoading = false
            state.error = null
        },
    },
})

export const {
    setCurrentChannel,
    setCurrentStream,
    setIsPlaying,
    setIsFullscreen,
    setVolume,
    setPosition,
    setDuration,
    setIsLoading,
    setError,
    setQuality,
    resetPlayer,
} = playerSlice.actions

export default playerSlice.reducer

