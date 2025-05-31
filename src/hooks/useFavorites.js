import { useSelector, useDispatch } from 'react-redux'
import {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
} from '../store/slices/favoritesSlice'

export const useFavorites = () => {
    const dispatch = useDispatch()
    const favorites = useSelector(state => state.favorites.channels)

    const isFavorite = (channelId) => {
        return favorites.some(channel => channel.id === channelId)
    }

    const addFavorite = (channel) => {
        dispatch(addToFavorites(channel))
    }

    const removeFavorite = (channelId) => {
        dispatch(removeFromFavorites(channelId))
    }

    const toggleChannelFavorite = (channel) => {
        dispatch(toggleFavorite(channel))
    }

    return {
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite: toggleChannelFavorite,
    }
}