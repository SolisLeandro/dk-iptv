import React, { useEffect } from 'react'
import {
    Modal as RNModal,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from 'react-native'
import { BlurView } from 'expo-blur'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated'

import { useTheme } from '../../hooks/useTheme'

const { width, height } = Dimensions.get('window')

export default function Modal({
    visible,
    onClose,
    children,
    animationType = 'slide', // 'slide', 'fade', 'scale'
    position = 'center', // 'center', 'bottom', 'top'
    showOverlay = true,
    overlayOpacity = 0.5,
    style,
}) {
    const { colors, isDark } = useTheme()
    const translateY = useSharedValue(height)
    const scale = useSharedValue(0.8)
    const opacity = useSharedValue(0)

    // Usar useEffect de React en lugar de useReanimatedEffect
    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 20 })
            scale.value = withSpring(1, { damping: 20 })
            opacity.value = withTiming(1, { duration: 300 })
        } else {
            translateY.value = withTiming(height, { duration: 300 })
            scale.value = withTiming(0.8, { duration: 300 })
            opacity.value = withTiming(0, { duration: 300 })
        }
    }, [visible])

    const animatedStyle = useAnimatedStyle(() => {
        switch (animationType) {
            case 'slide':
                return {
                    transform: [{ translateY: translateY.value }],
                }
            case 'scale':
                return {
                    transform: [{ scale: scale.value }],
                    opacity: opacity.value,
                }
            case 'fade':
                return {
                    opacity: opacity.value,
                }
            default:
                return {}
        }
    })

    const getModalPosition = () => {
        switch (position) {
            case 'bottom':
                return styles.bottom
            case 'top':
                return styles.top
            default:
                return styles.center
        }
    }

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <StatusBar backgroundColor="rgba(0,0,0,0.5)" />

            {/* Overlay */}
            {showOverlay && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <BlurView
                        intensity={isDark ? 20 : 10}
                        style={[
                            styles.overlay,
                            { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }
                        ]}
                        tint={isDark ? 'dark' : 'light'}
                    />
                </TouchableOpacity>
            )}

            {/* Modal Content */}
            <View style={[styles.container, getModalPosition()]}>
                <Animated.View
                    style={[
                        styles.modal,
                        {
                            backgroundColor: colors.surface,
                            shadowColor: colors.shadow,
                        },
                        animatedStyle,
                        style
                    ]}
                >
                    {children}
                </Animated.View>
            </View>
        </RNModal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottom: {
        justifyContent: 'flex-end',
    },
    top: {
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
    modal: {
        borderRadius: 16,
        padding: 20,
        maxWidth: width * 0.9,
        maxHeight: height * 0.8,
        elevation: 10,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
})