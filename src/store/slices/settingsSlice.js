import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        autoPlay: true,
        wifiOnly: false,
        autoUpdate: true,
        notifications: true,
        privateMode: false,
        analytics: false,
        defaultQuality: 'auto',
        autoRotate: true,
        volumeButtons: true,
        language: 'es',
    },
    reducers: {
        updateSetting: (state, action) => {
            const { key, value } = action.payload
            state[key] = value
        },
        resetSettings: (state) => {
            return {
                autoPlay: true,
                wifiOnly: false,
                autoUpdate: true,
                notifications: true,
                privateMode: false,
                analytics: false,
                defaultQuality: 'auto',
                autoRotate: true,
                volumeButtons: true,
                language: 'es',
            }
        },
    },
})

export const { updateSetting, resetSettings } = settingsSlice.actions

export default settingsSlice.reducer

