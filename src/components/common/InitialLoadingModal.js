import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'

const { width } = Dimensions.get('window')

const loadingSteps = [
    { id: 1, text: 'Descargando canales...', icon: 'tv', weight: 50 },
    { id: 2, text: 'Cargando filtros...', icon: 'options', weight: 35 },
    { id: 3, text: 'Procesando datos...', icon: 'cog', weight: 10 },
    { id: 4, text: '¡Listo!', icon: 'checkmark-circle', weight: 5 },
]

// NUEVO: Mensajes para la fase de espera inicial
const waitingMessages = [
    'Preparando la aplicación...',
    'Inicializando componentes...',
    'Cargando interfaz...',
    'Optimizando rendimiento...',
]

export default function InitialLoadingModal({ 
    visible, 
    progress = 0, 
    error = null, 
    onComplete, 
    onRetry,
    allowDataLoad = false // NUEVO: prop para saber si se permite cargar datos
}) {
    const { colors } = useTheme()
    const [currentStep, setCurrentStep] = useState(0)
    const [displayProgress, setDisplayProgress] = useState(0)
    const [waitingMessageIndex, setWaitingMessageIndex] = useState(0) // NUEVO: para mensajes de espera
    
    const scaleAnim = new Animated.Value(0.8)
    const progressAnim = new Animated.Value(0)
    const pulseAnim = new Animated.Value(1)
    const fadeAnim = new Animated.Value(0)

    useEffect(() => {
        if (visible) {
            // Animación de entrada
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start()

            // Animación de pulso para el icono (solo si no hay error)
            if (!error) {
                const pulseAnimation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, {
                            toValue: 1.1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnim, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ])
                )
                pulseAnimation.start()

                return () => pulseAnimation.stop()
            }
        }
    }, [visible, error])

    // NUEVO: Efecto para rotar mensajes de espera cuando no se permite cargar datos
    useEffect(() => {
        if (!allowDataLoad && visible) {
            const interval = setInterval(() => {
                setWaitingMessageIndex(prev => (prev + 1) % waitingMessages.length)
            }, 1500) // Cambiar mensaje cada 1.5 segundos

            return () => clearInterval(interval)
        }
    }, [allowDataLoad, visible])

    // Actualizar progreso y step actual (solo cuando se permite cargar)
    useEffect(() => {
        if (progress >= 0 && !error && allowDataLoad) {
            // Calcular step basado en el peso acumulativo
            let accumulatedWeight = 0
            let newStep = 0
            
            for (let i = 0; i < loadingSteps.length; i++) {
                accumulatedWeight += loadingSteps[i].weight
                if (progress <= accumulatedWeight) {
                    newStep = i
                    break
                }
            }

            setCurrentStep(newStep)
            
            // Animar el progreso suavemente
            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 300,
                useNativeDriver: false,
            }).start()

            // Actualizar display progress con animación suave
            const timer = setTimeout(() => {
                setDisplayProgress(Math.min(progress, 100))
            }, 100)

            // Si completó al 100%, esperar un poco y cerrar
            if (progress >= 100) {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(scaleAnim, {
                            toValue: 0.8,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        })
                    ]).start(() => {
                        onComplete?.()
                    })
                }, 800)
            }

            return () => clearTimeout(timer)
        }
    }, [progress, error, allowDataLoad])

    // MODIFICADO: Determinar qué mostrar basado en el estado
    const getCurrentDisplayData = () => {
        if (error) {
            return { icon: 'warning', text: 'Error de conexión' }
        }
        
        if (!allowDataLoad) {
            return { 
                icon: 'hourglass', 
                text: waitingMessages[waitingMessageIndex] 
            }
        }
        
        return loadingSteps[currentStep] || loadingSteps[0]
    }

    const currentDisplayData = getCurrentDisplayData()

    if (!visible) return null

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <LinearGradient
                    colors={error 
                        ? ['#DC3545', '#6C757D', colors.background]
                        : [...colors.gradient, colors.background]
                    }
                    style={styles.gradientOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.7, 1]}
                />

                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: fadeAnim,
                            backgroundColor: colors.surface,
                            shadowColor: colors.shadow,
                        }
                    ]}
                >
                    {/* Logo/Icon animado */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            {
                                transform: error ? [] : [{ scale: pulseAnim }],
                                backgroundColor: error 
                                    ? '#DC3545' + '20' 
                                    : colors.primary + '20',
                            }
                        ]}
                    >
                        <Ionicons
                            name={currentDisplayData.icon}
                            size={48}
                            color={error ? '#DC3545' : colors.primary}
                        />
                    </Animated.View>

                    {/* Título */}
                    <Text style={[styles.title, { color: colors.text }]}>
                        {error ? 'Error de Conexión' : 'DK IPTV'}
                    </Text>
                    
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {error 
                            ? 'No se pudo conectar al servidor'
                            : allowDataLoad 
                                ? 'Preparando tu experiencia'
                                : 'Iniciando aplicación'
                        }
                    </Text>

                    {/* Paso actual o mensaje de error */}
                    <Text style={[styles.stepText, { 
                        color: error ? '#DC3545' : colors.primary 
                    }]}>
                        {error || currentDisplayData.text}
                    </Text>

                    {/* Barra de progreso - solo si se permite cargar datos y no hay error */}
                    {allowDataLoad && !error && (
                        <>
                            <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
                                <Animated.View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: progressAnim.interpolate({
                                                inputRange: [0, 100],
                                                outputRange: ['0%', '100%'],
                                                extrapolate: 'clamp',
                                            }),
                                        }
                                    ]}
                                >
                                    <LinearGradient
                                        colors={colors.gradient}
                                        style={styles.progressGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                </Animated.View>
                            </View>

                            {/* Porcentaje */}
                            <Text style={[styles.percentage, { color: colors.primary }]}>
                                {Math.round(displayProgress)}%
                            </Text>

                            {/* Indicadores de pasos */}
                            <View style={styles.stepsContainer}>
                                {loadingSteps.map((step, index) => (
                                    <View
                                        key={step.id}
                                        style={[
                                            styles.stepIndicator,
                                            {
                                                backgroundColor: index <= currentStep
                                                    ? colors.primary
                                                    : colors.border,
                                                transform: [{ 
                                                    scale: index === currentStep ? 1.2 : 1 
                                                }],
                                            }
                                        ]}
                                    />
                                ))}
                            </View>
                        </>
                    )}

                    {/* NUEVO: Indicador de espera cuando no se permite cargar */}
                    {!allowDataLoad && !error && (
                        <View style={styles.waitingIndicator}>
                            <View style={styles.waitingDots}>
                                {[0, 1, 2].map((index) => (
                                    <Animated.View
                                        key={index}
                                        style={[
                                            styles.waitingDot,
                                            {
                                                backgroundColor: colors.primary,
                                                opacity: waitingMessageIndex % 3 === index ? 1 : 0.3,
                                            }
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Botón de reintentar si hay error */}
                    {error && (
                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: colors.primary }]}
                            onPress={onRetry}
                        >
                            <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            <Text style={styles.retryButtonText}>Reintentar</Text>
                        </TouchableOpacity>
                    )}

                    {/* Mensaje informativo */}
                    <Text style={[styles.infoText, { color: colors.textMuted }]}>
                        {error 
                            ? 'Verifica tu conexión a internet'
                            : allowDataLoad
                                ? 'Configurando más de 10,000 canales IPTV...'
                                : 'Optimizando la interfaz para la mejor experiencia'
                        }
                    </Text>
                    
                    {/* Mensaje adicional */}
                    {allowDataLoad && !error && (
                        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                            Esta carga inicial solo ocurre una vez
                        </Text>
                    )}
                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.98,
    },
    modalContainer: {
        width: width * 0.85,
        maxWidth: 350,
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        elevation: 15,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    stepText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '600',
    },
    progressContainer: {
        width: '100%',
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    progressBar: {
        height: '100%',
        borderRadius: 5,
    },
    progressGradient: {
        flex: 1,
        borderRadius: 5,
    },
    percentage: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
    },
    stepsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    stepIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    // NUEVO: Estilos para indicador de espera
    waitingIndicator: {
        alignItems: 'center',
        marginBottom: 20,
    },
    waitingDots: {
        flexDirection: 'row',
        gap: 8,
    },
    waitingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        marginBottom: 16,
        gap: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
})