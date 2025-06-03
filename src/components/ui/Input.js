import React, { useState } from 'react'
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'

export default function Input({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconPress,
    secureTextEntry = false,
    multiline = false,
    numberOfLines = 1,
    style,
    inputStyle,
    disabled = false,
    ...props
}) {
    const { colors } = useTheme()
    const [isFocused, setIsFocused] = useState(false)
    const [isSecure, setIsSecure] = useState(secureTextEntry)

    const toggleSecureEntry = () => {
        setIsSecure(!isSecure)
    }

    const containerStyle = [
        styles.container,
        {
            borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
            backgroundColor: disabled ? colors.surface : colors.background,
        },
        style
    ]

    return (
        <View style={styles.wrapper}>
            {label && (
                <Text style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}

            <View style={containerStyle}>
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color={colors.textMuted}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[
                        styles.input,
                        {
                            color: colors.text,
                            minHeight: multiline ? numberOfLines * 20 : undefined,
                        },
                        inputStyle
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isSecure}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    editable={!disabled}
                    {...props}
                />

                {secureTextEntry && (
                    <TouchableOpacity onPress={toggleSecureEntry} style={styles.rightIcon}>
                        <Ionicons
                            name={isSecure ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                )}

                {rightIcon && !secureTextEntry && (
                    <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
                        <Ionicons
                            name={rightIcon}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {(error || helperText) && (
                <Text style={[
                    styles.helperText,
                    { color: error ? colors.error : colors.textSecondary }
                ]}>
                    {error || helperText}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    leftIcon: {
        marginRight: 12,
    },
    rightIcon: {
        marginLeft: 12,
        padding: 4,
    },
    helperText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
})