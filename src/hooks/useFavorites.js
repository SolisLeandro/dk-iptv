import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'
import {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
} from '../store/slices/favoritesSlice'

export const useFavorites = () => {
    const dispatch = useDispatch()
    const favorites = useSelector(state => state.favorites.channels)
    // Obtener todos los canales cargados que ya tienen info de streams
    const allChannels = useSelector(state => state.channels.list)

    // Enriquecer favoritos con información actualizada de streams
    const enrichedFavorites = useMemo(() => {
        return favorites.map(favoriteChannel => {
            // Buscar el canal en la lista completa para obtener info actualizada
            const updatedChannel = allChannels.find(ch => ch.id === favoriteChannel.id)

            if (updatedChannel) {
                // Retornar el canal con información actualizada de streams
                return {
                    ...favoriteChannel,
                    streamCount: updatedChannel.streamCount || 0,
                    hasHDStreams: updatedChannel.hasHDStreams || false,
                    availableQualities: updatedChannel.availableQualities || [],
                    // Mantener cualquier metadata adicional del favorito
                    addedAt: favoriteChannel.addedAt,
                }
            }

            // Si no se encuentra en la lista principal, mantener el original
            return favoriteChannel
        })
    }, [favorites, allChannels])

    const isFavorite = (channelId) => {
        return favorites.some(channel => channel.id === channelId)
    }

    const addFavorite = (channel) => {
        // Agregar con información completa de streams si está disponible
        const fullChannel = allChannels.find(ch => ch.id === channel.id) || channel
        dispatch(addToFavorites({
            ...fullChannel,
            addedAt: new Date().toISOString(), // Agregar timestamp
        }))
    }

    const removeFavorite = (channelId) => {
        dispatch(removeFromFavorites(channelId))
    }

    const toggleChannelFavorite = (channel) => {
        // Usar información completa al hacer toggle
        const fullChannel = allChannels.find(ch => ch.id === channel.id) || channel
        dispatch(toggleFavorite({
            ...fullChannel,
            addedAt: new Date().toISOString(),
        }))
    }

    return {
        favorites: enrichedFavorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite: toggleChannelFavorite,
    }
}