import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../hooks/useTheme'

export default function SafeAreaWrapper({
    children,
    style,
    edges = ['top', 'bottom'],
    backgroundColor
}) {
    const insets = useSafeAreaInsets()
    const { colors } = useTheme()

    const paddingTop = edges.includes('top') ? insets.top : 0
    const paddingBottom = edges.includes('bottom') ? insets.bottom : 0
    const paddingLeft = edges.includes('left') ? insets.left : 0
    const paddingRight = edges.includes('right') ? insets.right : 0

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop,
                    paddingBottom: Platform.OS === 'android' ? Math.max(paddingBottom, 20) : paddingBottom,
                    paddingLeft,
                    paddingRight,
                    backgroundColor: backgroundColor || colors.background,
                },
                style
            ]}
        >
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})