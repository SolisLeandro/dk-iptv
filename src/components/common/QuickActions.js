// src/components/common/QuickActions.js
import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'

export default function QuickActions({ onFilterPress, onSearchPress, onFavoritesPress }) {
    const { colors } = useTheme()

    const actions = [
        {
            id: 'filter',
            icon: 'options',
            label: 'Filtros',
            onPress: onFilterPress,
        },
        {
            id: 'search',
            icon: 'search',
            label: 'Buscar',
            onPress: onSearchPress,
        },
        {
            id: 'favorites',
            icon: 'heart',
            label: 'Favoritos',
            onPress: onFavoritesPress,
        },
    ]

    return (
        <View style={styles.container}>
            {actions.map((action) => (
                <TouchableOpacity
                    key={action.id}
                    style={[styles.action, { backgroundColor: colors.surface }]}
                    onPress={action.onPress}
                    activeOpacity={0.7}
                >
                    <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name={action.icon} size={24} color={colors.primary} />
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    action: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        minWidth: 80,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
})

