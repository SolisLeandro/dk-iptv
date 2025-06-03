// src/components/common/LoadingSpinner.js
import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'

import { useTheme } from '../../hooks/useTheme'

const loadingMessages = [
    'Cargando canales...',
    'Verificando streams disponibles...',
    'Filtrando canales activos...',
    'Preparando contenido...',
    'Casi listo...'
]

export default function LoadingSpinner({
    message,
    size = 'large',
    style,
    showProgressMessages = false,
}) {
    const { colors } = useTheme()
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [displayMessage, setDisplayMessage] = useState(message || loadingMessages[0])

    useEffect(() => {
        if (showProgressMessages && !message) {
            const interval = setInterval(() => {
                setCurrentMessageIndex(prev => {
                    const newIndex = (prev + 1) % loadingMessages.length
                    setDisplayMessage(loadingMessages[newIndex])
                    return newIndex
                })
            }, 2000)

            return () => clearInterval(interval)
        } else if (message) {
            setDisplayMessage(message)
        }
    }, [message, showProgressMessages])

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                size={size}
                color={colors.primary}
                style={styles.spinner}
            />
            <Text style={[styles.message, { color: colors.text }]}>
                {displayMessage}
            </Text>
            
            {showProgressMessages && (
                <View style={styles.progressDots}>
                    {loadingMessages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index <= currentMessageIndex 
                                        ? colors.primary 
                                        : colors.border
                                }
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    spinner: {
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 16,
    },
    progressDots: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
})