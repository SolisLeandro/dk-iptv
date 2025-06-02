import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'
import {
    addToFeatured,
    removeFromFeatured,
    toggleFeatured
} from '../store/slices/featuredSlice'

export const useFeatured = () => {
    const dispatch = useDispatch()
    const featured = useSelector(state => state.featured.channels)
    // Obtener todos los canales cargados que ya tienen info de streams
    const allChannels = useSelector(state => state.channels.list)

    // Enriquecer destacados con información actualizada de streams
    const enrichedFeatured = useMemo(() => {
        return featured.map(featuredChannel => {
            // Buscar el canal en la lista completa para obtener info actualizada
            const updatedChannel = allChannels.find(ch => ch.id === featuredChannel.id)
            
            if (updatedChannel) {
                // Retornar el canal con información actualizada de streams
                return {
                    ...featuredChannel,
                    streamCount: updatedChannel.streamCount || 0,
                    hasHDStreams: updatedChannel.hasHDStreams || false,
                    availableQualities: updatedChannel.availableQualities || [],
                    // Mantener cualquier metadata adicional del destacado
                    addedAt: featuredChannel.addedAt,
                }
            }
            
            // Si no se encuentra en la lista principal, mantener el original
            return featuredChannel
        })
    }, [featured, allChannels])

    const isFeatured = (channelId) => {
        return featured.some(channel => channel.id === channelId)
    }

    const addFeaturedChannel = (channel) => {
        // Agregar con información completa de streams si está disponible
        const fullChannel = allChannels.find(ch => ch.id === channel.id) || channel
        dispatch(addToFeatured({
            ...fullChannel,
            addedAt: new Date().toISOString(), // Agregar timestamp
        }))
    }

    const removeFeaturedChannel = (channelId) => {
        dispatch(removeFromFeatured(channelId))
    }

    const toggleFeaturedChannel = (channel) => {
        // Usar información completa al hacer toggle
        const fullChannel = allChannels.find(ch => ch.id === channel.id) || channel
        dispatch(toggleFeatured({
            ...fullChannel,
            addedAt: new Date().toISOString(),
        }))
    }

    return {
        featured: enrichedFeatured,
        isFeatured,
        addFeatured: addFeaturedChannel,
        removeFeatured: removeFeaturedChannel,
        toggleFeatured: toggleFeaturedChannel,
    }
}