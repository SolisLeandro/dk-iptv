import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'

import { useTheme } from '../../hooks/useTheme'
import { useFavorites } from '../../hooks/useFavorites'
import { useFeatured } from '../../hooks/useFeatured'

export default function PlayerControls({
    player,
    onBack,
    onFullscreen,
    isFullscreen,
    channel,
    onPlayPause,
    showProgressBar = false,
}) {
    const { colors } = useTheme()
    const { isFavorite, toggleFavorite } = useFavorites()
    const { isFeatured, toggleFeatured } = useFeatured()

    const isPlaying = player?.playing || false
    const isChannelFavorite = isFavorite(channel.id)
    const isChannelFeatured = isFeatured(channel.id)

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

    const handleToggleFavorite = () => {
        toggleFavorite(channel)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        
        Toast.show({
            type: 'success',
            text1: isChannelFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
            text2: channel.name,
            position: 'bottom',
        })
    }

    const handleToggleFeatured = () => {
        toggleFeatured(channel)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        
        Toast.show({
            type: 'success',
            text1: isChannelFeatured ? 'Eliminado de destacados' : 'Agregado a destacados',
            text2: channel.name,
            position: 'bottom',
        })
    }

    return (
        <View style={styles.container} pointerEvents="box-none">
            <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
                locations={[0, 0.5, 1]}
                pointerEvents="box-none"
            >
                {/* Top Controls */}
                <View style={styles.topControls} pointerEvents="box-none">
                    <TouchableWithoutFeedback
                        onPress={onBack}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.channelInfo} pointerEvents="none">
                        <Text style={styles.channelName} numberOfLines={1}>
                            {channel?.name || 'Canal Desconocido'}
                        </Text>
                        <Text style={styles.channelDetails}>
                            {channel?.country} • {channel?.categories?.[0] || 'General'}
                        </Text>
                    </View>

                    <TouchableWithoutFeedback
                        onPress={onFullscreen}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View style={styles.fullscreenButton}>
                            <Ionicons
                                name={isFullscreen ? "contract" : "expand"}
                                size={24}
                                color="#FFFFFF"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {/* Center Controls */}
                <View style={styles.centerControls} pointerEvents="box-none">
                    <TouchableWithoutFeedback
                        onPress={handlePlayPause}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                        <View style={styles.playButton}>
                            <View style={styles.playButtonInner}>
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={40}
                                    color="#FFFFFF"
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls} pointerEvents="box-none">
                    {/* Action Buttons */}
                    <View style={styles.actionButtons} pointerEvents="box-none">
                        <TouchableWithoutFeedback onPress={handleToggleFavorite}>
                            <View style={[styles.actionButton, { 
                                backgroundColor: isChannelFavorite ? '#FF1744' : 'rgba(255, 255, 255, 0.2)' 
                            }]}>
                                <Ionicons
                                    name={isChannelFavorite ? "heart" : "heart-outline"}
                                    size={20}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.actionButtonText}>
                                    {isChannelFavorite ? 'Favorito' : 'Favorito'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={handleToggleFeatured}>
                            <View style={[styles.actionButton, { 
                                backgroundColor: isChannelFeatured ? '#FF6B35' : 'rgba(255, 255, 255, 0.2)' 
                            }]}>
                                <Ionicons
                                    name={isChannelFeatured ? "flame" : "flame-outline"}
                                    size={20}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.actionButtonText}>
                                    {isChannelFeatured ? 'Destacado' : 'Destacado'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 5,
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
        paddingTop: 30,
        paddingHorizontal: 20,
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
        alignItems: 'center',
        justifyContent: 'center',
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
        alignItems: 'center',
        gap: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
})