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

export default function QualitySelector({
    currentQuality,
    availableQualities = [],
    onQualityChange,
    style,
}) {
    const { colors } = useTheme()
    const [showModal, setShowModal] = useState(false)

    const qualityOrder = ['1080p', '720p', '480p', '360p', '240p', 'Auto']

    const sortedQualities = [...new Set(['Auto', ...availableQualities])]
        .sort((a, b) => {
            const indexA = qualityOrder.indexOf(a)
            const indexB = qualityOrder.indexOf(b)
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
        })

    const handleQualitySelect = (quality) => {
        if (quality !== currentQuality) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            onQualityChange?.(quality)
        }
        setShowModal(false)
    }

    const getQualityIcon = (quality) => {
        const qualityMap = {
            '1080p': 'videocam',
            '720p': 'videocam-outline',
            '480p': 'camera',
            '360p': 'camera-outline',
            '240p': 'phone-portrait',
            'Auto': 'settings',
        }
        return qualityMap[quality] || 'tv'
    }

    const getQualityDescription = (quality) => {
        const descriptions = {
            '1080p': 'Full HD - Mejor calidad',
            '720p': 'HD - Buena calidad',
            '480p': 'SD - Calidad estándar',
            '360p': 'Baja - Menos datos',
            '240p': 'Muy baja - Mínimos datos',
            'Auto': 'Automática - Según conexión',
        }
        return descriptions[quality] || 'Calidad personalizada'
    }

    if (sortedQualities.length <= 1) {
        return null
    }

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={[styles.selectorButton, { backgroundColor: colors.surface }]}
                onPress={() => setShowModal(true)}
            >
                <View style={styles.buttonContent}>
                    <Ionicons
                        name={getQualityIcon(currentQuality || 'Auto')}
                        size={20}
                        color={colors.primary}
                    />
                    <View style={styles.textContent}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Calidad
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {currentQuality || 'Auto'}
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
                            Seleccionar Calidad
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.qualityList} showsVerticalScrollIndicator={false}>
                        {sortedQualities.map((quality) => {
                            const isSelected = quality === (currentQuality || 'Auto')

                            return (
                                <TouchableOpacity
                                    key={quality}
                                    style={[
                                        styles.qualityItem,
                                        {
                                            backgroundColor: isSelected
                                                ? colors.primary + '20'
                                                : colors.surface,
                                            borderColor: isSelected
                                                ? colors.primary
                                                : colors.border,
                                        }
                                    ]}
                                    onPress={() => handleQualitySelect(quality)}
                                >
                                    <View style={styles.qualityIcon}>
                                        <Ionicons
                                            name={getQualityIcon(quality)}
                                            size={24}
                                            color={isSelected ? colors.primary : colors.textMuted}
                                        />
                                    </View>

                                    <View style={styles.qualityInfo}>
                                        <Text style={[styles.qualityTitle, { color: colors.text }]}>
                                            {quality}
                                        </Text>
                                        <Text style={[styles.qualityDescription, { color: colors.textSecondary }]}>
                                            {getQualityDescription(quality)}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name={isSelected ? "checkmark-circle" : "radio-button-off"}
                                        size={24}
                                        color={isSelected ? colors.primary : colors.textMuted}
                                    />
                                </TouchableOpacity>
                            )
                        })}
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
        maxHeight: 500,
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
    qualityList: {
        maxHeight: 350,
    },
    qualityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
    },
    qualityIcon: {
        marginRight: 16,
    },
    qualityInfo: {
        flex: 1,
    },
    qualityTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    qualityDescription: {
        fontSize: 12,
    },
    footer: {
        borderTopWidth: 1,
        paddingTop: 16,
        marginTop: 16,
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
})