import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    StatusBar,
    Alert,
    BackHandler,
    Platform,
} from 'react-native'

import { usePlayer } from '../../hooks/usePlayer'
import { useOrientation } from '../../hooks/useOrientation'
import { useTheme } from '../../hooks/useTheme'
import { streamsService } from '../../services/api/streams'
import VideoPlayer from '../../components/player/VideoPlayer'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function PlayerScreen({ route, navigation }) {
    const { channel } = route.params
    const { colors, isDark } = useTheme()
    const { playChannel, currentChannel, stopPlayback } = usePlayer()
    const { lockPortrait } = useOrientation()
    const [selectedStreamIndex, setSelectedStreamIndex] = useState(0)
    const [streams, setStreams] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    console.log("channel", channel)

    // Cargar streams para el canal SIN React Query
    useEffect(() => {
        const loadStreams = async () => {
            try {
                setIsLoading(true)
                setError(null)
                console.log(`🎥 Cargando streams para canal: ${channel.id}`)
                
                const channelStreams = await streamsService.getStreamsByChannel(channel.id)
                
                if (channelStreams && channelStreams.length > 0) {
                    setStreams(channelStreams)
                    console.log(`✅ ${channelStreams.length} streams cargados`)
                } else {
                    throw new Error('No streams disponibles')
                }
            } catch (err) {
                console.error('❌ Error cargando streams:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (channel?.id) {
            loadStreams()
        }
    }, [channel?.id])

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
        
        // IMPORTANTE: Restaurar configuración del tema al salir
        try {
            if (Platform.OS === 'android') {
                // Restaurar StatusBar al tema correspondiente
                StatusBar.setHidden(false, 'fade')
                StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true)
                
                // Nota: NavigationBar se restaura en VideoPlayer component
                console.log('🔄 Configuración del tema restaurada en PlayerScreen')
            }
        } catch (error) {
            console.warn('⚠️ Error restaurando configuración en PlayerScreen:', error)
        }
        
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
    if (isLoading) {
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
    if (error || !streams || streams.length === 0) {
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