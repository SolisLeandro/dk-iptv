import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'

import { useTheme } from '../../hooks/useTheme'
import Modal from '../ui/Modal'

export default function StreamDebugger({ stream, visible, onClose }) {
    const { colors } = useTheme()

    const copyToClipboard = async (text, label) => {
        try {
            await Clipboard.setStringAsync(text)
            Toast.show({
                type: 'success',
                text1: '📋 Copiado',
                text2: `${label} copiado al portapapeles`,
                position: 'bottom',
            })
        } catch (error) {
            console.error('Error copying to clipboard:', error)
        }
    }

    const openInBrowser = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url)
            if (supported) {
                await Linking.openURL(url)
            }
        } catch (error) {
            console.error('Error opening URL:', error)
        }
    }

    const testStreamDirectly = async () => {
        if (stream?.url) {
            await openInBrowser(stream.url)
        }
    }

    if (!stream) return null

    const InfoRow = ({ label, value, copyable = false, openable = false }) => (
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}:</Text>
            <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: colors.text }]} numberOfLines={3}>
                    {value || 'No disponible'}
                </Text>
                {value && (
                    <View style={styles.actions}>
                        {copyable && (
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                                onPress={() => copyToClipboard(value, label)}
                            >
                                <Ionicons name="copy" size={16} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                        {openable && (
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: colors.secondary + '20' }]}
                                onPress={() => openInBrowser(value)}
                            >
                                <Ionicons name="open" size={16} color={colors.secondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </View>
    )

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            position="bottom"
            animationType="slide"
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        🔍 Información del Stream
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <InfoRow 
                        label="Canal" 
                        value={stream.channel} 
                        copyable 
                    />
                    
                    <InfoRow 
                        label="Feed" 
                        value={stream.feed} 
                        copyable 
                    />
                    
                    <InfoRow 
                        label="URL del Stream" 
                        value={stream.url} 
                        copyable 
                        openable 
                    />
                    
                    <InfoRow 
                        label="Referrer" 
                        value={stream.referrer} 
                        copyable 
                        openable 
                    />
                    
                    <InfoRow 
                        label="User Agent" 
                        value={stream.user_agent} 
                        copyable 
                    />
                    
                    <InfoRow 
                        label="Calidad" 
                        value={stream.quality} 
                    />

                    {/* Información adicional */}
                    <View style={[styles.section, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            📊 Análisis del Stream
                        </Text>
                        
                        <View style={styles.analysisItem}>
                            <Ionicons 
                                name={stream.referrer ? "checkmark-circle" : "close-circle"} 
                                size={20} 
                                color={stream.referrer ? colors.success : colors.error} 
                            />
                            <Text style={[styles.analysisText, { color: colors.text }]}>
                                {stream.referrer ? 'Tiene Referrer requerido' : 'Sin Referrer (puede causar errores)'}
                            </Text>
                        </View>

                        <View style={styles.analysisItem}>
                            <Ionicons 
                                name={stream.user_agent ? "checkmark-circle" : "information-circle"} 
                                size={20} 
                                color={stream.user_agent ? colors.success : colors.warning} 
                            />
                            <Text style={[styles.analysisText, { color: colors.text }]}>
                                {stream.user_agent ? 'Tiene User Agent personalizado' : 'Sin User Agent personalizado'}
                            </Text>
                        </View>

                        <View style={styles.analysisItem}>
                            <Ionicons 
                                name={stream.url?.includes('.m3u8') ? "videocam" : "help-circle"} 
                                size={20} 
                                color={stream.url?.includes('.m3u8') ? colors.info : colors.warning} 
                            />
                            <Text style={[styles.analysisText, { color: colors.text }]}>
                                {stream.url?.includes('.m3u8') ? 'Stream HLS (.m3u8)' : 'Formato de stream desconocido'}
                            </Text>
                        </View>
                    </View>

                    {/* Acciones de debugging */}
                    <View style={styles.debugActions}>
                        <TouchableOpacity
                            style={[styles.debugButton, { backgroundColor: colors.primary }]}
                            onPress={testStreamDirectly}
                        >
                            <Ionicons name="play" size={20} color="#FFFFFF" />
                            <Text style={styles.debugButtonText}>Probar en Navegador</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.debugButton, { backgroundColor: colors.secondary }]}
                            onPress={() => copyToClipboard(JSON.stringify(stream, null, 2), 'Información completa')}
                        >
                            <Ionicons name="document-text" size={20} color="#FFFFFF" />
                            <Text style={styles.debugButtonText}>Copiar Todo</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        maxHeight: 400,
    },
    infoRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    value: {
        fontSize: 14,
        flex: 1,
        marginRight: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 6,
        borderRadius: 6,
    },
    section: {
        padding: 16,
        borderRadius: 12,
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    analysisItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    analysisText: {
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    debugActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    debugButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    debugButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
})