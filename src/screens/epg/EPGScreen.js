import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'

export default function EPGScreen({ route, navigation }) {
    const { colors } = useTheme()
    const { channel } = route.params || {}
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Mock EPG data - en una app real vendría del API
    const mockSchedule = [
        {
            id: '1',
            time: '06:00',
            title: 'Noticias Matutinas',
            description: 'Resumen de las noticias más importantes del día',
            duration: '60 min',
            category: 'Noticias',
        },
        {
            id: '2',
            time: '07:00',
            title: 'Programa Deportivo',
            description: 'Análisis y resultados deportivos',
            duration: '90 min',
            category: 'Deportes',
        },
        {
            id: '3',
            time: '08:30',
            title: 'Telenovela',
            description: 'Capítulo 145: El gran secreto',
            duration: '60 min',
            category: 'Drama',
        },
        {
            id: '4',
            time: '09:30',
            title: 'Programa de Cocina',
            description: 'Recetas tradicionales mexicanas',
            duration: '30 min',
            category: 'Lifestyle',
        },
    ]

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const renderProgramItem = ({ item }) => (
        <View style={[styles.programItem, { backgroundColor: colors.surface }]}>
            <View style={styles.timeContainer}>
                <Text style={[styles.time, { color: colors.primary }]}>{item.time}</Text>
                <Text style={[styles.duration, { color: colors.textMuted }]}>{item.duration}</Text>
            </View>
            <View style={styles.programInfo}>
                <Text style={[styles.programTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.programDescription, { color: colors.textSecondary }]}>
                    {item.description}
                </Text>
                <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
                </View>
            </View>
        </View>
    )

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={colors.gradient}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>📺 Guía EPG</Text>
                        {channel && (
                            <Text style={styles.channelName}>{channel.name}</Text>
                        )}
                    </View>
                </View>
            </LinearGradient>

            {/* Date Selector */}
            <View style={[styles.dateSelector, { backgroundColor: colors.surface }]}>
                <TouchableOpacity style={styles.dateButton}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                    <Text style={[styles.dateText, { color: colors.text }]}>
                        {formatDate(selectedDate)}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Program Schedule */}
            <FlatList
                data={mockSchedule}
                renderItem={renderProgramItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.scheduleList}
                showsVerticalScrollIndicator={false}
            />

            {/* Empty State */}
            {mockSchedule.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="tv-outline" size={64} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        Sin programación disponible
                    </Text>
                    <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                        No hay información de EPG para este canal en este momento.
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 120,
        paddingTop: 50,
        justifyContent: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    channelName: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    dateSelector: {
        padding: 16,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        textTransform: 'capitalize',
    },
    scheduleList: {
        padding: 20,
    },
    programItem: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    timeContainer: {
        alignItems: 'center',
        marginRight: 16,
        minWidth: 60,
    },
    time: {
        fontSize: 16,
        fontWeight: '700',
    },
    duration: {
        fontSize: 12,
        marginTop: 4,
    },
    programInfo: {
        flex: 1,
    },
    programTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    programDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
})