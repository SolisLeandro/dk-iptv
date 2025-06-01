// src/components/common/StatsCards.js
import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { useTheme } from '../../hooks/useTheme'

export default function StatsCards({ channels = [] }) {
    const { colors } = useTheme()

    const stats = [
        {
            id: 'total',
            label: 'Total Canales',
            value: channels.length.toLocaleString(),
            icon: '📺',
        },
        {
            id: 'countries',
            label: 'Países',
            value: new Set(channels.map(ch => ch.country)).size,
            icon: '🌍',
        },
        {
            id: 'categories',
            label: 'Categorías',
            value: new Set(channels.flatMap(ch => ch.categories || [])).size,
            icon: '📂',
        },
    ]

    return (
        <View style={styles.container}>
            {stats.map((stat, index) => (
                <LinearGradient
                    key={stat.id}
                    colors={index % 2 === 0 ? colors.gradient : colors.gradientSecondary}
                    style={styles.statCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 80,
        justifyContent: 'center',
    },
    statIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
})