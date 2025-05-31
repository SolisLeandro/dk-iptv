import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    StatusBar,
    Alert,
    BackHandler,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'

import { usePlayer } from '../../hooks/usePlayer'
import { useOrientation } from '../../hooks/useOrientation'
import { streamsService } from '../../services/api/streams'
import VideoPlayer from '../../components/player/VideoPlayer'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function PlayerScreen({ route, navigation }) {
    const { channel } = route.params
    const { playChannel, currentChannel, stopPlayback } = usePlayer()
    const { lockPortrait } = useOrientation()
    const [selectedStreamIndex, setSelectedStreamIndex] = useState(0)

    // Obtener streams para el canal
    const {
        data: streams,
        isLoading: streamsLoading,
        error: streamsError,
    } = useQuery({
        queryKey: ['streams', channel.id],
        queryFn: () => streamsService.getStreamsByChannel(channel.id),
        enabled: !!channel.id,
    })

    useEffect(() => {
        // Reproducir canal cuando lleguen los streams
        if (streams && streams.length > 0 && !currentChannel) {
            playChannel(channel, streams[0])
        }
    }, [streams, channel, currentChannel, playChannel])

    useEffect(() => {
        // Manejar botón de retroceso de Android
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handleBack()
            return true
        })

        return () => backHandler.remove()
    }, [])

    const handleBack = async () => {
        await lockPortrait()
        stopPlayback()
        navigation.goBack()
    }

    const handleStreamChange = (index) => {
        if (streams && streams[index]) {
            setSelectedStreamIndex(index)
            playChannel(channel, streams[index])
        }
    }

    const handleError = (error) => {
        Alert.alert(
            'Error de Reproducción',
            'No se pudo reproducir el stream. ¿Quieres intentar con otro?',
            [
                { text: 'Cancelar', onPress: handleBack },
                {
                    text: 'Reintentar',
                    onPress: () => {
                        if (selectedStreamIndex < streams.length - 1) {
                            handleStreamChange(selectedStreamIndex + 1)
                        } else {
                            handleStreamChange(0)
                        }
                    }
                },
            ]
        )
    }

    // Mostrar loading mientras cargan los streams
    if (streamsLoading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar hidden />
                <LoadingSpinner
                    message={`Cargando ${channel.name}...`}
                    size="large"
                />
            </View>
        )
    }

    // Mostrar error si no hay streams
    if (streamsError || !streams || streams.length === 0) {
        Alert.alert(
            'Error',
            'No se encontraron streams disponibles para este canal.',
            [{ text: 'OK', onPress: handleBack }]
        )
        return null
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <VideoPlayer
                channel={channel}
                streams={streams}
                currentStreamIndex={selectedStreamIndex}
                onStreamChange={handleStreamChange}
                onBack={handleBack}
                onError={handleError}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
})