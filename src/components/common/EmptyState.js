import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'

export default function EmptyState({
    icon,
    title,
    message,
    actionText,
    onAction,
    style,
}) {
    const { colors } = useTheme()

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                <Ionicons name={icon} size={48} color={colors.textMuted} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>

            <Text style={[styles.message, { color: colors.textSecondary }]}>
                {message}
            </Text>

            {actionText && onAction && (
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={onAction}
                >
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    actionButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
})

