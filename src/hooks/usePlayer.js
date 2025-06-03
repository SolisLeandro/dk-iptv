import { useSelector, useDispatch } from 'react-redux'
import {
    setCurrentChannel,
    setCurrentStream,
    setIsPlaying,
    setIsFullscreen,
    setVolume,
    setPosition,
    setDuration,
    setIsLoading,
    setError,
    setQuality,
    resetPlayer,
} from '../store/slices/playerSlice'
import { addToRecent } from '../store/slices/recentSlice'

export const usePlayer = () => {
    const dispatch = useDispatch()
    const player = useSelector(state => state.player)

    const playChannel = (channel, stream = null) => {
        dispatch(setCurrentChannel(channel))
        if (stream) {
            dispatch(setCurrentStream(stream))
        }
        dispatch(addToRecent(channel))
        dispatch(setIsLoading(true))
        dispatch(setError(null))
    }

    const updatePlaybackStatus = (status) => {
        if (status.isLoaded) {
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(status.shouldPlay || false))
            dispatch(setPosition(status.positionMillis || 0))
            dispatch(setDuration(status.durationMillis || 0))
        }

        if (status.error) {
            dispatch(setError(status.error))
            dispatch(setIsLoading(false))
        }
    }

    const changeStream = (stream) => {
        dispatch(setCurrentStream(stream))
        dispatch(setIsLoading(true))
        dispatch(setError(null))
    }

    const changeQuality = (quality) => {
        dispatch(setQuality(quality))
    }

    const toggleFullscreen = () => {
        dispatch(setIsFullscreen(!player.isFullscreen))
    }

    const updateVolume = (volume) => {
        dispatch(setVolume(volume))
    }

    const stopPlayback = () => {
        dispatch(resetPlayer())
    }

    return {
        ...player,
        playChannel,
        updatePlaybackStatus,
        changeStream,
        changeQuality,
        toggleFullscreen,
        updateVolume,
        stopPlayback,
    }
}

