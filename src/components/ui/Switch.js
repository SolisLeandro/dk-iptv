import React from 'react'
import {
    TouchableOpacity,
    View,
    StyleSheet,
    Animated,
} from 'react-native'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'

export default function Switch({
    value = false,
    onValueChange,
    disabled = false,
    size = 'medium', // 'small', 'medium', 'large'
    style,
}) {
    const { colors } = useTheme()
    const animatedValue = new Animated.Value(value ? 1 : 0)

    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start()
    }, [value])

    const handlePress = () => {
        if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            onValueChange?.(!value)
        }
    }

    const getSizes = () => {
        switch (size) {
            case 'small':
                return { width: 40, height: 24, thumbSize: 18 }
            case 'large':
                return { width: 60, height: 36, thumbSize: 28 }
            default:
                return { width: 50, height: 30, thumbSize: 22 }
        }
    }

    const sizes = getSizes()

    const trackColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
    })

    const thumbTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [4, sizes.width - sizes.thumbSize - 4],
    })

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[style]}
        >
            <Animated.View
                style={[
                    styles.track,
                    {
                        width: sizes.width,
                        height: sizes.height,
                        backgroundColor: trackColor,
                        opacity: disabled ? 0.5 : 1,
                    }
                ]}
            >
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            width: sizes.thumbSize,
                            height: sizes.thumbSize,
                            transform: [{ translateX: thumbTranslateX }],
                            backgroundColor: '#FFFFFF',
                        }
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    track: {
        borderRadius: 15,
        justifyContent: 'center',
    },
    thumb: {
        borderRadius: 11,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
})