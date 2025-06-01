import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated'

import { useTheme } from '../../hooks/useTheme'

const { width } = Dimensions.get('window')

const onboardingData = [
    {
        id: 1,
        icon: 'tv',
        title: 'Miles de Canales',
        description: 'Accede a más de 10,000 canales IPTV de todo el mundo con una sola aplicación.',
    },
    {
        id: 2,
        icon: 'heart',
        title: 'Tus Favoritos',
        description: 'Guarda tus canales favoritos y accede a ellos rápidamente cuando quieras.',
    },
    {
        id: 3,
        icon: 'search',
        title: 'Búsqueda Inteligente',
        description: 'Encuentra canales por nombre, país, categoría o idioma de forma instantánea.',
    },
    {
        id: 4,
        icon: 'play-circle',
        title: '¡Comienza a Ver!',
        description: 'Todo listo. Disfruta de tu contenido favorito con la mejor calidad.',
    },
]

export default function OnboardingScreen({ navigation }) {
    const { colors } = useTheme()
    const [currentIndex, setCurrentIndex] = useState(0)
    const translateX = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        }
    })

    const nextSlide = () => {
        if (currentIndex < onboardingData.length - 1) {
            const newIndex = currentIndex + 1
            setCurrentIndex(newIndex)
            translateX.value = withSpring(-newIndex * width)
        } else {
            // Completar onboarding
            navigation.replace('MainTabs')
        }
    }

    const prevSlide = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1
            setCurrentIndex(newIndex)
            translateX.value = withSpring(-newIndex * width)
        }
    }

    const skipOnboarding = () => {
        navigation.replace('MainTabs')
    }

    const currentSlide = onboardingData[currentIndex]

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={colors.gradient}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Skip Button */}
                <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
                    <Text style={styles.skipText}>Saltar</Text>
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={currentSlide.icon} size={80} color="#FFFFFF" />
                    </View>

                    <Text style={styles.title}>{currentSlide.title}</Text>
                    <Text style={styles.description}>{currentSlide.description}</Text>
                </View>

                {/* Pagination */}
                <View style={styles.pagination}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                {
                                    backgroundColor: index === currentIndex
                                        ? '#FFFFFF'
                                        : 'rgba(255, 255, 255, 0.3)',
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Navigation */}
                <View style={styles.navigation}>
                    {currentIndex > 0 && (
                        <TouchableOpacity style={styles.navButton} onPress={prevSlide}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                        onPress={nextSlide}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === onboardingData.length - 1 ? 'Comenzar' : 'Siguiente'}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundGradient: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    skipButton: {
        alignSelf: 'flex-end',
        padding: 12,
    },
    skipText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 26,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 40,
    },
    navButton: {
        padding: 12,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
})