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

            if (country) {
                filtered = filtered.filter(channel => channel.country === country)
            }
            if (category) {
                filtered = filtered.filter(channel =>
                    channel.categories?.includes(category)
                )
            }
            if (language) {
                // Filtrar por idioma (necesitaríamos datos de feeds para esto)
                // Por ahora dejamos la lógica preparada
            }

            state.filteredList = filtered
        },
        clearFilters: (state) => {
            state.filteredList = state.list
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
                state.filteredList = action.payload
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

