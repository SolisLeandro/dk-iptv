import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    PanGestureHandler,
    Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'

const { width } = Dimensions.get('window')

// Componente de slider personalizado simple
const CustomSlider = ({ 
    value = 0, 
    minimumValue = 0, 
    maximumValue = 1, 
    onValueChange,
    minimumTrackTintColor = '#FF6B35',
    maximumTrackTintColor = 'rgba(255,255,255,0.3)',
    style 
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [sliderWidth, setSliderWidth] = useState(0)

    const handleLayout = (event) => {
        setSliderWidth(event.nativeEvent.layout.width - 20) // 20 for thumb size
    }

    const handleTouch = (event) => {
        if (sliderWidth === 0) return

        const touchX = event.nativeEvent.locationX - 10 // 10 for thumb radius
        const percentage = Math.max(0, Math.min(1, touchX / sliderWidth))
        const newValue = minimumValue + (percentage * (maximumValue - minimumValue))
        
        onValueChange?.(newValue)
        Haptics.selectionAsync()
    }

    const progressPercentage = maximumValue > minimumValue 
        ? (value - minimumValue) / (maximumValue - minimumValue) 
        : 0

    return (
        <TouchableOpacity
            style={[styles.sliderContainer, style]}
            onLayout={handleLayout}
            onPress={handleTouch}
            activeOpacity={0.8}
        >
            <View style={styles.sliderTrack}>
                {/* Background track */}
                <View style={[
                    styles.sliderTrackBackground,
                    { backgroundColor: maximumTrackTintColor }
                ]} />
                
                {/* Progress track */}
                <View style={[
                    styles.sliderTrackProgress,
                    { 
                        backgroundColor: minimumTrackTintColor,
                        width: `${progressPercentage * 100}%`
                    }
                ]} />
                
                {/* Thumb */}
                <View style={[
                    styles.sliderThumb,
                    {
                        left: `${progressPercentage * 100}%`,
                        backgroundColor: '#FFFFFF'
                    }
                ]} />
            </View>
        </TouchableOpacity>
    )
}

export default function PlayerControls({
    player,
    onBack,
    onFullscreen,
    isFullscreen,
    channel,
    onPlayPause,
    showProgressBar = false, // Cambiado a false por defecto para streams en vivo
}) {
    const { colors } = useTheme()
    const [isSeeking, setIsSeeking] = useState(false)

    const isPlaying = player?.playing || false
    const position = player?.currentTime || 0
    const duration = player?.duration || 0
    const progress = duration > 0 ? position / duration : 0

    const formatTime = (timeSeconds) => {
        const totalSeconds = Math.floor(timeSeconds)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const handlePlayPause = () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            if (isPlaying) {
                player.pause()
            } else {
                player.play()
            }
            onPlayPause?.(isPlaying)
        } catch (error) {
            console.error('Error toggling play/pause:', error)
        }
    }

    const handleSeek = (value) => {
        try {
            const seekTime = value * duration
            player.currentTime = seekTime
        } catch (error) {
            console.error('Error seeking:', error)
        }
    }

    const handleSkip = (seconds) => {
        try {
            const newPosition = Math.max(0, Math.min(duration, position + seconds))
            player.currentTime = newPosition
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        } catch (error) {
            console.error('Error skipping:', error)
        }
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
                locations={[0, 0.5, 1]}
            >
                {/* Top Controls */}
                <View style={styles.topControls}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBack}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.channelInfo}>
                        <Text style={styles.channelName} numberOfLines={1}>
                            {channel?.name || 'Canal Desconocido'}
                        </Text>
                        <Text style={styles.channelDetails}>
                            {channel?.country} • {channel?.categories?.[0] || 'General'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.fullscreenButton}
                        onPress={onFullscreen}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isFullscreen ? "contract" : "expand"}
                            size={24}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Center Controls */}
                <View style={styles.centerControls}>
                    {duration > 0 && (
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => handleSkip(-10)}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        >
                            <Ionicons name="play-back" size={32} color="#FFFFFF" />
                            <Text style={styles.skipText}>10s</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={handlePlayPause}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                        <View style={styles.playButtonInner}>
                            <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={40}
                                color="#FFFFFF"
                            />
                        </View>
                    </TouchableOpacity>

                    {duration > 0 && (
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => handleSkip(10)}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        >
                            <Ionicons name="play-forward" size={32} color="#FFFFFF" />
                            <Text style={styles.skipText}>10s</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bottom Controls */}
                {showProgressBar && duration > 0 && (
                    <View style={styles.bottomControls}>
                        <Text style={styles.timeText}>
                            {formatTime(position)}
                        </Text>

                        <View style={styles.progressContainer}>
                            <CustomSlider
                                style={styles.progressSlider}
                                value={progress}
                                minimumValue={0}
                                maximumValue={1}
                                minimumTrackTintColor={colors.primary}
                                maximumTrackTintColor="rgba(255,255,255,0.3)"
                                onValueChange={handleSeek}
                            />
                        </View>

                        <Text style={styles.timeText}>
                            {formatTime(duration)}
                        </Text>
                    </View>
                )}

                {/* Live Indicator */}
                {!showProgressBar && (
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>EN VIVO</Text>
                    </View>
                )}
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    gradient: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    topControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    channelInfo: {
        flex: 1,
        marginHorizontal: 16,
        alignItems: 'center',
    },
    channelName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    channelDetails: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    fullscreenButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    centerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
    },
    skipButton: {
        alignItems: 'center',
        padding: 8,
    },
    skipText: {
        fontSize: 10,
        color: '#FFFFFF',
        marginTop: 4,
        fontWeight: '500',
    },
    playButton: {
        padding: 8,
    },
    playButtonInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    bottomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timeText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
        minWidth: 40,
        textAlign: 'center',
    },
    progressContainer: {
        flex: 1,
    },
    progressSlider: {
        height: 40,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 68, 68, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'center',
    },
    liveDot: {
        width: 8,
        height: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        marginRight: 6,
    },
    liveText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    // Estilos para el slider personalizado
    sliderContainer: {
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    sliderTrack: {
        height: 4,
        position: 'relative',
    },
    sliderTrackBackground: {
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        width: '100%',
    },
    sliderTrackProgress: {
        height: 4,
        borderRadius: 2,
        position: 'absolute',
    },
    sliderThumb: {
        width: 16,
        height: 16,
        borderRadius: 8,
        position: 'absolute',
        top: -6,
        marginLeft: -8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
})