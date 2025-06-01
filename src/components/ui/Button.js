import React from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'

export default function Button({
    title,
    onPress,
    variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
    size = 'medium', // 'small', 'medium', 'large'
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left', // 'left', 'right'
    style,
    textStyle,
    gradient = false,
    haptic = true,
    ...props
}) {
    const { colors } = useTheme()

    const handlePress = () => {
        if (haptic && !disabled && !loading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        onPress?.()
    }

    const getButtonStyles = () => {
        const baseStyle = [styles.button, styles[size]]

        switch (variant) {
            case 'primary':
                return [
                    ...baseStyle,
                    {
                        backgroundColor: disabled ? colors.textMuted : colors.primary,
                    }
                ]
            case 'secondary':
                return [
                    ...baseStyle,
                    {
                        backgroundColor: disabled ? colors.textMuted : colors.secondary,
                    }
                ]
            case 'outline':
                return [
                    ...baseStyle,
                    {
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor: disabled ? colors.textMuted : colors.primary,
                    }
                ]
            case 'ghost':
                return [
                    ...baseStyle,
                    {
                        backgroundColor: disabled ? colors.surface : colors.primary + '20',
                    }
                ]
            default:
                return baseStyle
        }
    }

    const getTextStyles = () => {
        const baseStyle = [styles.text, styles[`${size}Text`]]

        switch (variant) {
            case 'primary':
            case 'secondary':
                return [
                    ...baseStyle,
                    { color: disabled ? colors.surface : '#FFFFFF' }
                ]
            case 'outline':
                return [
                    ...baseStyle,
                    { color: disabled ? colors.textMuted : colors.primary }
                ]
            case 'ghost':
                return [
                    ...baseStyle,
                    { color: disabled ? colors.textMuted : colors.primary }
                ]
            default:
                return baseStyle
        }
    }

    const renderContent = () => (
        <View style={styles.content}>
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
                    style={styles.loadingIndicator}
                />
            )}

            {icon && iconPosition === 'left' && !loading && (
                <Ionicons
                    name={icon}
                    size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                    color={getTextStyles()[getTextStyles().length - 1].color}
                    style={styles.iconLeft}
                />
            )}

            <Text style={[getTextStyles(), textStyle]}>
                {title}
            </Text>

            {icon && iconPosition === 'right' && !loading && (
                <Ionicons
                    name={icon}
                    size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                    color={getTextStyles()[getTextStyles().length - 1].color}
                    style={styles.iconRight}
                />
            )}
        </View>
    )

    if (gradient && (variant === 'primary' || variant === 'secondary')) {
        return (
            <TouchableOpacity
                style={[getButtonStyles(), style]}
                onPress={handlePress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                {...props}
            >
                <LinearGradient
                    colors={variant === 'primary' ? colors.gradient : colors.gradientSecondary}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity
            style={[getButtonStyles(), style]}
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {renderContent()}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    small: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 36,
    },
    medium: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        minHeight: 44,
    },
    large: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        minHeight: 52,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
    loadingIndicator: {
        marginRight: 8,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
})