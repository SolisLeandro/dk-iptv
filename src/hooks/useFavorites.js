import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
} from '../store/slices/favoritesSlice'
import { streamsService } from '../services/api/streams'

export const useFavorites = () => {
    const dispatch = useDispatch()
    const favorites = useSelector(state => state.favorites.channels)

    // Obtener streams para enriquecer los favoritos
    const { data: allStreams } = useQuery({
        queryKey: ['streams'],
        queryFn: streamsService.getStreams,
        staleTime: 5 * 60 * 1000,
    })

    // Enriquecer favoritos con información de streams
    const enrichedFavorites = favorites.map(channel => {
        if (!allStreams) return channel

        const channelStreams = allStreams.filter(stream => stream.channel === channel.id)
        
        return {
            ...channel,
            streamCount: channelStreams.length,
            hasHDStreams: channelStreams.some(stream => 
                stream.quality && (stream.quality.includes('720p') || stream.quality.includes('1080p'))
            ),
            availableQualities: [...new Set(channelStreams.map(s => s.quality).filter(Boolean))],
        }
    })

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
        favorites: enrichedFavorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite: toggleChannelFavorite,
    }
}