import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { filtersService } from '../../services/api/filters'

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async (_, { rejectWithValue }) => {
        try {
            const filters = await filtersService.getAllFilters()
            return filters
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        countries: [],
        categories: [],
        languages: [],
        regions: [],
        selectedCountry: null,
        selectedCategory: null,
        selectedLanguage: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedCountry: (state, action) => {
            state.selectedCountry = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },
        setSelectedLanguage: (state, action) => {
            state.selectedLanguage = action.payload
        },
        clearFilters: (state) => {
            state.selectedCountry = null
            state.selectedCategory = null
            state.selectedLanguage = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.loading = false
                state.countries = action.payload.countries
                state.categories = action.payload.categories
                state.languages = action.payload.languages
                state.regions = action.payload.regions
            })
            .addCase(fetchFilters.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const {
    setSelectedCountry,
    setSelectedCategory,
    setSelectedLanguage,
    clearFilters
} = filtersSlice.actions

export default filtersSlice.reducer

