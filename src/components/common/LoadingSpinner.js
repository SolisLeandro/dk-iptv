import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'

import { useTheme } from '../../hooks/useTheme'

export default function LoadingSpinner({
    message = 'Cargando...',
    size = 'large',
    style,
}) {
    const { colors } = useTheme()

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                size={size}
                color={colors.primary}
                style={styles.spinner}
            />
            <Text style={[styles.message, { color: colors.text }]}>
                {message}
            </Text>
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
    },
})