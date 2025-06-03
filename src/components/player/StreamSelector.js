import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'
import Modal from '../ui/Modal'

export default function StreamSelector({
    streams = [],
    currentIndex = 0,
    onStreamChange,
    style,
}) {
    const { colors } = useTheme()
    const [showModal, setShowModal] = useState(false)

    const handleStreamSelect = (index) => {
        if (index !== currentIndex) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            onStreamChange?.(index)
        }
        setShowModal(false)
    }

    const getStreamQualityText = (stream) => {
        if (stream.quality) {
            return stream.quality
        }
        return 'Auto'
    }

    const getStreamStatusIcon = (stream, index) => {
        if (index === currentIndex) {
            return 'radio-button-on'
        }
        return 'radio-button-off'
    }

    const currentStream = streams[currentIndex]

    if (!streams || streams.length <= 1) {
        return null
    }

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={[styles.selectorButton, { backgroundColor: colors.surface }]}
                onPress={() => setShowModal(true)}
            >
                <View style={styles.buttonContent}>
                    <Ionicons name="settings" size={20} color={colors.primary} />
                    <View style={styles.textContent}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Stream
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {getStreamQualityText(currentStream)} ({currentIndex + 1}/{streams.length})
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <Modal
                visible={showModal}
                onClose={() => setShowModal(false)}
                animationType="slide"
                position="bottom"
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Seleccionar Stream
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.streamList} showsVerticalScrollIndicator={false}>
                        {streams.map((stream, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.streamItem,
                                    {
                                        backgroundColor: index === currentIndex
                                            ? colors.primary + '20'
                                            : colors.surface,
                                        borderColor: index === currentIndex
                                            ? colors.primary
                                            : colors.border,
                                    }
                                ]}
                                onPress={() => handleStreamSelect(index)}
                            >
                                <View style={styles.streamInfo}>
                                    <View style={styles.streamHeader}>
                                        <Text style={[styles.streamTitle, { color: colors.text }]}>
                                            Stream {index + 1}
                                        </Text>
                                        <Text style={[styles.streamQuality, { color: colors.primary }]}>
                                            {getStreamQualityText(stream)}
                                        </Text>
                                    </View>

                                    {stream.url && (
                                        <Text
                                            style={[styles.streamUrl, { color: colors.textSecondary }]}
                                            numberOfLines={1}
                                        >
                                            {stream.url}
                                        </Text>
                                    )}

                                    <View style={styles.streamMeta}>
                                        {stream.referrer && (
                                            <Text style={[styles.streamMetaText, { color: colors.textMuted }]}>
                                                Referrer: {stream.referrer}
                                            </Text>
                                        )}
                                        {stream.user_agent && (
                                            <Text style={[styles.streamMetaText, { color: colors.textMuted }]}>
                                                User Agent: Custom
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <Ionicons
                                    name={getStreamStatusIcon(stream, index)}
                                    size={24}
                                    color={index === currentIndex ? colors.primary : colors.textMuted}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContent: {
        marginLeft: 12,
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
    modalContent: {
        maxHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    streamList: {
        maxHeight: 300,
    },
    streamItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
    },
    streamInfo: {
        flex: 1,
    },
    streamHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    streamTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    streamQuality: {
        fontSize: 12,
        fontWeight: '700',
        backgroundColor: 'rgba(255, 107, 53, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    streamUrl: {
        fontSize: 12,
        marginBottom: 8,
    },
    streamMeta: {
        gap: 2,
    },
    streamMetaText: {
        fontSize: 10,
    },
})