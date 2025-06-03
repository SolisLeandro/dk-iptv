import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'

const { width } = Dimensions.get('window')

const ThemeOption = ({
    title,
    icon,
    gradient,
    isSelected,
    onPress
}) => {
    const scaleAnim = new Animated.Value(1)

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start()

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        onPress()
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Animated.View style={[
                styles.themeOption,
                { transform: [{ scale: scaleAnim }] }
            ]}>
                <LinearGradient
                    colors={gradient}
                    style={styles.themeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name={icon} size={24} color="#FFFFFF" />
                    {isSelected && (
                        <View style={styles.selectedIndicator}>
                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                        </View>
                    )}
                </LinearGradient>
                <Text style={styles.themeTitle}>{title}</Text>
            </Animated.View>
        </TouchableOpacity>
    )
}

export default function ThemeSelector() {
    const { mode, setTheme, colors } = useTheme()
    const [previewMode, setPreviewMode] = useState(null)

    const themeOptions = [
        {
            key: 'light',
            title: 'Claro',
            icon: 'sunny',
            gradient: ['#FF6B35', '#FFA726'],
        },
        {
            key: 'dark',
            title: 'Oscuro',
            icon: 'moon',
            gradient: ['#2C3E50', '#4A6741'],
        },
        {
            key: 'auto',
            title: 'Automático',
            icon: 'phone-portrait',
            gradient: ['#667eea', '#764ba2'],
        },
    ]

    const handleThemeChange = (themeKey) => {
        setTheme(themeKey)
        setPreviewMode(null)
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>
                Selecciona tu tema favorito
            </Text>

            <View style={styles.optionsContainer}>
                {themeOptions.map((option) => (
                    <ThemeOption
                        key={option.key}
                        title={option.title}
                        icon={option.icon}
                        gradient={option.gradient}
                        isSelected={mode === option.key}
                        onPress={() => handleThemeChange(option.key)}
                    />
                ))}
            </View>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
                El modo automático se adapta a la configuración de tu dispositivo
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Inter-SemiBold',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    themeOption: {
        alignItems: 'center',
    },
    themeGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    selectedIndicator: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
        padding: 2,
    },
    themeTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        fontFamily: 'Inter-Medium',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'Inter-Regular',
    },
})