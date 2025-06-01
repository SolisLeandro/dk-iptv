import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { useTheme } from '../../hooks/useTheme'

export default function Card({
    children,
    style,
    onPress,
    gradient = false,
    padding = 16,
    ...props
}) {
    const { colors } = useTheme()

    const cardStyles = [
        styles.card,
        {
            backgroundColor: colors.surface,
            padding: padding,
            shadowColor: colors.shadow,
        },
        style
    ]

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyles}
                onPress={onPress}
                activeOpacity={0.8}
                {...props}
            >
                {gradient ? (
                    <LinearGradient
                        colors={colors.gradient}
                        style={styles.gradientContent}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {children}
                    </LinearGradient>
                ) : (
                    children
                )}
            </TouchableOpacity>
        )
    }

    return (
        <View style={cardStyles} {...props}>
            {gradient ? (
                <LinearGradient
                    colors={colors.gradient}
                    style={styles.gradientContent}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {children}
                </LinearGradient>
            ) : (
                children
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gradientContent: {
        padding: 16,
        borderRadius: 12,
    },
})