import { useSelector, useDispatch } from 'react-redux'
import {
    addToFeatured,
    removeFromFeatured,
    toggleFeatured
} from '../store/slices/featuredSlice'

export const useFeatured = () => {
    const dispatch = useDispatch()
    const featured = useSelector(state => state.featured.channels)

    // Sin enriquecimiento con streams para evitar llamadas al API
    const enrichedFeatured = featured

    const isFeatured = (channelId) => {
        return featured.some(channel => channel.id === channelId)
    }

    const addFeaturedChannel = (channel) => {
        dispatch(addToFeatured(channel))
    }

    const removeFeaturedChannel = (channelId) => {
        dispatch(removeFromFeatured(channelId))
    }

    const toggleFeaturedChannel = (channel) => {
        dispatch(toggleFeatured(channel))
    }

    return {
        featured: enrichedFeatured,
        isFeatured,
        addFeatured: addFeaturedChannel,
        removeFeatured: removeFeaturedChannel,
        toggleFeatured: toggleFeaturedChannel,
    }
}