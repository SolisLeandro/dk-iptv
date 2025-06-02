import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Text,
    StatusBar,
    Alert,
} from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as NavigationBar from 'expo-navigation-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'
import PlayerControls from './PlayerControls'
import StreamSelector from './StreamSelector'
import QualitySelector from './QualitySelector'
import StreamDebugger from './StreamDebugger'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function VideoPlayer({ streams, channel, onBack }) {
    const { colors } = useTheme()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
    const [showControls, setShowControls] = useState(true)
    const [error, setError] = useState(null)
    const [showDebugger, setShowDebugger] = useState(false)

    const controlsTimeoutRef = useRef(null)
    const currentStream = streams[currentStreamIndex]

    // Crear el player de video con headers
    const player = useVideoPlayer(currentStream ? {
        uri: currentStream.url,
        headers: {
            ...(currentStream.referrer && { 'Referer': currentStream.referrer }),
            ...(currentStream.user_agent && { 'User-Agent': currentStream.user_agent }),
        }
    } : '', (player) => {
        player.loop = false
        player.play()
    })

    useEffect(() => {
        // Activar keep awake de forma asíncrona
        const setupKeepAwake = async () => {
            try {
                await activateKeepAwakeAsync()
            } catch (error) {
                console.warn('Error activating keep awake:', error)
            }
        }
        
        setupKeepAwake()
        
        return () => {
            try {
                deactivateKeepAwake()
            } catch (error) {
                console.warn('Error deactivating keep awake:', error)
            }
            
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
        }
    }, [])

    // Función para configurar el timeout de los controles
    const startControlsTimeout = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
        }
        
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false)
        }, 5000) // 5 segundos
    }

    useEffect(() => {
        if (showControls) {
            startControlsTimeout()
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
                // Entrar a pantalla completa
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
                StatusBar.setHidden(true, 'fade')
                
                // Ocultar navegación de Android
                try {
                    await NavigationBar.setVisibilityAsync('hidden')
                } catch (navError) {
                    console.warn('Error hiding navigation bar:', navError)
                }
            } else {
                // Salir de pantalla completa
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
                StatusBar.setHidden(false, 'fade')
                
                // Mostrar navegación de Android
                try {
                    await NavigationBar.setVisibilityAsync('visible')
                } catch (navError) {
                    console.warn('Error showing navigation bar:', navError)
                }
            }
            setIsFullscreen(!isFullscreen)
        } catch (error) {
            console.error('Error toggling fullscreen:', error)
        }
    }

    const handleStreamChange = (index) => {
        if (streams[index]) {
            setCurrentStreamIndex(index)
            setError(null)
            setIsLoading(true)

            const newStream = streams[index]
            
            // Cambiar la fuente del player con headers
            const source = {
                uri: newStream.url,
                headers: {
                    ...(newStream.referrer && { 'Referer': newStream.referrer }),
                    ...(newStream.user_agent && { 'User-Agent': newStream.user_agent }),
                }
            }
            
            player.replace(source)
        }
    }

    const toggleControls = () => {
        const newShowControls = !showControls
        setShowControls(newShowControls)
        
        // Si se muestran los controles, iniciar el timeout
        if (newShowControls) {
            startControlsTimeout()
        }
    }

    const handleBack = async () => {
        // Restaurar configuración normal
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
        StatusBar.setHidden(false, 'fade')
        
        try {
            await NavigationBar.setVisibilityAsync('visible')
        } catch (navError) {
            console.warn('Error showing navigation bar on back:', navError)
        }
        
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

    // Manejar toque en el área del video (sin interceptar los controles)
    const handleVideoTouch = () => {
        if (!isLoading && !error) {
            toggleControls()
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: '#000000' }]}>
            {/* Video Player con TouchableWithoutFeedback para mejor detección */}
            <View style={styles.videoContainer}>
                <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen={false}
                    allowsPictureInPicture={false}
                    contentFit="contain"
                    nativeControls={false}
                />

                {/* Overlay transparente para detectar toques */}
                <TouchableWithoutFeedback onPress={handleVideoTouch}>
                    <View style={styles.touchOverlay} />
                </TouchableWithoutFeedback>

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
                            
                            <View style={styles.errorActions}>
                                <TouchableWithoutFeedback
                                    onPress={() => handleStreamChange(currentStreamIndex)}
                                >
                                    <View style={styles.retryButton}>
                                        <Text style={styles.retryButtonText}>Reintentar</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                
                                <TouchableWithoutFeedback
                                    onPress={() => setShowDebugger(true)}
                                >
                                    <View style={[styles.retryButton, styles.debugButton]}>
                                        <Text style={styles.retryButtonText}>Debug</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
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
            </View>

            {/* Bottom Controls - Solo en modo normal */}
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
                    
                    {/* Debug Button */}
                    <TouchableWithoutFeedback
                        onPress={() => setShowDebugger(true)}
                    >
                        <View style={[styles.debugButtonSmall, { backgroundColor: colors.textMuted + '20' }]}>
                            <Ionicons name="bug" size={16} color={colors.textMuted} />
                            <Text style={[styles.debugButtonSmallText, { color: colors.textMuted }]}>
                                Debug
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}

            {/* Stream Debugger Modal */}
            <StreamDebugger
                stream={currentStream}
                visible={showDebugger}
                onClose={() => setShowDebugger(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoContainer: {
        flex: 1,
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    touchOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
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
        zIndex: 10,
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
    errorActions: {
        flexDirection: 'row',
        gap: 12,
    },
    retryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    debugButton: {
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderColor: 'rgba(255, 193, 7, 0.3)',
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
        paddingBottom: 50
    },
    debugButtonSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 8,
        alignSelf: 'flex-start',
        gap: 4,
    },
    debugButtonSmallText: {
        fontSize: 12,
        fontWeight: '500',
    },
})