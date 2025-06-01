import { useSelector, useDispatch } from 'react-redux'
import {
    addToFeatured,
    removeFromFeatured,
    toggleFeatured
} from '../store/slices/featuredSlice'

export const useFeatured = () => {
    const dispatch = useDispatch()
    const featured = useSelector(state => state.featured.channels)

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
        featured,
        isFeatured,
        addFeatured: addFeaturedChannel,
        removeFeatured: removeFeaturedChannel,
        toggleFeatured: toggleFeaturedChannel,
    }
}