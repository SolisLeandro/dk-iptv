import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers } from '@reduxjs/toolkit'

// Slices
import channelsSlice from './slices/channelsSlice'
import filtersSlice from './slices/filtersSlice'
import favoritesSlice from './slices/favoritesSlice'
import featuredSlice from './slices/featuredSlice' // NUEVO
import themeSlice from './slices/themeSlice'
import playerSlice from './slices/playerSlice'
import recentSlice from './slices/recentSlice'
import settingsSlice from './slices/settingsSlice'

// Configuración de persistencia
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['favorites', 'featured', 'theme', 'recent', 'settings'], // AGREGADO featured
}

const rootReducer = combineReducers({
    channels: channelsSlice,
    filters: filtersSlice,
    favorites: favoritesSlice,
    featured: featuredSlice, // NUEVO
    theme: themeSlice,
    player: playerSlice,
    recent: recentSlice,
    settings: settingsSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)