import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import {
    addToFeatured,
    removeFromFeatured,
    toggleFeatured
} from '../store/slices/featuredSlice'
import { streamsService } from '../services/api/streams'

export const useFeatured = () => {
    const dispatch = useDispatch()
    const featured = useSelector(state => state.featured.channels)

    // Obtener streams para enriquecer los destacados
    const { data: allStreams } = useQuery({
        queryKey: ['streams'],
        queryFn: streamsService.getStreams,
        staleTime: 5 * 60 * 1000,
    })

    // Enriquecer destacados con información de streams
    const enrichedFeatured = featured.map(channel => {
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