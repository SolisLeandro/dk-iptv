import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { channelsService } from '../../services/api/channels'

// Async thunks
export const fetchChannels = createAsyncThunk(
    'channels/fetchChannels',
    async (_, { rejectWithValue }) => {
        try {
            const channels = await channelsService.getChannels()
            return channels
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const searchChannels = createAsyncThunk(
    'channels/searchChannels',
    async (query, { rejectWithValue }) => {
        try {
            const channels = await channelsService.searchChannels(query)
            return channels
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const channelsSlice = createSlice({
    name: 'channels',
    initialState: {
        list: [],
        filteredList: [],
        searchResults: [],
        loading: false,
        error: null,
        searchQuery: '',
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        },
        clearSearch: (state) => {
            state.searchQuery = ''
            state.searchResults = []
        },
        filterChannels: (state, action) => {
            const { country, category, language } = action.payload
            let filtered = [...state.list]

            console.log('🔍 Aplicando filtros:', { country, category, language })
            console.log('📊 Canales antes del filtro:', filtered.length)

            if (country) {
                filtered = filtered.filter(channel => channel.country === country)
                console.log(`🌍 Después del filtro por país (${country}):`, filtered.length)
            }

            if (category) {
                filtered = filtered.filter(channel =>
                    channel.categories?.includes(category)
                )
                console.log(`📺 Después del filtro por categoría (${category}):`, filtered.length)
            }

            if (language) {
                // Para el filtro de idioma necesitaríamos datos de feeds/streams
                // Por ahora lo dejamos preparado
                console.log(`🗣️ Filtro por idioma (${language}) - no implementado aún`)
            }

            state.filteredList = filtered
            console.log('✅ Canales filtrados final:', filtered.length)
        },
        clearFilters: (state) => {
            console.log('🧹 Limpiando filtros')
            state.filteredList = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
                // Si no hay filtros activos, limpiar la lista filtrada
                if (state.filteredList.length === 0) {
                    state.filteredList = []
                }
                console.log('📡 Canales cargados:', action.payload.length)
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(searchChannels.fulfilled, (state, action) => {
                state.searchResults = action.payload
            })
    },
})

export const {
    setSearchQuery,
    clearSearch,
    filterChannels,
    clearFilters
} = channelsSlice.actions

export default channelsSlice.reducer