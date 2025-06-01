// src/components/channel/ChannelSearch.js
import React from 'react'
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'

export default function ChannelSearch({
    value,
    onChangeText,
    placeholder = "Buscar canales...",
    style,
    onClear,
}) {
    const { colors } = useTheme()

    const handleClear = () => {
        onChangeText('')
        onClear?.()
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }, style]}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
    clearButton: {
        padding: 4,
    },
})

