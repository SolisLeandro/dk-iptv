import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    StatusBar,
    Alert,
} from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'
import { keepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import * as ScreenOrientation from 'expo-screen-orientation'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'
import PlayerControls from './PlayerControls'
import StreamSelector from './StreamSelector'
import QualitySelector from './QualitySelector'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function VideoPlayer({ streams, channel, onBack }) {
    const { colors } = useTheme()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
    const [showControls, setShowControls] = useState(true)
    const [error, setError] = useState(null)

    const controlsTimeoutRef = useRef(null)
    const currentStream = streams[currentStreamIndex]

    // Crear el player de video
    const player = useVideoPlayer(currentStream?.url || '', (player) => {
        player.loop = false
        player.play()
    })

    useEffect(() => {
        keepAwake()
        return () => {
            deactivateKeepAwake()
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (showControls) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        }

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
        }
    }, [showControls])

    // Listener para eventos del player
    useEffect(() => {
        const subscription = player.addListener('playingChange', (isPlaying) => {
            setIsLoading(!isPlaying && player.status === 'loading')
        })

        const errorSubscription = player.addListener('statusChange', (status) => {
            if (status === 'error') {
                setError('Error al reproducir el stream')
                setIsLoading(false)

                // Auto cambiar al siguiente stream disponible
                if (currentStreamIndex < streams.length - 1) {
                    setTimeout(() => {
                        handleStreamChange(currentStreamIndex + 1)
                    }, 2000)
                }
            } else if (status === 'readyToPlay') {
                setIsLoading(false)
                setError(null)
            }
        })

        return () => {
            subscription?.remove()
            errorSubscription?.remove()
        }
    }, [player, currentStreamIndex, streams.length])

    const toggleFullscreen = async () => {
        try {
            if (!isFullscreen) {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
                StatusBar.setHidden(true)
            } else {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
                StatusBar.setHidden(false)
            }
            setIsFullscreen(!isFullscreen)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        } catch (error) {
            console.error('Error toggling fullscreen:', error)
        }
    }

    const handleStreamChange = (index) => {
        if (streams[index]) {
            setCurrentStreamIndex(index)
            setError(null)
            setIsLoading(true)

            // Cambiar la fuente del player
            player.replace(streams[index].url)

            Haptics.selectionAsync()
        }
    }

    const toggleControls = () => {
        setShowControls(!showControls)
        Haptics.selectionAsync()
    }

    const handleBack = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
        StatusBar.setHidden(false)
        player.pause()
        onBack()
    }

    const handlePlayPause = () => {
        if (player.playing) {
            player.pause()
        } else {
            player.play()
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: '#000000' }]}>
            {/* Video Player */}
            <TouchableOpacity
                style={styles.videoContainer}
                onPress={toggleControls}
                activeOpacity={1}
            >
                <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen={false}
                    allowsPictureInPicture={false}
                    contentFit="contain"
                    nativeControls={false}
                />

                {/* Loading Overlay */}
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <LinearGradient
                            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
                            style={styles.loadingGradient}
                        >
                            <Text style={styles.loadingText}>Cargando stream...</Text>
                            <Text style={styles.channelName}>{channel.name}</Text>
                        </LinearGradient>
                    </View>
                )}

                {/* Error Overlay */}
                {error && (
                    <View style={styles.errorOverlay}>
                        <LinearGradient
                            colors={['rgba(220,53,69,0.9)', 'rgba(220,53,69,0.6)']}
                            style={styles.errorGradient}
                        >
                            <Ionicons name="warning" size={48} color="#FFFFFF" />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => handleStreamChange(currentStreamIndex)}
                            >
                                <Text style={styles.retryButtonText}>Reintentar</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}

                {/* Controls Overlay */}
                {showControls && !isLoading && (
                    <PlayerControls
                        player={player}
                        onBack={handleBack}
                        onFullscreen={toggleFullscreen}
                        isFullscreen={isFullscreen}
                        channel={channel}
                        onPlayPause={handlePlayPause}
                    />
                )}
            </TouchableOpacity>

            {/* Bottom Controls */}
            {!isFullscreen && (
                <View style={[styles.bottomControls, { backgroundColor: colors.surface }]}>
                    {/* Stream Selector */}
                    <StreamSelector
                        streams={streams}
                        currentIndex={currentStreamIndex}
                        onStreamChange={handleStreamChange}
                    />

                    {/* Quality Selector */}
                    <QualitySelector
                        currentQuality={currentStream?.quality}
                        availableQualities={streams.map(s => s.quality).filter(Boolean)}
                        onQualityChange={(quality) => {
                            const streamIndex = streams.findIndex(s => s.quality === quality)
                            if (streamIndex !== -1) {
                                handleStreamChange(streamIndex)
                            }
                        }}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    channelName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
    },
    errorOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomControls: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
})